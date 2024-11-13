import { X, MapPin } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { WordWithCount } from 'app/types/Word';
// import { useRouter } from 'next/router';
import Link from 'next/link';

interface WordDetailProps {
  wordWithCount: WordWithCount;
  onClose: () => void;
}

const WordDetail = ({ wordWithCount, onClose }: WordDetailProps) => {
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailRef.current && !detailRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={detailRef}
        className="bg-white rounded-2xl p-8 w-11/12 max-w-md transform transition-all duration-300 shadow-2xl"
      >
        <button
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={onClose}
          aria-label="Close detail view"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-2">{wordWithCount.word.romaji}</p>
          <h2 className="text-4xl mb-3 font-bold text-gray-800">{wordWithCount.word.ja}</h2>
          <p className="text-2xl text-cyan-600 mb-6">{wordWithCount.word.userLang}</p>
          <Link href="/map">
            <button className="w-full mb-4 py-3 px-4 text-lg rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-white font-medium shadow-md">
              <MapPin className="inline-block mr-2 h-5 w-5" />
              Check map
            </button>
          </Link>
          <span className="inline-block text-lg px-4 py-2 rounded-full bg-cyan-100 text-cyan-800 font-medium">
            Used: {wordWithCount.count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WordDetail;
