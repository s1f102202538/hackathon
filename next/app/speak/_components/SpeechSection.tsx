'use client';

import { Mic, Languages, ArrowRightLeft } from 'lucide-react';
import React from 'react';
import { Translations } from '../../libs/i18n/translations';

type SpeechSectionProps = {
  title: string;
  isRecording: boolean;
  toggleRecording: () => void;
  transcript: string;
  inputText: string;
  setInputText: (text: string) => void;
  handleTranslate?: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
  translations?: Translations[string];
};

const SpeechSection: React.FC<SpeechSectionProps> = ({
  title,
  isRecording,
  toggleRecording,
  inputText,
  setInputText,
  handleTranslate,
  children,
  translations,
}) => {
  // テキスト入力の変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        {/* マイクボタン、Textarea、Translateボタンを横並びに */}
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
            <Mic className="w-5 h-5 text-white" />
          </button>

          {/* Textarea フィールド */}
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder={translations?.inputPlaceholder || 'Enter text here...'}
            className="flex-grow bg-white border border-gray-200 focus:border-blue-500 focus:ring-blue-500 ml-4 p-2 rounded-md resize-none"
            rows={1}
          />

          {/* Translateボタン */}
          {handleTranslate && (
            <button
              onClick={handleTranslate}
              className="flex-shrink-0 bg-sky-500 text-white hover:bg-sky-700 font-semibold py-2 px-3 rounded-md flex items-center ml-1"
              aria-label="Translate"
            >
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
