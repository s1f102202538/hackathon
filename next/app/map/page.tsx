"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/navbar/Navbar';
import WordStatsSearch from './_components/WordSearchInput';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useAuth } from '@clerk/nextjs';

const MapComponent = dynamic(() => import('./_components/Map'), { ssr: false });

interface Word {
  userLang: string;
  ja: string;       // 日本語のフィールド
  romaji: string;   // 追加: ローマ字のフィールド
}

interface WordLocation {
  lat: string;
  lon: string;
  words: Word[];
}

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchKey, setSearchKey] = useState<number>(0);
  const [coordinates, setCoordinates] = useState<{
    word: Word[][];
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
          Latitude: data.wordsLocationList.map((location: WordLocation) => location.lat),
          Longitude: data.wordsLocationList.map((location: WordLocation) => location.lon),
          word: data.wordsLocationList.map((location: WordLocation) =>
            location.words.map((word: Word) => ({
              userLang: word.userLang,
              ja: word.ja,          // 既存の日本語フィールド
              romaji: word.romaji,  // 追加: ローマ字フィールド
            }))
          ),
        });
      }
    }
    getWordsLocation();
  }, [userId]);

  const iconPath = '/images/mapicon_pin_red1_32x32.png';
  const selectedIconPath = '/images/mapicon_pin_blue1_32x32.png';

  console.log("Coordinates:", coordinates, "Search Term:", searchTerm, "Search Key:", searchKey);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setSearchKey((prevKey) => prevKey + 1);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <div style={{ position: 'absolute', width: '100%' }}>
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
