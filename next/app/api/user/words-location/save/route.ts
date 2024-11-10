import { NextRequest, NextResponse } from 'next/server';

import UserWordsLocationService from 'app/libs/userService/UserWordsLocationService';
import { Word } from 'app/types/Word';

export type SaveWordsLocationParams = {
  clientId: string;
  words: Word[];
  lat: string;
  lon: string;
};

export async function POST(req: NextRequest): Promise<NextResponse<{ status: number }>> {
  try {
    const params: SaveWordsLocationParams = await req.json();

    UserWordsLocationService.Create(params.clientId, params.words, params.lat, params.lon);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Unexpected Error in POST /api/user/words-location/save:', error);
    return NextResponse.json({ status: 500 });
  }
}
