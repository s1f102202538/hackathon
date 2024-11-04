import { NextRequest, NextResponse } from 'next/server';

import OpenAIService from '@/app/libs/openai/OpenAIService';

export type TranslateParams = {
  content: string;
};

export type TranslateResponse = {
  words: string[] | null;
};

export async function POST(req: NextRequest): Promise<NextResponse<TranslateResponse>> {
  const params: TranslateParams = await req.json();
  console.log(params);
  const result = await OpenAIService.Ask(params.content);
  return NextResponse.json({
    words: result,
  });
}
