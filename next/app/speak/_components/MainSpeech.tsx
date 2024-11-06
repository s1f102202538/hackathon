'use client';

import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { Mic, Square, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TranslationCard from './TranslationCard';

type Words = {
  jp: string;
  en: string;
};

const MainSpeech = () => {
  const { isRecording, setIsRecording, text, transcript } = useSpeechRecognition();
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState('I want to go to Ikebukuro');
  const [wordsArray, setWordsArray] = useState<Words[]>([]);

  // 音声認識が終了したときに `text` を `inputText` に反映する
  useEffect(() => {
    if (!isRecording && text) {
      setInputText(text);
    }
  }, [isRecording, text]);

  // APIを呼び出して翻訳結果を取得する関数
  const fetchWords = async () => {
    try {
      const response = await axios.post('/api/get-words', { content: inputText });
      const cleanedWordsArray = response.data.wordsArray.map((word: Words) => ({
        jp: word.jp.replace(/"/g, ''), // 日本語文字列から二重引用符を削除
        en: word.en.replace(/"/g, ''),
      }));
      setWordsArray(cleanedWordsArray);
      console.log(cleanedWordsArray);
    } catch (error) {
      console.error('Error fetching translation:', error);
    }
  };

  // マイクボタンのクリックハンドラー
  const handleMicClick = () => {
    setIsRecording((prev) => !prev);
  };

  // 鉛筆アイコンのクリックハンドラー
  const handlePencilClick = () => {
    setIsEditing(true); // 編集モードに切り替える
  };

  // テキスト入力の変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  // テキスト入力のフォーカスが外れたときのハンドラー
  const handleBlur = () => {
    setIsEditing(false); // 編集を確定し、通常表示に戻す
  };

  // Translateボタンのクリックハンドラー
  const handleTranslateClick = () => {
    fetchWords();
  };

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
        <div className="flex flex-col items-center">
          {/* マイクボタン */}
          <button
            onClick={handleMicClick}
            className={`w-40 h-40 rounded-full flex items-center justify-center mb-4 focus:outline-none
              ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-sky-400 to-blue-500'}
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transform active:scale-90 transition-transform duration-150`}
          >
            {isRecording ? (
              <Square className="w-16 h-16 text-white" /> // 録音中は停止アイコンを表示
            ) : (
              <Mic className="w-16 h-16 text-white" /> // 通常はマイクアイコンを表示
            )}
          </button>
          <p className="text-xl text-gray-600 mb-4">{isRecording ? 'Recording...' : 'Tap to speak'}</p>

          {/* 動的なテキスト表示とTranslateボタン */}
          <div className="flex items-center w-full">
            <div className="flex-grow">
              <div className="flex justify-between border rounded-lg p-4 mr-2">
                {isRecording ? (
                  <p className="text-lg text-gray-800">{transcript}</p>
                ) : isEditing ? (
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="text-gray-800 w-full p-2 border border-gray-300 rounded-md focus:outline-none overflow-x-auto text-overflow-ellipsis whitespace-nowrap"
                    autoFocus
                  />
                ) : (
                  <p className="text-lg text-gray-800">{inputText}</p>
                )}
                <Pencil onClick={handlePencilClick} className="text-sky-500 hover:text-sky-700 cursor-pointer" />
              </div>
            </div>
            <button
              onClick={handleTranslateClick}
              className="font-semibold border p-4 bg-sky-500 text-white rounded-md hover:bg-sky-700"
            >
              Translate
            </button>
          </div>
        </div>
      </div>

      {/* TranslationCardsの表示 */}
      <div className="grid grid-cols-3 gap-4">
        {wordsArray.map((word, index) => (
          <TranslationCard key={index} mean={word.en} ja={word.jp} />
        ))}
      </div>
    </div>
  );
};

export default MainSpeech;
