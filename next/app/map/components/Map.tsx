// components/Map.tsx
'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

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
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.OverlayView | null>(null);
  const [currentSelectedTitles, setCurrentSelectedTitles] = useState<string[]>([]);

  // Transform coordinates into an array of coordinate objects
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

  // Map and marker initialization
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
            contentDiv.innerHTML = titles
              .map((title) => {
                return `<span style="background-color: #ffff00; padding: 2px; border-radius: 3px;">${title}</span>`;
              })
              .join(', ');
            contentDiv.style.background = 'rgba(255, 255, 255, 0.6)';
            contentDiv.style.padding = '6px';
            contentDiv.style.borderRadius = '4px';
            contentDiv.style.fontSize = '13px';
            contentDiv.style.pointerEvents = 'none';
            contentDiv.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
            contentDiv.style.position = 'relative';

            const lineBreak = document.createElement('br');
            contentDiv.appendChild(lineBreak);

            const streetViewButton = document.createElement('button');
            streetViewButton.innerText = 'Street View';
            streetViewButton.style.display = 'block';
            streetViewButton.style.margin = '8px auto';
            streetViewButton.style.padding = '5px 5px';
            streetViewButton.style.fontSize = '13px';
            streetViewButton.style.cursor = 'pointer';
            streetViewButton.style.backgroundColor = '#4285F4';
            streetViewButton.style.color = '#fff';
            streetViewButton.style.border = 'none';
            streetViewButton.style.borderRadius = '3px';
            streetViewButton.style.pointerEvents = 'auto';

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

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        coordinateArray.forEach((coord) => {
          const marker = new google.maps.Marker({
            position: { lat: coord.lat, lng: coord.lng },
            map: mapRef.current!,
            title: coord.words.join(', '),
            icon: iconPath,
          });

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
  }, [coordinateArray, iconPath, selectedIconPath]);

  // Handle searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setCurrentSelectedTitles([]);
      resetMarkers();
      return;
    }

    const matchedCoordinates = coordinateArray.filter((coord) =>
      coord.words.some((t) => t.toLowerCase() === searchTerm.trim().toLowerCase())
    );

    if (matchedCoordinates.length > 0) {
      const matchedTitles = matchedCoordinates.flatMap((coord) => coord.words);
      setCurrentSelectedTitles(matchedTitles);

      matchedCoordinates.forEach((matchedCoord) => {
        const markerToSelect = markersRef.current.find((marker) => {
          const title = marker.getTitle();
          if (!title) return false;
          return title.split(', ').some((t) => matchedCoord.words.includes(t));
        });

        if (markerToSelect) {
          google.maps.event.trigger(markerToSelect, 'click');
        }
      });
    } else {
      setCurrentSelectedTitles([]);
      resetMarkers();
    }
  }, [searchTerm, searchKey]);

  // Update markers based on currentSelectedTitles
  useEffect(() => {
    markersRef.current.forEach((marker) => {
      const title = marker.getTitle();
      if (!title) return;

      const markerTitles = title.split(', ');
      const isSelected = markerTitles.some((t) => currentSelectedTitles.includes(t));

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

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;
