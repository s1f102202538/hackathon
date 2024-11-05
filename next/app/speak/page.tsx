'use client';

import Header from '../components/layout/header/page';
import Navbar from '../components/layout/navbar/page';
import MainSpeech from './_components/MainSpeech';
import TranslationCard from './_components/TranslationCard';

const SpeakPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header*/}
      <Header title="Let's speak Japanese" />
      <main className="container mx-auto px-4 pt-8 pb-24">
        {/* MainSpeach */}
        <MainSpeech />

        {/* Translation Cards */}
        <div className="grid grid-cols-3 gap-4 ">
          <TranslationCard mean="Ikebukuro" ja="池袋" roman="Ikebukuro" />
          <TranslationCard mean="want to go" ja="行きたい" roman="ikitai" />
          <TranslationCard mean="want to go" ja="行きたい" roman="ikitai" />
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default SpeakPage;
