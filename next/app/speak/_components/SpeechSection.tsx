'use client';

import { Mic, Square, Pencil } from 'lucide-react';
import React from 'react';

type SpeechSectionProps = {
  title: string;
  isRecording: boolean;
  toggleRecording: () => void;
  transcript: string;
  isEditing: boolean;
  toggleEditing: () => void;
  inputText: string;
  setInputText: (text: string) => void;
  handleTranslate: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
};

const SpeechSection: React.FC<SpeechSectionProps> = ({
  title,
  isRecording,
  toggleRecording,
  transcript,
  isEditing,
  toggleEditing,
  inputText,
  setInputText,
  handleTranslate,
  children,
  isLoading = false,
}) => {
  // テキスト入力の変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  // テキスト入力のフォーカスが外れたときのハンドラー
  const handleBlur = () => {
    toggleEditing(); // 編集を確定し、通常表示に戻す
  };

  return (
    <div>
      {/* セクションヘッダー */}
      <div className="bg-gradient-to-r from-sky-100 to-blue-100 p-2 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-semibold text-gray-800">{title}</h2>
        </div>
      </div>

      {/* セクションコンテンツ */}
      <div className="bg-white shadow-md p-4 mb-4 rounded-xl">
        <div className="flex justify-between items-start">
          {/* マイクボタン */}
          <button
            onClick={toggleRecording}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full focus:outline-none
              ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-sky-400 to-blue-500'}
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transform active:scale-95 transition-transform duration-150`}
          >
            {isRecording ? (
              <Square className="w-5 h-5 text-white" /> // 録音中は停止アイコンを表示
            ) : (
              <Mic className="w-5 h-5 text-white" /> // 通常はマイクアイコンを表示
            )}
          </button>

          {/* 動的なテキスト表示とTranslateボタン */}
          <div className="flex items-center w-full ml-2">
            <div className="flex-grow">
              <div className="flex justify-between border rounded-md p-2">
                {isRecording ? (
                  <p className="text-sm text-gray-800">{transcript}</p>
                ) : isEditing ? (
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="text-gray-800 w-full p-1 border border-gray-300 rounded-md focus:outline-none overflow-x-auto text-overflow-ellipsis whitespace-nowrap text-sm"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm text-gray-800">{inputText}</p>
                )}
                <Pencil
                  onClick={toggleEditing}
                  className="text-sky-500 hover:text-sky-700 cursor-pointer ml-2 w-4 h-4"
                />
              </div>
            </div>
            <button
              onClick={handleTranslate}
              className="font-semibold border p-2 bg-sky-500 text-white rounded-md hover:bg-sky-700 text-sm ml-2 flex items-center justify-center"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : null}
              Translate
            </button>
          </div>
        </div>
        {/* 翻訳結果の表示 */}
        {children}
      </div>
    </div>
  );
};

export default SpeechSection;
