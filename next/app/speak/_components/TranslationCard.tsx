import { Volume2 } from 'lucide-react';
import { toRomaji } from 'wanakana';

type TranslationCardProps = {
  mean: string;
  ja: string;
  roman: string;
};

const TranslationCard = ({ mean, ja }: TranslationCardProps) => {
  const roman = toRomaji(ja);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="text-b">
        <p>{mean}</p>
        <div className="flex justify-between">
          <p className="text-lg text-gray-800">{ja}</p>
          <Volume2 className="text-sky-500 hover:text-sky-700" />
        </div>
        <p className="text-sky-500">{roman}</p>
      </div>
    </div>
  );
};

export default TranslationCard;
