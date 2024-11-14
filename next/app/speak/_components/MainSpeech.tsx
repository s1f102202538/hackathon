'use client';

import { useJaSpeechRecognition } from '../../hooks/useJaSpeechRecognition';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';
import TranslationCard from './TranslationCard';
import SpeechSection from './SpeechSection';
import { useAuth } from '@clerk/nextjs';
import { Word } from 'app/types/Word';
import { GetUserResponse } from 'app/api/user/get/route';

const MainSpeech = () => {
  const [selectedLang, setSelectedLang] = useState<string>('');
  // 観光客用の音声認識フック
  const { isRecording, setIsRecording, text, transcript } = useSpeechRecognition(selectedLang);
  // 日本人用の音声認識フック
  const { isRecordingJ, setIsRecordingJ, textJ, transcriptJ } = useJaSpeechRecognition();

  // 観光客用の状態
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState('Where is the Hachikoumae');
  const [wordsArray, setWordsArray] = useState<Word[]>([]);

  // 日本人用の状態
  const [isEditingJ, setIsEditingJ] = useState(false);
  const [inputTextJ, setInputTextJ] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const { isSignedIn, userId } = useAuth(); // useAuth から userId を取得

  // 観光客の音声認識が終了したときに `text` を `inputText` に反映する
  useEffect(() => {
    if (!isRecording && text) {
      setInputText(text);
    }
  }, [isRecording, text]);

  // 日本人の音声認識が終了したときに `textJ` を `inputTextJ` に反映する
  useEffect(() => {
    if (!isRecordingJ && textJ) {
      setInputTextJ(textJ);
    }
  }, [isRecordingJ, textJ]);

  // 観光客用のAPI呼び出し関数
  const fetchWords = useCallback(async () => {
    if (!isSignedIn || !userId) {
      console.error('User is not signed in or userId is missing');
      return;
    }

    if (!inputText) {
      console.error('No input text to translate');
      return;
    }

    try {
      const response = await axios.post('/api/word/extraction', {
        clientId: userId,
        content: inputText, // 録音したテキストを送信
      });
      console.log(response);
      const cleanedWordsArray = response.data.wordsList.map((word: Word) => ({
        // ja: word.ja.replace(/"/g, ''), // 日本語文字列から二重引用符を削除
        // userLang: word.userLang.replace(/"/g, ''),
        // romaji: word.romaji.replace(/"/g, ''),
        ja: word.ja, // 日本語文字列から二重引用符を削除
        userLang: word.userLang,
        romaji: word.romaji,
      }));
      setWordsArray(cleanedWordsArray);
      console.log(cleanedWordsArray);
    } catch (error) {
      console.error('Error fetching translation:', error);
    }
  }, [isSignedIn, userId, inputText]);

  // 日本人用の翻訳API呼び出し関数
  const translateJapanese = useCallback(async (jaText: string) => {
    if (!jaText) {
      console.error('No Japanese text to translate');
      return;
    }

    try {
      const response = await axios.post('/api/translation', {
        text: jaText,
        clientId: userId,
      });

      setTranslatedText(response.data.text);
      console.log('Translated Text:', response.data.text);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  }, []);

  // 観光客のTranslateボタンのクリックハンドラー
  const handleTranslateClick = useCallback(() => {
    fetchWords();
  }, [fetchWords]);

  // 日本人のTranslateボタンのクリックハンドラー
  const handleTranslateClickJ = useCallback(() => {
    translateJapanese(inputTextJ);
  }, [translateJapanese, inputTextJ]);

  // 日本人側の録音ボタンのクリックハンドラー
  const handleRecordingJClick = useCallback(() => {
    setIsRecordingJ((prev) => !prev);

    if (!isRecordingJ) {
      // 録音開始時の処理
    } else {
      // 録音停止時の処理
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            await axios.post('/api/words-location/save', {
              clientId: userId,
              words: wordsArray,
              lat: latitude.toString(),
              lon: longitude.toString(),
            });
            console.log('データの保存に成功しました');
          } catch (error) {
            console.error('データの保存中にエラーが発生しました:', error);
          }
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error);
        }
      );
    }
  }, [isRecordingJ, userId, wordsArray, setIsRecordingJ]);

  useEffect(() => {
    const fetchUserLanguage = async () => {
      try {
        const response: AxiosResponse<GetUserResponse> = await axios.post('/api/user/get', {
          clientId: userId,
        });
        const user = response.data.user;

        if (user && user.usedLang) {
          // DeepLService の convertTranslateLanguages を使用して言語コードを取得
          const langCode = response.data.speakLang;
          if (langCode !== null) {
            console.log('langCode:', langCode);
            setSelectedLang(langCode);
          } else {
            setSelectedLang('en-US');
          }
        } else {
          console.log('User or user language not found');
        }
      } catch (error) {
        console.error('Error fetching user language:', error);
      }
    };

    if (isSignedIn) {
      fetchUserLanguage();
    }
  }, [isSignedIn, userId]);

  // selectedLang が取得されるまで待つ
  // if (!selectedLang) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Tourist セクション */}
      <SpeechSection
        title="You"
        isRecording={isRecording}
        toggleRecording={() => setIsRecording((prev) => !prev)}
        transcript={transcript}
        isEditing={isEditing}
        toggleEditing={() => setIsEditing((prev) => !prev)}
        inputText={inputText}
        setInputText={setInputText}
        handleTranslate={handleTranslateClick}
      >
        {/* TranslationCardsの表示 */}
        <div className="grid grid-cols-2 gap-2">
          {wordsArray.map((word, index) => (
            <TranslationCard key={index} word={word} />
          ))}
        </div>
      </SpeechSection>

      {/* Japanese セクション */}
      <SpeechSection
        title="Japanese"
        isRecording={isRecordingJ}
        toggleRecording={handleRecordingJClick}
        transcript={transcriptJ}
        isEditing={isEditingJ}
        toggleEditing={() => setIsEditingJ((prev) => !prev)}
        inputText={inputTextJ}
        setInputText={setInputTextJ}
        handleTranslate={handleTranslateClickJ}
      >
        {/* 翻訳結果の表示 */}
        <div className="mt-2 p-2 border rounded-md bg-gray-50">
          <p className="text-sm text-gray-800">Translation:</p>
          <p className="text-base font-semibold text-blue-600">{translatedText}</p>
        </div>
      </SpeechSection>
    </div>
  );
};

export default MainSpeech;
