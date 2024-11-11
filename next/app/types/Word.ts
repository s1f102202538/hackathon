export type Word = {
  ja: string;
  userLang: string;
  romaji: string;
};

export type WordWithCount = {
  word: Word;
  count: number;
};
