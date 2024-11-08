import { NextRequest, NextResponse } from 'next/server';

import UserLocationService from 'app/libs/userService/UserLocationService';
import { Location } from 'app/types/Location';

export type GetLocationListParams = {
  clientId: string;
};

export type GetLocationListResponse = {
  locationList: Location[] | null;
};

export async function POST(req: NextRequest): Promise<NextResponse<GetLocationListResponse>> {
  const params: GetLocationListParams = await req.json();

  const locationList = await UserLocationService.GetLocationList(params.clientId);

  return NextResponse.json({
    locationList,
  });
}
