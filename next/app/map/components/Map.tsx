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
          private content: HTMLElement;
          private containerDiv: HTMLDivElement;

          constructor(position: google.maps.LatLng, content: string) {
            super();
            this.position = position;

            // コンテナの作成
            this.containerDiv = document.createElement('div');
            this.containerDiv.style.position = 'absolute';
            this.containerDiv.style.pointerEvents = 'none';

            // コンテンツの設定
            this.content = document.createElement('div');
            this.content.innerHTML = content;
            this.content.style.background = 'rgba(255, 255, 255, 0.6)';
            this.content.style.padding = '5px';
            this.content.style.borderRadius = '5px';
            this.content.style.fontSize = '12px';
            this.content.style.pointerEvents = 'auto';
            this.content.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
            this.content.style.position = 'relative';

            // ピンに向けた矢印を作成
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
          // マップを初期化
          mapRef.current = new google.maps.Map(
            document.getElementById('map') as HTMLElement,
            {
              center: coordinates[0] || { lat: 0, lng: 0 },
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
              (infoWindowRef.current as any).close();
            }

            // 新しい CustomInfoWindow を作成
            infoWindowRef.current = new CustomInfoWindow(
              marker.getPosition()!,
              `<div>${coord.title.join(', ')}</div>`
            );

            infoWindowRef.current.setMap(mapRef.current!);
          });

          markersRef.current.push(marker);
        });

        // マップの範囲を調整
        if (coordinates.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          coordinates.forEach((coord) => {
            bounds.extend({ lat: coord.lat, lng: coord.lng });
          });
          mapRef.current.fitBounds(bounds);
        }
      })
      .catch((e) => {
        console.error('Google Maps APIの読み込みに失敗しました:', e);
      });
  }, [coordinates, iconPath, selectedIconPath]);

  // 検索語が送信されたときに一致するタイトルを探して選択
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setCurrentSelectedTitles([]);
      resetMarkers();
      return;
    }

    // 検索語と一致する座標をすべて取得
    const matchedCoordinates = coordinates.filter((coord) =>
      coord.title.some((t) => t.toLowerCase() === searchTerm.trim().toLowerCase())
    );

    if (matchedCoordinates.length > 0) {
      const matchedTitles = matchedCoordinates.flatMap((coord) => coord.title);
      setCurrentSelectedTitles(matchedTitles);

      matchedCoordinates.forEach((matchedCoord) => {
        // マーカーを見つけてクリックイベントをプログラム的にトリガー
        const markerToSelect = markersRef.current.find((marker) => {
          const title = marker.getTitle();
          if (!title) return false;
          return title.split(', ').some((t) => matchedCoord.title.includes(t));
        });

        if (markerToSelect) {
          google.maps.event.trigger(markerToSelect, 'click');
        }
      });
    } else {
      // 一致する座標がない場合、選択をクリア
      setCurrentSelectedTitles([]);
      resetMarkers();
    }
  }, [searchTerm, searchKey]); // searchKey を依存配列に追加

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
  }, [currentSelectedTitles, iconPath, selectedIconPath]);

  // マーカーのリセット関数
  const resetMarkers = () => {
    markersRef.current.forEach((marker) => {
      marker.setIcon(iconPath);
      marker.setAnimation(null);
    });
  };

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;
