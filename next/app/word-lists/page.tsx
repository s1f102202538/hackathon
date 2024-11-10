'use client';

import { useState, useEffect } from 'react';
import Header from 'app/components/layout/header/page';
import Navbar from 'app/components/layout/navbar/page';
import SearchBar from './_components/SearchBar';
import WordCard from './_components/WordCard';
import WordDetail from './_components/WordDetail';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { WordWithCount } from 'app/types/Word';

const WordLists = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<WordWithCount | null>(null);
  const [words, setWords] = useState<WordWithCount[]>([]);
  const { userId, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn && userId) {
      const fetchWords = async () => {
        try {
          const response = await axios.post('/api/user/word/get-list', {
            clientId: userId,
          });
          setWords(response.data.wordsList || []);
        } catch (error) {
          console.error('Error fetching words:', error);
        }
      };

      fetchWords();
    }
  }, [isSignedIn, userId]);

  const filteredWords = words.filter(
    (WordWithCount) =>
      WordWithCount.word.ja.includes(searchQuery) ||
      WordWithCount.word.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      WordWithCount.word.romaji.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Header title="Word Lists" />
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex-1 overflow-auto px-4 pb-24">
        {filteredWords.map((WordWithCount) => (
          <WordCard
            key={WordWithCount.word.ja}
            wordWithCount={WordWithCount}
            onSelect={() => setSelectedWord(WordWithCount)}
          />
        ))}
      </div>
      <Navbar />
      {selectedWord && <WordDetail wordWithCount={selectedWord} onClose={() => setSelectedWord(null)} />}
    </div>
  );
};

export default WordLists;
