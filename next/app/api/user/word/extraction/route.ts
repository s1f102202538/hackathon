import { NextRequest, NextResponse } from 'next/server';

import OpenAIService from 'app/libs/apiService/OpenAIService';
import DeepLService from 'app/libs/apiService/DeepLService';
import UserWordsService from 'app/libs/userService/UserWordsService';
import { Word } from 'app/types/Word';

export type ExtractionWordsParams = {
  clientId: string;
  content: string;
};

export type ExtractionWordsResponse = {
  wordsList: Word[];
};

export async function POST(req: NextRequest): Promise<NextResponse<ExtractionWordsResponse>> {
  const params: ExtractionWordsParams = await req.json();

  const jp = await OpenAIService.Ask(params.content);
  const en = await DeepLService.TranslatorWordsArray(jp, 'EN');
  const wordsList: Word[] = [];
  for (let i = 0; i < jp.length; i++) {
    const word: Word = {
      ja: jp[i],
      en: en[i],
    };
    UserWordsService.Create(params.clientId, word);
    wordsList.push(word);
  }
  return NextResponse.json({
    wordsList,
  });
}
