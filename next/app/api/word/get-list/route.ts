import { NextRequest, NextResponse } from 'next/server';

import UserWordsService from 'app/libs/userService/UserWordsService';
import { WordWithCount } from 'app/types/Word';

export type GetWordsListParams = {
  clientId: string;
};

export type GetWordsListResponse = {
  wordsList: WordWithCount[] | null;
};

export async function POST(req: NextRequest): Promise<NextResponse<GetWordsListResponse>> {
  try {
    const params: GetWordsListParams = await req.json();
    const wordsList = await UserWordsService.GetWordsList(params.clientId);

    return NextResponse.json({ wordsList }, { status: 200 });
  } catch (error) {
    console.error('Unexpected Error in POST /api/word/get-list:', error);
    return NextResponse.json({ wordsList: null }, { status: 500 });
  }
}
