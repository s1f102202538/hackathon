"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/navbar/Navbar';
import WordStatsSearch from './components/WordSearchInput';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useAuth } from '@clerk/nextjs';

const MapComponent = dynamic(() => import('./components/Map'), { ssr: false });

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchKey, setSearchKey] = useState<number>(0);
  const [coordinates, setCoordinates] = useState<{
    word: string[][];
    Latitude: string[];
    Longitude: string[];
  } | null>(null);

  const { userId } = useAuth();

  async function fetchWordsLocation() {
    try {
      const response = await axios.post('/api/words-location/get-list', {
        clientId: userId,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching words location:', error);
      return null;
    }
  }

  useEffect(() => {
    async function getWordsLocation() {
      const data = await fetchWordsLocation();
      if (data) {
        setCoordinates({
          Latitude: data.wordsLocationList.map(
            (location: {
              lat: string;
              lon: string;
              words: { romaji: string }[];
            }) => location.lat
          ),
          Longitude: data.wordsLocationList.map(
            (location: {
              lat: string;
              lon: string;
              words: { romaji: string }[];
            }) => location.lon
          ),
          word: data.wordsLocationList.map(
            (location: {
              lat: number;
              lon: number;
              words: { romaji: string }[];
            }) => location.words.map((word) => word['romaji'])
          ),
        });
      }
    }
    getWordsLocation();
  }, [userId]);
  const iconPath = '/images/mapicon_pin_red1_32x32.png';
  const selectedIconPath = '/images/mapicon_pin_blue1_32x32.png';

  console.log("ghsiugsdakfbahbgfahf",coordinates,searchTerm,searchKey)

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setSearchKey((prevKey) => prevKey + 1);
  };
  return (
    <div style={{height:'100%', width:'100%'}}>
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div style={{ position: 'absolute',  zIndex: 1, width: '100%' }}>
          <WordStatsSearch onSearch={handleSearch} />
        </div>
        {coordinates && (
          <MapComponent
            coordinates={coordinates}
            iconPath={iconPath}
            selectedIconPath={selectedIconPath}
            searchTerm={searchTerm}
            searchKey={searchKey}
          />
        )}
      <Navbar />
      </div>
    </div>
  );
};

export default HomePage;
