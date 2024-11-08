import { NextRequest, NextResponse } from 'next/server';

import UserWordsLocationService from 'app/libs/userService/UserWordsLocationService';
import { WordsLocation } from 'app/types/WordsLocation';

export type GetWordsLocationListParams = {
  clientId: string;
};

export type GetWordsLocationListResponse = {
  wordsLocationList: WordsLocation[] | null;
};

export async function POST(req: NextRequest): Promise<NextResponse<GetWordsLocationListResponse>> {
  try {
    const params: GetWordsLocationListParams = await req.json();

    const wordsLocationList = await UserWordsLocationService.GetLocationList(params.clientId);

    return NextResponse.json({ wordsLocationList });
  } catch (error) {
    console.error('Unexpected Error in POST /api/user/words-location:', error);
    return NextResponse.json({ wordsLocationList: null }, { status: 500 });
  }
}
