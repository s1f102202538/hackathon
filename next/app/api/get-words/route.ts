import { NextRequest, NextResponse } from 'next/server';

import OpenAIService from 'app/libs/apiService/OpenAIService';
import DeepLService from 'app/libs/apiService/DeepLService';
import { Words } from 'app/types/Words';

export type GetWordsParams = {
  content: string;
};

export type GetWordsResponse = {
  wordsArray: Words[];
};

export async function POST(req: NextRequest): Promise<NextResponse<GetWordsResponse>> {
  const params: GetWordsParams = await req.json();

  const jp = await OpenAIService.Ask(params.content);
  const en = await DeepLService.TranslatorWordsArray(jp, 'EN');
  const wordsArray: Words[] = [];
  for (let i = 0; i < jp.length; i++) {
    const words: Words = {
      jp: jp[i],
      en: en[i],
    };
    wordsArray.push(words);
  }
  return NextResponse.json({
    wordsArray,
  });
}
