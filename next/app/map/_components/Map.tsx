'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Word } from 'app/types/Word';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../../components/ui/drawer';

declare global {
  interface MarkerWithWords extends google.maps.Marker {
    words: Word[];
    id: number;
    comment: string;
  }
}

type Coordinate = {
  lat: number;
  lng: number;
  words: Word[];
  id: number;
  comment: string;
};

interface MapComponentProps {
  coordinates: {
    Latitude: string[];
    Longitude: string[];
    word: Word[][];
    id: number[];
    comment: string[];
  };
  iconPath: string;
  selectedIconPath: string;
  searchTerm: string;
  searchKey: number;
}

const JAPAN_CENTER = { lat: 36.2048, lng: 138.2529 };
const JAPAN_ZOOM = 5;
const SINGLE_MARKER_ZOOM = 11;

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
  const { userId } = useAuth();
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<MarkerWithWords[]>([]);
  const infoWindowRef = useRef<CustomInfoWindowType | null>(null);
  const [currentSelectedTitles, setCurrentSelectedTitles] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<{ words: Word[]; comment: string; id: number } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState('');

  const handleOpenDrawer = (words: Word[], comment: string, id: number) => {
    setDrawerData({ words, comment, id });
    setEditedComment(comment);
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerData(null);
    setIsEditing(false);
  };

  const handleSaveComment = async () => {
    if (drawerData) {
      setDrawerData({ ...drawerData, comment: editedComment });
      // マーカーのコメントプロパティを更新
      const marker = markersRef.current.find((m) => m.id === drawerData.id);
      if (marker) {
        marker.comment = editedComment;
      }
      // コメントを更新するためのAPIコール
      try {
        const response = await axios.post('/api/words-location/save/comment', {
          clientId: userId,
          id: drawerData.id,
          comment: editedComment,
        });
        console.log('コメントが正常に更新されました', response);
      } catch (error) {
        console.error('コメントの更新中にエラーが発生しました:', error);
      }
      setIsEditing(false);
    }
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_APIKEY || '';

  const coordinateArray = useMemo(() => {
    const array: Coordinate[] = [];
    const latitudes = coordinates.Latitude;
    const longitudes = coordinates.Longitude;
    const wordsArray = coordinates.word;
    const ids = coordinates.id;
    const comments = coordinates.comment;

    for (let i = 0; i < latitudes.length; i++) {
      array.push({
        lat: parseFloat(latitudes[i]),
        lng: parseFloat(longitudes[i]),
        words: wordsArray[i],
        id: ids[i],
        comment: comments[i],
      });
    }
    return array;
  }, [coordinates]);

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
          private apiKey: string;
          private onStreetView: () => void;
          private onComment: (words: Word[], comment: string, id: number) => void;
          private comment: string;
          private id: number;

          constructor(
            position: google.maps.LatLng,
            words: Word[],
            comment: string,
            onStreetView: () => void,
            onComment: (words: Word[], comment: string, id: number) => void,
            apiKey: string,
            id: number
          ) {
            super();
            this.position = position;
            this.apiKey = apiKey;
            this.onStreetView = onStreetView;
            this.onComment = onComment;
            this.comment = comment;
            this.id = id;

            this.containerDiv = document.createElement('div');
            this.containerDiv.style.position = 'absolute';
            this.containerDiv.style.pointerEvents = 'none';
            this.containerDiv.style.pointerEvents = 'auto';
            this.containerDiv.style.zIndex = '9999';
            this.containerDiv.style.touchAction = 'auto'; // タッチイベントを有効にする

            const contentDiv = document.createElement('div');
            const isMobile = window.innerWidth <= 768;
            const fontSize = isMobile ? '12px' : '15px';
            const jaFontSize = isMobile ? '11px' : '13px';
            contentDiv.style.background = 'rgba(240, 240, 240)';
            contentDiv.style.padding = '5px';
            contentDiv.style.borderRadius = '5px';
            contentDiv.style.fontSize = fontSize;
            contentDiv.style.fontWeight = 'bold';
            contentDiv.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
            contentDiv.style.position = 'relative';
            contentDiv.style.textAlign = 'center';
            contentDiv.style.width = '300px';

            const wordsContainer = document.createElement('div');
            wordsContainer.style.display = 'flex';
            wordsContainer.style.flexWrap = 'wrap';
            wordsContainer.style.justifyContent = 'center';
            wordsContainer.style.gap = '4px';

            words.forEach((wordObj) => {
              const { userLang, ja, romaji } = wordObj;
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

              const userLangText = document.createTextNode(cleanUserLang + '(');
              const endOfuserLangText = document.createTextNode(')');

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

              span.appendChild(userLangText);
              span.appendChild(ruby);
              span.appendChild(endOfuserLangText);

              wordsContainer.appendChild(span);
            });

            contentDiv.appendChild(wordsContainer);

            // ストリートビュー画像の作成とイベントリスナーの設定
            const streetViewImage = document.createElement('img');
            streetViewImage.src =
              'https://maps.googleapis.com/maps/api/streetview?' +
              'size=290x100' +
              '&location=' +
              this.position.lat() +
              ',' +
              this.position.lng() +
              '&key=' +
              this.apiKey;
            streetViewImage.alt = 'ストリートビュー画像';
            streetViewImage.style.margin = '5px auto 0 auto';
            streetViewImage.style.width = '290px';
            streetViewImage.style.height = '100px';
            streetViewImage.style.cursor = 'pointer';
            streetViewImage.style.borderRadius = '3px';
            streetViewImage.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
            streetViewImage.style.pointerEvents = 'auto'; // クリック可能
            streetViewImage.style.touchAction = 'auto'; // タッチイベントを有効にする
            streetViewImage.style.zIndex = '10';

            streetViewImage.addEventListener('touchstart', (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.onStreetView();
            });

            streetViewImage.addEventListener('touchstart', (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.onStreetView();
            });

            streetViewImage.addEventListener('touchstart', (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.onStreetView();
            });

            streetViewImage.addEventListener('click', (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.onStreetView();
            });

            contentDiv.appendChild(streetViewImage);

            // コメントボタンの作成とイベントリスナーの設定
            const commentButton = document.createElement('button');
            commentButton.textContent = 'Comment';
            commentButton.style.marginTop = '5px';
            commentButton.style.backgroundColor = '#007bff';
            commentButton.style.color = '#fff';
            commentButton.style.width = '100%';
            commentButton.style.height = '30px';
            commentButton.style.border = 'none';
            commentButton.style.borderRadius = '3px';
            commentButton.style.cursor = 'pointer';
            commentButton.style.fontSize = fontSize;
            commentButton.style.pointerEvents = 'auto'; // クリック可能
            commentButton.style.touchAction = 'auto'; // タッチイベントを有効にする
            commentButton.style.zIndex = '10';

            commentButton.addEventListener('touchstart', (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.onComment(words, this.comment, this.id);
            });

            commentButton.addEventListener('touchstart', (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.onComment(words, this.comment, this.id);
            });

            commentButton.addEventListener('touchstart', (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.onComment(words, this.comment, this.id);
            });

            commentButton.addEventListener('click', (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.onComment(words, this.comment, this.id);
            });

            contentDiv.appendChild(commentButton);

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
              this.containerDiv.style.transform = 'translate(-50%, -120%)';
            }
          }

          onRemove() {
            if (this.containerDiv.parentNode) {
              this.containerDiv.parentNode.removeChild(this.containerDiv);
            }
          }
        }

        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(document.getElementById('map') as HTMLElement, {
            center: JAPAN_CENTER,
            zoom: JAPAN_ZOOM,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: true,
          });

          const streetView = mapRef.current.getStreetView();
          streetView.setOptions({
            fullscreenControl: false,
          });

          mapRef.current.addListener('click', () => {
            setCurrentSelectedTitles([]);
            resetMarkers();

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
          coordinateArray.forEach((coord) => {
            const marker = new google.maps.Marker({
              position: { lat: coord.lat, lng: coord.lng },
              map: mapRef.current!,
              title: coord.words.map((word) => word.userLang).join(', '),
              icon: iconPath,
            }) as MarkerWithWords;

            marker.words = coord.words;
            marker.id = coord.id;
            marker.comment = coord.comment;

            marker.addListener('click', () => {
              setCurrentSelectedTitles(coord.words.map((word) => word.userLang));

              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }

              infoWindowRef.current = new CustomInfoWindow(
                marker.getPosition()!,
                marker.words, // 最新の words を使用
                marker.comment, // 最新の comment を使用
                () => {
                  const streetView = mapRef.current!.getStreetView();
                  streetView.setPosition(marker.getPosition()!);
                  streetView.setPov({
                    heading: 270,
                    pitch: 0,
                  });
                  streetView.setVisible(true);
                },
                handleOpenDrawer,
                apiKey,
                marker.id // 最新の id を使用
              );

              infoWindowRef.current.setMap(mapRef.current!);

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

          if (coordinateArray.length === 1) {
            const singleCoord = coordinateArray[0];
            mapRef.current.setCenter({ lat: singleCoord.lat, lng: singleCoord.lng });
            mapRef.current.setZoom(SINGLE_MARKER_ZOOM);
          } else {
            const bounds = new google.maps.LatLngBounds();
            coordinateArray.forEach((coord) => {
              bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
            });
            mapRef.current.fitBounds(bounds);
          }
        } else {
          mapRef.current.setCenter(JAPAN_CENTER);
          mapRef.current.setZoom(JAPAN_ZOOM);
        }
      })
      .catch((error) => {
        console.error('Google Maps の読み込み中にエラーが発生しました:', error);
      });
  }, [coordinateArray, iconPath, selectedIconPath, apiKey]); // useEffect の依存配列

  useEffect(() => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (trimmedSearchTerm === '') {
      setCurrentSelectedTitles([]);
      resetMarkers();
      return;
    }

    setCurrentSelectedTitles([searchTerm]);

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

    if (currentSelectedTitles.length > 0 && mapRef.current) {
      const selectedMarkers = markersRef.current.filter((marker) => {
        const words = marker.words || [];
        return words.some((word) =>
          currentSelectedTitles.map((ct) => ct.toLowerCase()).includes(word.userLang.toLowerCase())
        );
      });

      if (selectedMarkers.length > 0) {
        const avgLat =
          selectedMarkers.reduce((sum, marker) => sum + marker.getPosition()!.lat(), 0) / selectedMarkers.length;
        const avgLng =
          selectedMarkers.reduce((sum, marker) => sum + marker.getPosition()!.lng(), 0) / selectedMarkers.length;

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
      <style>
        {`
          .custom-map .gm-bundled-control-on-bottom {
            bottom: 35% !important;
          }
        `}
      </style>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Comment</DrawerTitle>
            <DrawerDescription>
              {drawerData ? (
                <>
                  {isEditing ? (
                    <textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      style={{ width: '100%', height: '100px', marginTop: '16px' }}
                    />
                  ) : (
                    <>
                      {drawerData.comment && drawerData.comment.trim() !== '' && (
                        <div style={{ marginTop: '16px' }}>
                          <strong>Comment:</strong>
                          <p>{drawerData.comment}</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div>No data</div>
              )}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            {isEditing ? (
              <button
                onClick={handleSaveComment}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  width: '100%',
                  border: 'none',
                  textAlign: 'center',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '8px',
                }}
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '8px 16px',
                  width: '100%',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginRight: '8px',
                }}
              >
                Edit
              </button>
            )}
            <button
              onClick={handleCloseDrawer}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                textAlign: 'center',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MapComponent;
