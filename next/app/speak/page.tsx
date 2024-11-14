'use client';

import Navbar from '../components/layout/navbar/Navbar';
import MainSpeech from './_components/MainSpeech';
import Header from 'app/components/layout/header/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

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

          const usedLang = response.data.speakLang;

          if (!usedLang) {
            console.log('User language not set, redirecting to /select-language');
            toast.success('言語選択に移動します');
            router.push('/select-language');
          } else {
            console.log(`User language: ${usedLang}`);
            setUsedLang(usedLang);
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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Header */}
      <Header title="Let's speak Japanese" />
      <main className="container mx-auto px-4 pt-8 pb-24">
        <p>slected language: {usedLang}</p>
        {/* MainSpeech */}
        <MainSpeech />
      </main>
      <Navbar />
    </div>
  );
};

export default SpeakPage;
