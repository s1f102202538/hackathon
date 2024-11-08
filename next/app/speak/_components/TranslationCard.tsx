import { Volume2 } from 'lucide-react';
import { toRomaji } from 'wanakana';

type TranslationCardProps = {
  mean: string;
  ja: string;
};

const TranslationCard = ({ mean, ja }: TranslationCardProps) => {
  const roman = toRomaji(ja);

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
    <div className="bg-white rounded-xl shadow p-4 hover:bg-sky-400" onClick={() => speakText(ja)}>
      <div className="text-b">
        <p className="text-grey-700">{mean}</p>
        <div className="flex justify-between">
          <p className="text-lg text-gray-800">{roman}</p>
          <Volume2 className="text-sky-500 hover:text-sky-700" />
        </div>
        <p className="text-sky-500">{ja}</p>
      </div>
    </div>
  );
};

export default TranslationCard;
