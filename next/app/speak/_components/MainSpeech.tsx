'use client';

import { useJaSpeechRecognition } from '../../hooks/useJaSpeechRecognition';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TranslationCard from './TranslationCard';
import SpeechSection from './SpeechSection';
import { useAuth } from '@clerk/nextjs';
import { Word } from 'app/types/Word';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import { Volume2, Loader2 } from 'lucide-react';
import { Translations } from '../../libs/i18n/translations';

type MainSpeechProps = {
  usedLang: string;
  translations?: Translations[string];
};

const MainSpeech: React.FC<MainSpeechProps> = ({ usedLang, translations }) => {
  // 観光客用の音声認識フック
  const { isRecording, setIsRecording, text, transcript } = useSpeechRecognition(usedLang);

  // 日本人用の音声認識フック
  const { isRecordingJ, setIsRecordingJ, textJ, transcriptJ } = useJaSpeechRecognition();

  // 観光客用の状態
  const [inputText, setInputText] = useState<string>('');
  const [wordsArray, setWordsArray] = useState<Word[]>([]);

  // 日本人用の状態
  const [inputTextJ, setInputTextJ] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');

  const { isSignedIn, userId } = useAuth();

  // ローディング状態の追加
  const [isTranslateLoading, setIsTranslateLoading] = useState<boolean>(false);

  // 観光客の音声認識中に inputText をリアルタイム更新
  useEffect(() => {
    if (isRecording) {
      setInputText(transcript);
    } else if (text) {
      setInputText(text);
    }
  }, [isRecording, transcript, text]);

  // 日本人の音声認識中に inputTextJ をリアルタイム更新
  useEffect(() => {
    if (isRecordingJ) {
      setInputTextJ(transcriptJ);
    } else if (textJ) {
      setInputTextJ(textJ);
    }
  }, [isRecordingJ, transcriptJ, textJ]);

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
        content: inputText,
      });
      console.log(response);
      const cleanedWordsArray = response.data.wordsList.map((word: Word) => ({
        ja: word.ja.replace(/["']/g, ''),
        userLang: word.userLang.replace(/["']/g, ''),
        romaji: word.romaji.replace(/["']/g, ''),
      }));
      setWordsArray(cleanedWordsArray);
      console.log(cleanedWordsArray);
    } catch (error) {
      toast.error('Push translate button again');
      console.error(error);
    }
  }, [isSignedIn, userId, inputText]);

  // 日本人用の翻訳API呼び出し関数
  const translateJapanese = useCallback(
    async (jaText: string) => {
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
    },
    [userId]
  );

  // 観光客のTranslateボタンのクリックハンドラー
  const handleTranslateClick = useCallback(async () => {
    setIsTranslateLoading(true);
    await fetchWords();
    setIsTranslateLoading(false);
  }, [fetchWords]);

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
            await axios.post('/api/words-location/save/location', {
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

  // 日本人セクションの入力テキストが変更されたときに自動的に翻訳を実行
  const debouncedTranslateJapanese = useCallback(
    debounce((jaText: string) => {
      translateJapanese(jaText);
    }, 500),
    [translateJapanese]
  );

  useEffect(() => {
    if (inputTextJ.trim() !== '') {
      debouncedTranslateJapanese(inputTextJ);
    } else {
      setTranslatedText('');
    }

    return () => {
      debouncedTranslateJapanese.cancel();
    };
  }, [inputTextJ, debouncedTranslateJapanese]);

  // 日本語テキストを音声再生する関数
  const speakTranslatedText = useCallback(() => {
    if ('speechSynthesis' in window && translatedText) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = usedLang || 'ja-JP';
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('このブラウザはSpeechSynthesis APIに対応していないか、翻訳テキストがありません。');
    }
  }, [translatedText, usedLang]);

  return (
    <div className="flex flex-col space-y-4 py-4 px-2">
      {/* Tourist セクション */}
      <SpeechSection
        title="You"
        isRecording={isRecording}
        toggleRecording={() => setIsRecording((prev) => !prev)}
        transcript={transcript}
        inputText={inputText}
        setInputText={setInputText}
        handleTranslate={handleTranslateClick}
        translations={translations}
        isLoading={isTranslateLoading}
      >
        {/* TranslationCardsの表示またはローディングスピナー */}
        {isTranslateLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 grid-cols-2 gap-1 mt-2">
            {wordsArray.map((word, index) => (
              <TranslationCard key={index} word={word} />
            ))}
          </div>
        )}
      </SpeechSection>

      {/* Japanese セクション */}
      <SpeechSection
        title="Japanese"
        isRecording={isRecordingJ}
        toggleRecording={handleRecordingJClick}
        transcript={transcriptJ}
        inputText={inputTextJ}
        setInputText={setInputTextJ}
        translations={translations}
        isLoading={false}
      >
        {/* 翻訳結果の表示 */}
        <div className="mt-2 p-2 border rounded-md bg-gray-50 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-800">Translation:</p>
            <p className="text-base font-semibold text-blue-600">{translatedText}</p>
          </div>
          {/* 音声再生ボタン */}
          {translatedText && (
            <button
              onClick={speakTranslatedText}
              aria-label="Speak Translation"
              className="ml-4 text-sky-500 hover:text-sky-700 focus:outline-none"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          )}
        </div>
      </SpeechSection>
    </div>
  );
};

export default MainSpeech;
