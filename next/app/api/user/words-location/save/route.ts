import { NextRequest } from 'next/server';

import UserWordsLocationService from 'app/libs/userService/UserWordsLocationService';
import { Word } from 'app/types/Word';

export type LocationParams = {
  clientId: string;
  words: Word[];
  lat: string;
  lon: string;
};

export async function POST(req: NextRequest): Promise<void> {
  const params: LocationParams = await req.json();

  UserWordsLocationService.Create(params.clientId, params.words, params.lat, params.lon);
}
