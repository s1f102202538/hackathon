// /next/app/speak/_components/TranslationCard.tsx

import { Volume2 } from 'lucide-react';
import { Word } from 'app/types/Word';

type TranslationCardProps = {
  word: Word;
};

const TranslationCard = ({ word }: TranslationCardProps) => {
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('このブラウザはSpeechSynthesis APIに対応していません。');
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow pl-2 pt-2 hover:bg-sky-400 cursor-pointer"
      onClick={() => speakText(word.ja)}
    >
      <div className="text-b">
        <p className="text-black/50 text-xs">{word.userLang}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg text-gray-800">{word.romaji}</p>
          <Volume2 className="text-sky-500 hover:text-sky-700 mr-2" />
        </div>
        <p className="text-sky-500 text-xs">{word.ja}</p>
      </div>
    </div>
  );
};

export default TranslationCard;
