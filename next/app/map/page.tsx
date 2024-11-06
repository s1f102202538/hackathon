import React from 'react';
import Header from '../components/layout/header/page';
import Navbar from '../components/layout/navbar/page';
import Map from './components/Map';
import WordUsageStats from './components/WordUsageStats';
import WordSearchInput from './components/WordSearchInput';

const mapExecutor = () => {
  return (
    <div style={{ padding: '5px', backgroundColor: '#F0F8FF' }}>
      <Header title="Word UsageMap" />
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <WordSearchInput placeholder="おはよう" />
      </div>
      <WordUsageStats />
      <Map latitude={35.6895} longitude={139.6917} zoom={13} />
      <Navbar />
    </div>
  );
};

export default mapExecutor;
