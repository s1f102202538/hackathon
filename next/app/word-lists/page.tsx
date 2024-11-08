'use client';

import { useState } from 'react';
import Header from 'app/components/layout/header/page';
import Navbar from 'app/components/layout/navbar/page';
import SearchBar from './_components/SearchBar';
import WordCard from './_components/WordCard';
import WordDetail from './_components/WordDetail';

const words = [
  { japanese: 'おはよう', romaji: 'ohayou', english: 'Good morning', usageCount: 5 },
  { japanese: 'こんにちは', romaji: 'konnichiwa', english: 'Hello', usageCount: 8 },
  { japanese: 'さようなら', romaji: 'sayounara', english: 'Goodbye', usageCount: 3 },
  { japanese: 'ありがとう', romaji: 'arigatou', english: 'Thank you', usageCount: 10 },
];

const WordLists = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<(typeof words)[0] | null>(null);

  const filteredWords = words.filter(
    (word) =>
      word.japanese.includes(searchQuery) ||
      word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.romaji.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Header title="Word Lists" />
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex-1 overflow-auto px-4 pb-24">
        {filteredWords.map((word) => (
          <WordCard key={word.japanese} word={word} onSelect={() => setSelectedWord(word)} />
        ))}
      </div>
      <Navbar />
      {selectedWord && <WordDetail word={selectedWord} onClose={() => setSelectedWord(null)} />}
    </div>
  );
};

export default WordLists;
