import { NextRequest } from 'next/server';

import UserLocationService from 'app/libs/userService/UserLocationService';

export type LocationParams = {
  clientId: string;
  lat: string;
  lon: string;
};

export async function POST(req: NextRequest): Promise<void> {
  const params: LocationParams = await req.json();

  UserLocationService.Create(params.clientId, params.lat, params.lon);
}
