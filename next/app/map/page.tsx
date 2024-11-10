'use client';

import React, { useState } from 'react';
import Header from '../components/layout/header/page';
import Navbar from '../components/layout/navbar/page';
import WordUsageStats from './components/WordUsageStats';
import WordSearchInput from './components/WordSearchInput';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./components/Map'), { ssr: false });

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(''); // ステートを searchTerm に変更
  const [searchKey, setSearchKey] = useState<number>(0); // searchKey ステートを追加

  // 座標データを title を配列として保持
  const coordinates = [
    { Latitude: 40.8244, Longitude: 140.74, title: ['駅', 'どこ'] },
    { Latitude: 39.7036, Longitude: 141.1527, title: ['新宿', '行きたい'] },
    { Latitude: 38.2682, Longitude: 140.8694, title: ['池袋', '行きたい'] },
    { Latitude: 37.7503, Longitude: 140.4676, title: ['温泉', '休む'] },
    { Latitude: 36.3418, Longitude: 140.4468, title: ['海', '見たい'] },
    { Latitude: 35.6895, Longitude: 139.6917, title: ['渋谷', '楽しみ'] },
    { Latitude: 35.3934, Longitude: 136.7223, title: ['犬山城', '写真'] },
    { Latitude: 34.6937, Longitude: 135.5023, title: ['大阪城', '行く'] },
    { Latitude: 34.3966, Longitude: 132.4596, title: ['広島', '平和'] },
    { Latitude: 33.5902, Longitude: 130.4017, title: ['福岡', 'ラーメン'] },
  ].map((coord) => ({
    lat: coord.Latitude,
    lng: coord.Longitude,
    title: coord.title, // title を配列として保持
  }));

  const iconPath = '/images/mapicon_pin_red1_32x32.png';
  const selectedIconPath = '/images/mapicon_pin_blue1_32x32.png';

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm); // 検索語をステートに設定
    setSearchKey((prevKey) => prevKey + 1); // searchKey をインクリメント
  };

  return (
    <div style={{ backgroundColor: '#F0F8FF' }}>
      <Header title="Word Map" />
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <WordSearchInput placeholder="おはよう" onSearch={handleSearch} />
      </div>
      <WordUsageStats />
      <div style={{ marginBottom: '80px' }}>
        <MapComponent
          coordinates={coordinates}
          iconPath={iconPath}
          selectedIconPath={selectedIconPath}
          searchTerm={searchTerm} // searchTerm をプロパティとして渡す
          searchKey={searchKey} // searchKey をプロパティとして渡す
        />
      </div>
      <Navbar />
    </div>
  );
};

export default HomePage;
