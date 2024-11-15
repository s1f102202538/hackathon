'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Button } from '../components/ui/button';
import Header from 'app/components/layout/header/Header';
import Navbar from 'app/components/layout/navbar/Navbar';
import type { WordWithCount } from 'app/types/Word';
import WordDetail from './_components/WordDetail';
import WordCard from './_components/WordCard';
import SearchBar from './_components/SearchBar';
import { ScrollArea } from 'app/components/ui/scroll-area';

const categories = ['All', 'あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ', 'Others'];

const getCategoryForWord = (word: string): string => {
  const firstChar = word.charAt(0);
  if ('あいうえお'.includes(firstChar)) return 'あ';
  if ('かきくけこがぎぐげご'.includes(firstChar)) return 'か';
  if ('さしすせそざじずぜぞ'.includes(firstChar)) return 'さ';
  if ('たちつてとだぢづでど'.includes(firstChar)) return 'た';
  if ('なにぬねの'.includes(firstChar)) return 'な';
  if ('はひふへほばびぶべぼぱぴぷぺぽ'.includes(firstChar)) return 'は';
  if ('まみむめも'.includes(firstChar)) return 'ま';
  if ('やゆよ'.includes(firstChar)) return 'や';
  if ('らりるれろ'.includes(firstChar)) return 'ら';
  if ('わをん'.includes(firstChar)) return 'わ';
  return 'Others';
};

const groupWordsByCategory = (words: WordWithCount[]) => {
  return words.reduce(
    (acc, wordWithCount) => {
      const category = getCategoryForWord(wordWithCount.word.ja);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(wordWithCount);
      return acc;
    },
    {} as Record<string, WordWithCount[]>
  );
};

const WordLists = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [words, setWords] = useState<WordWithCount[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWord, setSelectedWord] = useState<WordWithCount | null>(null);
  const { userId, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn && userId) {
      const fetchWords = async () => {
        try {
          const response = await axios.post('/api/word/get-list', {
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

  const groupedWords = groupWordsByCategory(words);

  // 検索クエリがある場合はフィルタリング、ない場合は選択されたカテゴリの単語を表示
  const filteredWords =
    searchQuery.trim() !== ''
      ? words.filter(
          (wordWithCount) =>
            wordWithCount.word.ja.includes(searchQuery) ||
            wordWithCount.word.userLang.toLowerCase().includes(searchQuery.toLowerCase()) ||
            wordWithCount.word.romaji.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : selectedCategory === 'All'
        ? words
        : groupedWords[selectedCategory] || [];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Header title="Word Lists" />
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* カテゴリーボタンと単語数のコンテナ */}
        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`h-10 min-w-[2.5rem] text-sm font-bold
                    ${
                      selectedCategory === category
                        ? 'bg-sky-500 text-white'
                        : 'bg-white text-sky-500 border border-sky-500'
                    }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* 単語数の表示 */}
          {selectedCategory === 'All' && <div className="mt-2 text-sm text-gray-700">Word counts: {words.length}</div>}
        </div>

        {/* スクロールエリア */}
        <ScrollArea className="flex-1 overflow-y-auto px-4">
          <div className="space-y-4 pb-20">
            {filteredWords.map((wordWithCount) => (
              <WordCard
                key={wordWithCount.word.ja}
                wordWithCount={wordWithCount}
                onSelect={() => setSelectedWord(wordWithCount)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <Navbar />
      {selectedWord && <WordDetail wordWithCount={selectedWord} onClose={() => setSelectedWord(null)} />}
    </div>
  );
};

export default WordLists;
