'use client';

import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from 'app/components/Loading';

const LanguageSelector: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 言語設定をしているユーザーが/select-languageに入ろうとしたら、speakにリダイレクト
  useEffect(() => {
    const checkLanguage = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const response = await axios.post('/api/user/get', {
            clientId: userId,
          });

          const usedLang = response.data.speakLang;

          if (usedLang) {
            toast.success('すでに言語が設定されています。');
            router.push('/speak');
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching usedLang:', error);
          setError('言語設定の取得中にエラーが発生しました。');
          setLoading(false);
        }
      }
    };
    checkLanguage();
  }, [isLoaded, isSignedIn, router, userId]);

  const handleLanguageSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLang(event.target.value);
    setError(null);
    setSuccessMessage(null);
  };

  // 言語を設定する前に確認を入れる
  const handleSave = async () => {
    if (!selectedLang) {
      setError('言語を選択してください。');
      return;
    }

    // 確認ダイアログを表示
    const isConfirmed = window.confirm(
      `The selected language is"${selectedLang}". \nThe selected language cannot be changed.\nAre you sure you want to save it?`
    );

    if (!isConfirmed) {
      // ユーザーがキャンセルを選択した場合、処理を中断
      return;
    }

    try {
      setIsSaving(true);
      const response = await axios.post('/api/save-language', {
        clientId: user?.id,
        usedLang: selectedLang,
      });

      if (response.status === 200) {
        setSuccessMessage('Language settings have been saved.');
        router.push('/speak');
      } else {
        setError('Failed to save language settings. Please try again.');
      }
    } catch (err) {
      console.error('Error saving language:', err);
      setError('Failed to save language settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-center">Select a language</h2>
        <div className="mb-6">
          <label htmlFor="language-select" className="block text-gray-700 font-medium mb-2">
            Language
          </label>
          <select
            id="language-select"
            value={selectedLang || ''}
            onChange={handleLanguageSelect}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              -- Select Language --
            </option>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="es-ES">Spanish</option>
            <option value="zh-CN">Chinese (Simplified)</option>
            <option value="ko-KR">Korean</option>
            <option value="it-IT">Italian</option>
            <option value="ru-RU">Russian</option>
          </select>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <button
          className={`w-full px-6 py-3 rounded bg-blue-500 text-white ${
            isSaving || !selectedLang ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          onClick={handleSave}
          disabled={isSaving || !selectedLang}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
