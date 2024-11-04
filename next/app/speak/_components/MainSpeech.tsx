'use client';

import { Mic, Pencil } from 'lucide-react';
import { useState } from 'react';

const MainSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState('I want to go to Ikebukuro');

  const handleMicClick = () => {
    setIsListening(!isListening);
  };

  const handlePencilClick = () => {
    setIsEditing(true); // 編集モードに切り替える
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false); // 編集を確定し、通常表示に戻す
  };

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
        <div className="flex flex-col items-center">
          {/* マイクボタン */}
          <button
            onClick={handleMicClick}
            className="w-40 h-40 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center
              justify-center mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Mic className="w-16 h-16 text-white" />
          </button>
          <p className="text-xl text-gray-600 mb-4">Tap to speak</p>

          {/* ワードの編集 */}
          {/* todo: 音声認識したワードを動的に表示、音声認識した言語を表示する */}
          <div className="flex justify-between border rounded-lg w-full p-5">
            {isEditing ? (
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="text-gray-800 w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                autoFocus
              />
            ) : (
              <p className="text-lg text-gray-800">{inputText}</p>
            )}
            <Pencil onClick={handlePencilClick} className="text-sky-500 hover:text-sky-700 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSpeech;
