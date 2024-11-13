import { NextRequest, NextResponse } from 'next/server';

import DeepLService from 'app/libs/apiService/DeepLService';
import UserService from 'app/libs/userService/UserService';

export type TranslateParams = {
  text: string;
  clientId: string;
};

export type TranslateResponse = {
  text: string;
};

export async function POST(req: NextRequest): Promise<NextResponse<TranslateResponse>> {
  const params: TranslateParams = await req.json();
  const userUsedLang = await UserService.GetUserUsedLang(params.clientId);
  const translateLang = await DeepLService.UserUsedLangConvertTranslateLanguages(userUsedLang);

  const result = await DeepLService.TranslatorText(params.text, translateLang);
  return NextResponse.json({
    text: result,
  });
}
