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
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_APIKEY;

    const loader = new Loader({
      apiKey: apiKey || '',
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

          constructor(
            position: google.maps.LatLng,
            titles: string[],
            onStreetView: () => void,
            map: google.maps.Map
          ) {
            super();
            this.position = position;
            this.map = map;

            this.containerDiv = document.createElement('div');
            this.containerDiv.style.position = 'absolute';
            this.containerDiv.style.pointerEvents = 'none';

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
              center: coordinateArray[0]
                ? { lat: coordinateArray[0].lat, lng: coordinateArray[0].lng }
                : { lat: 0, lng: 0 },
              zoom: 5,
            }
          );
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
              mapRef.current!
            );

            infoWindowRef.current.setMap(mapRef.current!);
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
  }, [searchTerm, searchKey, coordinateArray]);

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
  }, [currentSelectedTitles, iconPath, selectedIconPath]);

  const resetMarkers = () => {
    markersRef.current.forEach((marker) => {
      marker.setIcon(iconPath);
      marker.setAnimation(null);
    });
  };

  return <div id="map" style={{ width: '100%', height: '100vh' }} />;
};

export default MapComponent;
