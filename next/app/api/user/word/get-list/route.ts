import { NextRequest, NextResponse } from 'next/server';

import UserWordsService from 'app/libs/userService/UserWordsService';
import { Word } from 'app/types/Word';

export type GetWordsListParams = {
  clientId: string;
};

export type GetWordsListResponse = {
  wordsList: Word[];
};

export async function POST(req: NextRequest): Promise<NextResponse<GetWordsListResponse>> {
  const params: GetWordsListParams = await req.json();
  const wordsList = await UserWordsService.GetWordsList(params.clientId);

  return NextResponse.json({
    wordsList,
  });
}
