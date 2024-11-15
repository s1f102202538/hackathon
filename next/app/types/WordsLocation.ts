import { Word } from './Word';

export type WordsLocation = {
  id: number;
  words: Word[];
  lat: string;
  lon: string;
  comment: string;
};
