'use client';

import { useEffect } from 'react';
import Navbar from '../components/layout/navbar/page';
import MainSpeech from './_components/MainSpeech';
import { useAuth } from '@clerk/nextjs';
import Header from 'app/components/layout/header/page';

const SpeakPage = () => {
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    console.log('isSignedIn: ', isSignedIn);
    console.log('userId', userId);
  });
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header*/}
      <Header title="Let's speak Japanesea" />
      <main className="container mx-auto px-4 pt-8 pb-24">
        {/* MainSpeach */}
        <MainSpeech />
      </main>

      <Navbar />
    </div>
  );
};

export default SpeakPage;
