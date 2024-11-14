// components/Map.tsx
'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// 型定義にカスタムプロパティを追加
declare global {
  interface MarkerWithWords extends google.maps.Marker {
    words?: string[];
  }
}

type Coordinate = {
  lat: number;
  lng: number;
  words: string[];
};

interface MapComponentProps {
  coordinates: {
    Latitude: string[];
    Longitude: string[];
    word: string[][];
  };
  iconPath: string;
  selectedIconPath: string;
  searchTerm: string;
  searchKey: number;
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
  const infoWindowRef = useRef<google.maps.OverlayView | null>(null);
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
        class CustomInfoWindow extends google.maps.OverlayView {
          private position: google.maps.LatLng;
          private containerDiv: HTMLDivElement;
          private map: google.maps.Map;
          private apiKey: string;

          constructor(
            position: google.maps.LatLng,
            titles: string[],
            onStreetView: () => void,
            map: google.maps.Map,
            apiKey: string
          ) {
            super();
            this.position = position;
            this.map = map;
            this.apiKey = apiKey;

            this.containerDiv = document.createElement('div');
            this.containerDiv.style.position = 'absolute';
            this.containerDiv.style.pointerEvents = 'none';
            this.containerDiv.style.zIndex = '1000'; // 高いz-indexを設定

            const contentDiv = document.createElement('div');
            contentDiv.style.background = 'rgba(255, 255, 255, 0.9)';
            contentDiv.style.padding = '10px';
            contentDiv.style.borderRadius = '4px';
            contentDiv.style.fontSize = '13px';
            contentDiv.style.pointerEvents = 'auto';
            contentDiv.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
            contentDiv.style.position = 'relative';
            contentDiv.style.textAlign = 'center';

            // タイトルをスタイリングして追加
            titles.forEach((title, index) => {
              const span = document.createElement('span');
              span.textContent = title;
              span.style.backgroundColor = '#ffff00';
              span.style.padding = '2px 4px';
              span.style.borderRadius = '3px';
              contentDiv.appendChild(span);
              if (index < titles.length - 1) {
                contentDiv.appendChild(document.createTextNode(', '));
              }
            });

            const lineBreak = document.createElement('br');
            contentDiv.appendChild(lineBreak);

            // ストリートビューの画像を作成
            const streetViewImage = document.createElement('img');
            streetViewImage.src =
              'https://maps.googleapis.com/maps/api/streetview?' +
              'size=200x100' +
              '&location=' +
              this.position.lat() +
              ',' +
              this.position.lng() +
              '&key=' +
              this.apiKey;
            streetViewImage.alt = 'Street View Image';
            streetViewImage.style.display = 'block';
            streetViewImage.style.margin = '8px auto 0 auto';
            streetViewImage.style.width = '200px';
            streetViewImage.style.height = '100px';
            streetViewImage.style.cursor = 'pointer';
            streetViewImage.style.borderRadius = '3px';
            streetViewImage.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
            streetViewImage.style.pointerEvents = 'auto'; // 明示的に設定

            // デバッグ用ログ
            streetViewImage.addEventListener('click', (e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('Street View Image clicked');
              onStreetView();
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
            arrow.style.borderTop = '8px solid rgba(255, 255, 255, 0.9)';

            contentDiv.appendChild(arrow);
            this.containerDiv.appendChild(contentDiv);
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
              this.containerDiv.style.transform = 'translate(-50%, -150%)';
            }
          }

          onRemove() {
            if (this.containerDiv.parentNode) {
              this.containerDiv.parentNode.removeChild(this.containerDiv);
            }
          }

          close() {
            this.setMap(null);
          }
        }

        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(
            document.getElementById('map') as HTMLElement,
            {
              center: { lat: 0, lng: 0 },
              zoom: 5,
              fullscreenControl: false, // マップ自体の全画面ボタンを無効化
              mapTypeControl: false,
              streetViewControl: true, // ストリートビューコントロールを有効化
            }
          );

          // ストリートビューの全画面ボタンを無効化
          const streetView = mapRef.current.getStreetView();
          streetView.setOptions({
            fullscreenControl: false, // 全画面ボタンを無効化
            // 他のオプションも必要に応じて設定できます
          });

          // マップのクリックリスナーを設定
          mapRef.current.addListener('click', () => {
            // 選択状態をリセット
            setCurrentSelectedTitles([]);
            resetMarkers();

            // 開いているインフォウィンドウを閉じる
            if (infoWindowRef.current) {
              (infoWindowRef.current as CustomInfoWindow).close();
              infoWindowRef.current = null;
            }
          });
        }

        // 既存のマーカーをクリア
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // 新しいマーカーを追加
        coordinateArray.forEach((coord) => {
          const marker = new google.maps.Marker({
            position: { lat: coord.lat, lng: coord.lng },
            map: mapRef.current!,
            title: coord.words.join(', '),
            icon: iconPath,
          }) as MarkerWithWords;

          // カスタムプロパティとして単語を設定
          marker.words = coord.words;

          marker.addListener('click', () => {
            setCurrentSelectedTitles(coord.words);

            if (infoWindowRef.current) {
              (infoWindowRef.current as CustomInfoWindow).close();
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
              mapRef.current!,
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

        // 初期表示時に全マーカーを含むように地図の範囲を調整
        if (coordinateArray.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          coordinateArray.forEach((coord) => {
            bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
          });
          mapRef.current.fitBounds(bounds);
        }
      })
  }, [coordinateArray, iconPath, selectedIconPath, apiKey]); // 依存配列を useEffect の第二引数として正しく配置

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
          word.toLowerCase() === trimmedSearchTerm ||
          word.toLowerCase().includes(trimmedSearchTerm)
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
        currentSelectedTitles
          .map((ct) => ct.toLowerCase())
          .includes(word.toLowerCase())
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
          currentSelectedTitles
            .map((ct) => ct.toLowerCase())
            .includes(word.toLowerCase())
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
