'use client';

import Navbar from '../components/layout/navbar/Navbar';
import MainSpeech from './_components/MainSpeech';
import Header from 'app/components/layout/header/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { translations } from '../libs/i18n/translations';
import Loading from 'app/components/Loading';

const SpeakPage = () => {
  const { isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [usedLang, setUsedLang] = useState<string | null>(null);
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    const checkLanguage = async () => {
      if (isLoaded && userId) {
        try {
          const response = await axios.post('/api/user/get', {
            clientId: userId,
          });

          const fetchedUsedLang = response.data.speakLang;

          if (!fetchedUsedLang) {
            console.log('User language not set, redirecting to /select-language');
            toast.success('言語選択に移動します');
            router.push('/select-language');
          } else {
            console.log(`User language: ${fetchedUsedLang}`);
            setUsedLang(fetchedUsedLang);
          }
        } catch (error) {
          console.error('Error fetching usedLang:', error);
          // 必要に応じてエラーページにリダイレクト
        } finally {
          setLoading(false);
        }
      }
    };

    checkLanguage();
  }, [isLoaded, isSignedIn, router, userId]);

  if (loading) {
    return <Loading />;
  }

  // usedLang が null の場合は何も表示しない（リダイレクトされているはず）
  if (!usedLang) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Header */}
      <Header title="Let's speak Japanese" />
      <main className="container mx-auto px-1 pt-2 pb-24">
        <p className="ml-4">{translations[usedLang]?.selectedLanguage}</p>
        {/* MainSpeech に usedLang と translations を渡す */}
        <MainSpeech usedLang={usedLang} translations={translations[usedLang]} />
      </main>
      <Navbar />
    </div>
  );
};

export default SpeakPage;
