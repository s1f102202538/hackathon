import { NextRequest, NextResponse } from 'next/server';

import OpenAIService from 'app/libs/apiService/OpenAIService';
import DeepLService from 'app/libs/apiService/DeepLService';
import UserWordsService from 'app/libs/userService/UserWordsService';
import WanakanaService from 'app/libs/WanakanaService';
import { Word } from 'app/types/Word';

export type ExtractionWordsParams = {
  clientId: string;
  content: string;
};

export type ExtractionWordsResponse = {
  wordsList: Word[] | null;
};

export async function POST(req: NextRequest): Promise<NextResponse<ExtractionWordsResponse>> {
  try {
    const params: ExtractionWordsParams = await req.json();

    const jp = await OpenAIService.Ask(params.content);
    const en = await DeepLService.TranslatorTextArray(jp, 'EN');
    const romaji = await WanakanaService.TextArrayToRomaji(jp);
    const wordsList: Word[] = [];
    for (let i = 0; i < jp.length; i++) {
      const word: Word = {
        ja: jp[i],
        en: en[i],
        romaji: romaji[i],
      };
      UserWordsService.Create(params.clientId, word);
      wordsList.push(word);
    }
    return NextResponse.json({ wordsList }, { status: 200 });
  } catch (error) {
    console.error('Unexpected Error in POST /api/user/word/extraction:', error);
    return NextResponse.json({ wordsList: null }, { status: 500 });
  }
}
