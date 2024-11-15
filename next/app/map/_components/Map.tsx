'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// 型定義にカスタムプロパティを追加
declare global {
  interface MarkerWithWords extends google.maps.Marker {
    words?: { userLang: string; ja: string; romaji?: string }[];
  }
}

type Coordinate = {
  lat: number;
  lng: number;
  words: { userLang: string; ja: string; romaji?: string }[];
};

interface Word {
  userLang: string;
  ja: string;
  romaji?: string; // 追加: ローマ字のフィールド（オプショナル）
}

interface MapComponentProps {
  coordinates: {
    Latitude: string[];
    Longitude: string[];
    word: Word[][];
  };
  iconPath: string;
  selectedIconPath: string;
  searchTerm: string;
  searchKey: number;
}

const JAPAN_CENTER = { lat: 36.2048, lng: 138.2529 };
const JAPAN_ZOOM = 5;
const SINGLE_MARKER_ZOOM = 11; // 単一マーカー時のズームレベルを追加
const isMobile = window.innerWidth <= 768; // モバイル用の画面幅の例
const fontSize = isMobile ? '12px' : '15px';
const jaFontSize = isMobile ? '11px' : '13px';
// CustomInfoWindowの型を定義（googleを参照しない）
interface CustomInfoWindowType {
  close(): void;
  setMap(map: google.maps.Map | null): void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  coordinates,
  iconPath,
  selectedIconPath,
  searchTerm,
  searchKey,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<MarkerWithWords[]>([]);
  const infoWindowRef = useRef<CustomInfoWindowType | null>(null);
  const [currentSelectedTitles, setCurrentSelectedTitles] = useState<string[]>([]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_APIKEY || '';

  // 座標をオブジェクトの配列に変換
  const coordinateArray = useMemo(() => {
    const array: Coordinate[] = [];
    const latitudes = coordinates.Latitude;
    const longitudes = coordinates.Longitude;
    const wordsArray = coordinates.word;

    for (let i = 0; i < latitudes.length; i++) {
      array.push({
        lat: parseFloat(latitudes[i]),
        lng: parseFloat(longitudes[i]),
        words: wordsArray[i],
      });
    }
    return array;
  }, [coordinates]);

  // マップとマーカーの初期化
  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      language: 'en',
    });

    loader
      .load()
      .then(() => {
        // CustomInfoWindow クラスをgoogleがロードされた後に定義
        class CustomInfoWindow extends google.maps.OverlayView {
          private position: google.maps.LatLng;
          private containerDiv: HTMLDivElement;
          private apiKey: string;
          private onStreetView: () => void;

          constructor(
            position: google.maps.LatLng,
            words: { userLang: string; ja: string; romaji?: string }[],
            onStreetView: () => void,
            apiKey: string
          ) {
            super();
            this.position = position;
            this.apiKey = apiKey;
            this.onStreetView = onStreetView;

            this.containerDiv = document.createElement('div');
            this.containerDiv.style.position = 'absolute';
            this.containerDiv.style.pointerEvents = 'none';
            this.containerDiv.style.zIndex = '9999'; // 高いz-indexを設定

            const contentDiv = document.createElement('div');
            contentDiv.style.background = 'rgba(240, 240, 240)';
            contentDiv.style.padding = '5px'; // パディングを調整
            contentDiv.style.borderRadius = '5px';
            contentDiv.style.fontSize = fontSize; // フォントサイズを小さく
            contentDiv.style.fontWeight = 'bold';
            contentDiv.style.pointerEvents = 'auto';
            contentDiv.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
            contentDiv.style.position = 'relative';
            contentDiv.style.textAlign = 'center';
            contentDiv.style.width = '250px'; // 幅を調整

            // 単語を包むコンテナを作成
            const wordsContainer = document.createElement('div');
            wordsContainer.style.display = 'flex';
            wordsContainer.style.flexWrap = 'wrap';
            wordsContainer.style.justifyContent = 'center';
            wordsContainer.style.gap = '4px'; // アイテム間のギャップを追加

            // 各単語を指定の形式で表示
            words.forEach((wordObj) => {
              const { userLang, ja, romaji } = wordObj;
              // ダブルクオーテーションとシングルクオーテーションを削除
              const cleanUserLang = userLang.replace(/['"]/g, '');
              const cleanJa = ja.replace(/['"]/g, '');
              const cleanRomaji = (romaji || '').replace(/['"]/g, '');

              const span = document.createElement('span');
              span.style.backgroundColor = '#ffff99';
              span.style.color = '#000000';
              span.style.borderRadius = '3px';
              span.style.display = 'inline-flex';
              span.style.alignItems = 'center';
              span.style.justifyContent = 'center';
              span.style.whiteSpace = 'nowrap';
              span.style.fontSize = fontSize;

              // userLang と開き括弧
              const userLangText = document.createTextNode(cleanUserLang + ':(');
              const endOfuserLangText = document.createTextNode(')');

              // ruby要素を作成
              const ruby = document.createElement('ruby');
              ruby.style.fontSize = fontSize;

              const jaText = document.createElement('span');
              jaText.textContent = cleanJa;
              jaText.style.fontSize = jaFontSize;

              ruby.appendChild(jaText);

              if (cleanRomaji) {
                const rt = document.createElement('rt');
                rt.textContent = cleanRomaji;
                rt.style.fontSize = jaFontSize;
                ruby.appendChild(rt);
              }

              // spanに要素を追加
              span.appendChild(userLangText);
              span.appendChild(ruby);
              span.appendChild(endOfuserLangText);

              wordsContainer.appendChild(span);
            });

            contentDiv.appendChild(wordsContainer);

            // ストリートビューの画像を作成
            const streetViewImage = document.createElement('img');
            streetViewImage.src =
              'https://maps.googleapis.com/maps/api/streetview?' +
              'size=240x100' +
              '&location=' +
              this.position.lat() +
              ',' +
              this.position.lng() +
              '&key=' +
              this.apiKey;
            streetViewImage.alt = 'Street View Image';
            streetViewImage.style.display = 'block';
            streetViewImage.style.margin = '5px auto 0 auto'; // 中央揃え
            streetViewImage.style.width = '240px'; // 幅を調整
            streetViewImage.style.height = '100px';
            streetViewImage.style.cursor = 'pointer';
            streetViewImage.style.borderRadius = '3px';
            streetViewImage.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
            streetViewImage.style.pointerEvents = 'auto';

            streetViewImage.addEventListener('click', (e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('Street View Image clicked');
              this.onStreetView();
            });

            contentDiv.appendChild(streetViewImage);

            const arrow = document.createElement('div');
            arrow.style.position = 'absolute';
            arrow.style.bottom = '-6px';
            arrow.style.left = '50%';
            arrow.style.transform = 'translateX(-50%)';
            arrow.style.width = '0';
            arrow.style.height = '0';
            arrow.style.borderLeft = '5px solid transparent';
            arrow.style.borderRight = '5px solid transparent';
            arrow.style.borderTop = '8px solid rgba(240, 240, 240, 0.9)';

            contentDiv.appendChild(arrow);
            this.containerDiv.appendChild(contentDiv);
          }

          close() {
            this.setMap(null);
          }

          onAdd() {
            const panes = this.getPanes();
            panes?.floatPane.appendChild(this.containerDiv);
          }

          draw() {
            const overlayProjection = this.getProjection();
            if (!overlayProjection) return;

            const position = overlayProjection.fromLatLngToDivPixel(this.position);
            if (position) {
              this.containerDiv.style.left = position.x + 'px';
              this.containerDiv.style.top = position.y + 'px';
              this.containerDiv.style.transform = 'translate(-50%, -125%)';
            }
          }

          onRemove() {
            if (this.containerDiv.parentNode) {
              this.containerDiv.parentNode.removeChild(this.containerDiv);
            }
          }
        }

        // マップの初期化
        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(
            document.getElementById('map') as HTMLElement,
            {
              center: JAPAN_CENTER, // 初期は日本の中心に設定
              zoom: JAPAN_ZOOM, // 初期は日本全体のズームレベルに設定
              fullscreenControl: false, // マップ自体の全画面ボタンを無効化
              mapTypeControl: false,
              streetViewControl: true, // ストリートビューコントロールを有効化
            }
          );

          // ストリートビューの全画面ボタンを無効化
          const streetView = mapRef.current.getStreetView();
          streetView.setOptions({
            fullscreenControl: false,
          });

          // マップのクリックリスナーを設定
          mapRef.current.addListener('click', () => {
            // 選択状態をリセット
            setCurrentSelectedTitles([]);
            resetMarkers();

            // 開いているインフォウィンドウを閉じる
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
              infoWindowRef.current = null;
            }
          });
        }

        // 既存のマーカーをクリア
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        if (coordinateArray.length > 0) {
          // 新しいマーカーを追加
          coordinateArray.forEach((coord) => {
            const marker = new google.maps.Marker({
              position: { lat: coord.lat, lng: coord.lng },
              map: mapRef.current!,
              title: coord.words.map((word) => word.userLang).join(', '), // userLang をタイトルに設定
              icon: iconPath,
            }) as MarkerWithWords;

            // カスタムプロパティとして単語を設定
            marker.words = coord.words;

            marker.addListener('click', () => {
              setCurrentSelectedTitles(coord.words.map((word) => word.userLang)); // userLang を選択タイトルとして設定

              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }

              infoWindowRef.current = new CustomInfoWindow(
                marker.getPosition()!,
                coord.words,
                () => {
                  const streetView = mapRef.current!.getStreetView();
                  streetView.setPosition(marker.getPosition()!);
                  streetView.setPov({
                    heading: 270,
                    pitch: 0,
                  });
                  streetView.setVisible(true);
                },
                apiKey
              );

              infoWindowRef.current.setMap(mapRef.current!);

              // ピンの色を変更し、アニメーションを付ける
              markersRef.current.forEach((m) => {
                if (m === marker) {
                  m.setIcon(selectedIconPath);
                  m.setAnimation(google.maps.Animation.BOUNCE);
                  setTimeout(() => {
                    m.setAnimation(null);
                  }, 1400);
                } else {
                  m.setIcon(iconPath);
                  m.setAnimation(null);
                }
              });
            });

            markersRef.current.push(marker);
          });

          // マーカーの数に応じて地図の表示を調整
          if (coordinateArray.length === 1) {
            const singleCoord = coordinateArray[0];
            mapRef.current.setCenter({ lat: singleCoord.lat, lng: singleCoord.lng });
            mapRef.current.setZoom(SINGLE_MARKER_ZOOM); // 単一マーカーのズームレベルを設定
          } else {
            // 複数マーカーがある場合は全てを表示するように範囲を調整
            const bounds = new google.maps.LatLngBounds();
            coordinateArray.forEach((coord) => {
              bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
            });
            mapRef.current.fitBounds(bounds);
          }
        } else {
          // 座標がない場合は日本全体を表示
          mapRef.current.setCenter(JAPAN_CENTER);
          mapRef.current.setZoom(JAPAN_ZOOM);
        }
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
      });
  }, [coordinateArray, iconPath, selectedIconPath, apiKey]);

  // searchTerm の変更を処理（部分一致も含む）
  useEffect(() => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (trimmedSearchTerm === '') {
      setCurrentSelectedTitles([]);
      resetMarkers();
      return;
    }

    // 現在選択されているタイトルを設定
    setCurrentSelectedTitles([searchTerm]);

    // すべてのマーカーをチェック
    markersRef.current.forEach((marker) => {
      const words = marker.words || [];
      const isMatch = words.some(
        (word) =>
          word.userLang.toLowerCase() === trimmedSearchTerm ||
          word.userLang.toLowerCase().includes(trimmedSearchTerm) ||
          word.ja.toLowerCase() === trimmedSearchTerm ||
          word.ja.toLowerCase().includes(trimmedSearchTerm)
      );
      if (isMatch) {
        google.maps.event.trigger(marker, 'click');
      }
    });
  }, [searchTerm, searchKey]);

  // 選択されたタイトルに基づいてマーカーを更新
  useEffect(() => {
    markersRef.current.forEach((marker) => {
      const words = marker.words || [];
      const isSelected = words.some((word) =>
        currentSelectedTitles.map((ct) => ct.toLowerCase()).includes(word.userLang.toLowerCase())
      );

      if (isSelected) {
        marker.setIcon(selectedIconPath);
        marker.setAnimation(google.maps.Animation.BOUNCE);

        setTimeout(() => {
          marker.setAnimation(null);
        }, 1400);
      } else {
        marker.setIcon(iconPath);
        marker.setAnimation(null);
      }
    });

    // 選択されたマーカーに基づいて地図の中心を調整（ズームは変更しない）
    if (currentSelectedTitles.length > 0 && mapRef.current) {
      const selectedMarkers = markersRef.current.filter((marker) => {
        const words = marker.words || [];
        return words.some((word) =>
          currentSelectedTitles.map((ct) => ct.toLowerCase()).includes(word.userLang.toLowerCase())
        );
      });

      if (selectedMarkers.length > 0) {
        // 中心点を計算
        const avgLat =
          selectedMarkers.reduce((sum, marker) => sum + marker.getPosition()!.lat(), 0) /
          selectedMarkers.length;
        const avgLng =
          selectedMarkers.reduce((sum, marker) => sum + marker.getPosition()!.lng(), 0) /
          selectedMarkers.length;

        mapRef.current.setCenter({ lat: avgLat, lng: avgLng });
      }
    }
  }, [currentSelectedTitles, iconPath, selectedIconPath]);

  const resetMarkers = () => {
    markersRef.current.forEach((marker) => {
      marker.setIcon(iconPath);
      marker.setAnimation(null);
    });
  };

  return (
    <>
      <div id="map" className="custom-map" style={{ width: '100%', height: '100vh' }} />
      <style>{`
        /* Zoom ControlとStreet View Controlの位置を調整 */
        .custom-map .gm-bundled-control-on-bottom {
          bottom: 35% !important;
        }
      `}</style>
    </>
  );
};

export default MapComponent;
