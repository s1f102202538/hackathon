// components/Map.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Coordinate {
  lat: number;
  lng: number;
  title: string[]; // title を配列として保持
}

interface MapComponentProps {
  coordinates: Coordinate[];
  iconPath: string; // 通常時のアイコンのパス
  selectedIconPath: string; // 選択時のアイコンのパス
  searchTerm: string; // 検索語
  searchKey: number; // 検索のトリガー（毎回検索が実行されるたびに増加）
}

const MapComponent: React.FC<MapComponentProps> = ({
  coordinates,
  iconPath,
  selectedIconPath,
  searchTerm,
  searchKey, // 追加
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.OverlayView | null>(null);
  const [currentSelectedTitles, setCurrentSelectedTitles] = useState<string[]>([]);

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
          private content: HTMLElement;
          private containerDiv: HTMLDivElement;
          private map: google.maps.Map;

          constructor(
            position: google.maps.LatLng,
            titles: string[],
            onStreetView: () => void,
            map: google.maps.Map
          ) {
            super();
            this.position = position;
            this.map = map;

            // コンテナの作成
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

            const streetViewButton = document.createElement('button');
            streetViewButton.innerText = 'Street View';
            streetViewButton.style.display = 'block';
            streetViewButton.style.margin = '8px auto 0 auto';
            streetViewButton.style.padding = '5px 10px';
            streetViewButton.style.fontSize = '13px';
            streetViewButton.style.cursor = 'pointer';
            streetViewButton.style.backgroundColor = '#4285F4';
            streetViewButton.style.color = '#fff';
            streetViewButton.style.border = 'none';
            streetViewButton.style.borderRadius = '3px';

            streetViewButton.addEventListener('click', (e) => {
              e.stopPropagation();
              onStreetView();
            });

            contentDiv.appendChild(streetViewButton);

            const arrow = document.createElement('div');
            arrow.style.position = 'absolute';
            arrow.style.bottom = '-10px';
            arrow.style.left = '50%';
            arrow.style.transform = 'translateX(-50%)';
            arrow.style.width = '0';
            arrow.style.height = '0';
            arrow.style.borderLeft = '6px solid transparent';
            arrow.style.borderRight = '6px solid transparent';
            arrow.style.borderTop = '10px solid rgba(255, 255, 255, 0.8)';

            this.content.appendChild(arrow);
            this.containerDiv.appendChild(this.content);
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
              this.containerDiv.style.transform = 'translate(-50%, -250%)';
            }
          }

          onRemove() {
            if (this.containerDiv.parentNode) {
              this.containerDiv.parentNode.removeChild(this.containerDiv);
            }
          }

          // InfoWindow を閉じるメソッド
          close() {
            this.setMap(null);
          }
        }

        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(
            document.getElementById('map') as HTMLElement,
            {
              center: coordinateArray[0]
                ? { lat: coordinateArray[0].lat, lng: coordinateArray[0].lng }
                : { lat: 0, lng: 0 },
              zoom: 5,
            }
          );
        }

        // 既存のマーカーを削除
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // マーカーを追加
        coordinates.forEach((coord) => {
          const marker = new google.maps.Marker({
            position: { lat: coord.lat, lng: coord.lng },
            map: mapRef.current!,
            title: coord.title.join(', '), // マーカーのタイトルは結合した文字列
            icon: iconPath, // 通常時のアイコンを初期設定
          });

          // マーカークリック時のイベントリスナーを追加
          marker.addListener('click', () => {
            setCurrentSelectedTitles(coord.title);

            // 既存の InfoWindow を閉じる
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
              mapRef.current!
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

        // 地図の範囲を調整
        if (coordinateArray.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          coordinateArray.forEach((coord) => {
            bounds.extend({ lat: coord.lat, lng: coord.lng });
          });
          mapRef.current.fitBounds(bounds);
        }
      })
      .catch((e) => {
        console.error('Failed to load Google Maps API:', e);
      });
  }, [coordinateArray, iconPath, selectedIconPath]); // 依存配列は useEffect の第二引数

  // 検索語が送信されたときに一致するタイトルを探して選択
  useEffect(() => {
    if (searchTerm.trim() === '') {
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
  }, [searchTerm, searchKey, coordinateArray]);

  // 選択されたタイトルに基づいてマーカーのアイコンとアニメーションを更新
  useEffect(() => {
    markersRef.current.forEach((marker) => {
      const title = marker.getTitle();
      if (!title) {
        // title が null の場合はスキップ
        return;
      }

      const markerTitles = title.split(', ');
      const isSelected = markerTitles.some((t) => currentSelectedTitles.includes(t));

      if (isSelected) {
        marker.setIcon(selectedIconPath); // 選択時のアイコンに変更
        marker.setAnimation(google.maps.Animation.BOUNCE); // アニメーションを開始

        // アニメーションは一度だけ実行
        setTimeout(() => {
          marker.setAnimation(null);
        }, 1400); // 1400ms後に停止（約2回バウンド）
      } else {
        marker.setIcon(iconPath); // 通常時のアイコンに戻す
        marker.setAnimation(null); // アニメーションを停止
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

  // マーカーのリセット関数
  const resetMarkers = () => {
    markersRef.current.forEach((marker) => {
      marker.setIcon(iconPath);
      marker.setAnimation(null);
    });
  };

  return <div id="map" style={{ width: '100%', height: '100vh' }} />;
};

export default MapComponent;
