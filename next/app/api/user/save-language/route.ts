import { NextRequest, NextResponse } from 'next/server';
import UserService from 'app/libs/userService/UserService';

export type SetUserUsedLangParams = {
  clientId: string;
  usedLang: string;
};

export async function POST(req: NextRequest): Promise<NextResponse<{ status: number }>> {
  try {
    const param: SetUserUsedLangParams = await req.json();
    const lang = UserService.ConvertLanguagesEnum(param.usedLang);

    await UserService.SetUserUsedLang(param.clientId, lang);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Unexpected Error in POST /api/user/save-language:', error);
    return NextResponse.json({ status: 500 });
  }
}
