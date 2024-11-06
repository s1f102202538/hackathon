import { NextRequest } from 'next/server';

import LocationService from 'app/libs/LocationService';

export type LocationParams = {
  clientId: string;
  lat: string;
  lon: string;
};

export async function POST(req: NextRequest): Promise<void> {
  const params: LocationParams = await req.json();

  LocationService.Create(params.clientId, params.lat, params.lon);
}
