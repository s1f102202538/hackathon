// next/app/select-language/page.tsx
'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LanguageSelector: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLanguageSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLang(event.target.value);
    setError(null);
    setSuccessMessage(null); // 前回のメッセージをリセット
  };

  const handleSave = async () => {
    if (!selectedLang) {
      setError('言語を選択してください。');
      console.log('Save attempted without selecting a language.');
      return;
    }

    try {
      console.log(`Saving language: ${selectedLang}`);
      setIsSaving(true);
      const response = await axios.post('/api/save-language', {
        clientId: user?.id, // Clerk のユーザー ID を送信
        usedLang: selectedLang,
      });

      if (response.status === 200) {
        console.log('Language saved successfully.');
        setSuccessMessage('言語設定が保存されました。');
        console.log('保存された言語-----→', selectedLang);
        // 保存成功後に /speak にリダイレクト
        router.push('/speak');
      } else {
        console.log('Failed to save language. Status:', response.status);
        setError('言語設定の保存に失敗しました。再度お試しください。');
      }
    } catch (err) {
      console.error('Error saving language:', err);
      setError('言語設定の保存に失敗しました。再度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">言語を選択してください</h1>
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
            isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
