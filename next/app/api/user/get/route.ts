import { NextRequest, NextResponse } from 'next/server';
import UserService from 'app/libs/userService/UserService';
import { User } from '@prisma/client';

export type GetUserParams = {
  clientId: string;
};

export type GetUserResponse = {
  user: User | null;
  speakLang: string | null;
};

export async function POST(req: NextRequest): Promise<NextResponse<GetUserResponse>> {
  try {
    const params: GetUserParams = await req.json();
    const user = await UserService.FindUserByClientId(params.clientId);

    const speakLang =
      user !== null && user.usedLang !== undefined ? UserService.ConvertSpeakLanguages(user.usedLang) : null;

    return NextResponse.json({ user, speakLang: speakLang }, { status: 200 });
  } catch (error) {
    console.error('Unexpected Error in POST /api/user/get:', error);
    return NextResponse.json({ user: null, speakLang: null }, { status: 500 });
  }
}
