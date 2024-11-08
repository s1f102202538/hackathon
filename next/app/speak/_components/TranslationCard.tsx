import { Volume2 } from 'lucide-react';

type TranslationCardProps = {
  mean: string;
  ja: string;
  romaji: string;
};

const TranslationCard = ({ mean, ja, romaji }: TranslationCardProps) => {
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
    <div className="bg-white rounded-xl shadow p-4 mt-2 hover:bg-sky-400" onClick={() => speakText(ja)}>
      <div className="text-b">
        <p className="text-black/50">{mean}</p>
        <div className="flex justify-between">
          <p className="text-lg text-gray-800">{romaji}</p>
          <Volume2 className="text-sky-500 hover:text-sky-700" />
        </div>
        <p className="text-sky-500">{ja}</p>
      </div>
    </div>
  );
};

export default TranslationCard;
