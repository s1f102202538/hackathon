import { NextRequest, NextResponse } from 'next/server';

import DeepLService from 'app/libs/apiService/DeepLService';

export type TranslateParams = {
  text: string;
};

export type TranslateResponse = {
  text: string;
};

export async function POST(req: NextRequest): Promise<NextResponse<TranslateResponse>> {
  const params: TranslateParams = await req.json();

  const result = await DeepLService.TranslatorText(params.text, 'EN');
  return NextResponse.json({
    text: result,
  });
}
