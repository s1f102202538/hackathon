import { NextRequest, NextResponse } from 'next/server';

import OpenAIService from 'app/libs/apiService/OpenAIService';

export type GetWordsParams = {
  content: string;
};

export type GetWordsResponse = {
  words: string[] | null;
};

export async function POST(req: NextRequest): Promise<NextResponse<GetWordsResponse>> {
  const params: GetWordsParams = await req.json();

  const result = await OpenAIService.Ask(params.content);
  return NextResponse.json({
    words: result,
  });
}
