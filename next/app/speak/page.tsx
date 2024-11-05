'use client';

import Navbar from '../components/layout/navbar/page';
import MainSpeech from './_components/MainSpeech';

const SpeakPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header*/}
      <header className="bg-gradient-to-r from-sky-400 to-blue-500 p-4">
        <h1 className="text-2xl font-bold text-center text-white">Let&apos;s speak Japanese</h1>
      </header>
      <main className="container mx-auto px-4 pt-8 pb-24">
        {/* MainSpeach */}
        <MainSpeech />
      </main>

      <Navbar />
    </div>
  );
};

export default SpeakPage;
