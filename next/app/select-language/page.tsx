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
      `選択した言語は「${selectedLang}」です。\n選択した言語は変更できません。\n保存してもよろしいですか？`
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
        setSuccessMessage('言語設定が保存されました。');
        router.push('/speak');
      } else {
        setError('言語設定の保存に失敗しました。再度お試しください。');
      }
    } catch (err) {
      console.error('Error saving language:', err);
      setError('言語設定の保存に失敗しました。再度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-center">言語を選択してください</h2>
        <div className="mb-6">
          <label htmlFor="language-select" className="block text-gray-700 font-medium mb-2">
            言語
          </label>
          <select
            id="language-select"
            value={selectedLang || ''}
            onChange={handleLanguageSelect}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              -- 言語を選択 --
            </option>
            <option value="en-US">英語（米国）</option>
            <option value="en-GB">英語（英国）</option>
            <option value="ja-JP">日本語</option>
            <option value="fr-FR">フランス語</option>
            <option value="de-DE">ドイツ語</option>
            <option value="es-ES">スペイン語</option>
            <option value="zh-CN">中国語（簡体字）</option>
            <option value="ko-KR">韓国語</option>
            <option value="it-IT">イタリア語</option>
            <option value="ru-RU">ロシア語</option>
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
          {isSaving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
