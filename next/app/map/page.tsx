// HomePage.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/navbar/Navbar';
import WordStatsSearch from './_components/WordSearchInput';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useAuth } from '@clerk/nextjs';
import { Word } from 'app/types/Word';
import { WordsLocation } from 'app/types/WordsLocation';
import Loading from 'app/components/Loading';

const MapComponent = dynamic(() => import('./_components/Map'), { ssr: false });

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchKey, setSearchKey] = useState<number>(0);
  const [coordinates, setCoordinates] = useState<{
    comment: string[];
    id: number[];
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
          comment: data.wordsLocationList.map((location: WordsLocation) => location.comment),
          id: data.wordsLocationList.map((location: WordsLocation) => location.id),
          Latitude: data.wordsLocationList.map((location: WordsLocation) => location.lat),
          Longitude: data.wordsLocationList.map((location: WordsLocation) => location.lon),
          word: data.wordsLocationList.map((location: WordsLocation) =>
            location.words.map((word: Word) => ({
              userLang: word.userLang,
              ja: word.ja,
              romaji: word.romaji,
            }))
          ),
        });
      }
    }
    getWordsLocation();
  }, [userId]);

  const iconPath = '/images/mapicon_pin_red1_32x32.png';
  const selectedIconPath = '/images/mapicon_pin_blue1_32x32.png';

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
        {coordinates ? (
          <MapComponent
            coordinates={coordinates}
            iconPath={iconPath}
            selectedIconPath={selectedIconPath}
            searchTerm={searchTerm}
            searchKey={searchKey}
          />
        ) : (
          <Loading />
        )}
        <Navbar />
      </div>
    </div>
  );
};

export default HomePage;
