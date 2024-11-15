// <next/app/speak/_components/SpeechSection.tsx>
'use client';

import { Mic, Square, Languages, ArrowRightLeft } from 'lucide-react';
import React from 'react';
import { Input } from '../../components/ui/input';
import { Translations } from '../../libs/i18n/translations'; // 翻訳データの型をインポート

type SpeechSectionProps = {
  title: string;
  isRecording: boolean;
  toggleRecording: () => void;
  transcript: string;
  inputText: string;
  setInputText: (text: string) => void;
  handleTranslate?: () => void; // オプションプロパティ
  children: React.ReactNode;
  isLoading?: boolean;
  translations?: Translations[string]; // オプショナルな翻訳データ
};

const SpeechSection: React.FC<SpeechSectionProps> = ({
  title,
  isRecording,
  toggleRecording,
  inputText,
  setInputText,
  handleTranslate,
  children,
  isLoading = false,
  translations,
}) => {
  // テキスト入力の変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <div>
      {/* セクションヘッダー */}
      <div className="bg-gradient-to-r from-sky-100 to-blue-100 p-2 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-semibold text-gray-800">{title}</h2>
          <button
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 focus:outline-none"
            aria-label="Select Language"
          >
            <Languages className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* セクションコンテンツ */}
      <div className="bg-white shadow-md p-4 mb-4 rounded-b-xl">
        {/* Languagesボタン、マイクボタン、Inputフィールドを横並びに */}
        <div className="flex items-center">
          {/* マイクボタン */}
          <button
            onClick={toggleRecording}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 shadow-lg shadow-red-500/50'
                : 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg shadow-blue-500/50'
            }`}
          >
            {isRecording ? (
              <Square className="w-5 h-5 text-white" /> // 録音中は停止アイコン
            ) : (
              <Mic className="w-5 h-5 text-white" /> // 通常はマイクアイコン
            )}
          </button>

          {/* Inputフィールド */}
          <Input
            value={inputText}
            onChange={handleInputChange}
            placeholder={translations?.inputPlaceholder || 'Enter text here...'}
            className="flex-grow bg-white border border-gray-200 focus:border-blue-500 focus:ring-blue-500 ml-4"
          />

          {/* Translateボタン */}
          {handleTranslate && (
            <button
              onClick={handleTranslate}
              className="flex-shrink-0 mx-none bg-sky-500 text-white hover:bg-sky-700 font-semibold py-2 px-3 rounded-md flex items-center ml-1"
              aria-label="Translate"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4 mr-1 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              )}
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 翻訳結果の表示 */}
        {children}
      </div>
    </div>
  );
};

export default SpeechSection;
