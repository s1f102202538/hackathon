import { NextRequest, NextResponse } from 'next/server';

import OpenAIService from 'app/libs/apiService/OpenAIService';
import DeepLService from 'app/libs/apiService/DeepLService';
import UserWordsService from 'app/libs/userService/UserWordsService';
import { Word } from 'app/types/Word';

export type GetWordsParams = {
  clientId: string;
  content: string;
};

export type GetWordsResponse = {
  wordsArray: Word[];
};

export async function POST(req: NextRequest): Promise<NextResponse<GetWordsResponse>> {
  const params: GetWordsParams = await req.json();

  const jp = await OpenAIService.Ask(params.content);
  const en = await DeepLService.TranslatorWordsArray(jp, 'EN');
  const wordsArray: Word[] = [];
  for (let i = 0; i < jp.length; i++) {
    const word: Word = {
      ja: jp[i],
      en: en[i],
    };
    UserWordsService.Create(params.clientId, word);
    wordsArray.push(word);
  }
  return NextResponse.json({
    wordsArray,
  });
}
