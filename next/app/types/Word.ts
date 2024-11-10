export type Word = {
  ja: string;
  en: string;
  romaji: string;
};

export type WordWithCount = {
  word: Word;
  count: number;
};
