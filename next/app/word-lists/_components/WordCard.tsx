import { PlayCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Word } from 'app/types/Word';
interface WordCardProps {
  word: Word;
  onSelect: () => void;
}

const WordCard = ({ word, onSelect }: WordCardProps) => (
  <Card
    className="mb-4 p-5 cursor-pointer hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white bg-opacity-70 backdrop-blur-md rounded-xl"
    onClick={onSelect}
  >
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl mb-1 font-bold text-gray-800">{word.ja.replace(/"/g, '')}</h2>
        <p className="text-gray-600">{word.en.replace(/"/g, '')}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">Used: 10</span>
        <button
          className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-100 transition-colors rounded-full p-2"
          aria-label={`Play pronunciation of ${word.ja.replace(/"/g, '')}`}
        >
          <PlayCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
  </Card>
);

export default WordCard;
