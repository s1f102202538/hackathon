import { NextRequest, NextResponse } from 'next/server';
import UserService from 'app/libs/userService/UserService';
import { User } from '@prisma/client';

export type GetUserParams = {
  clientId: string;
};

export type GetUserResponse = {
  user: User | null;
};

export async function POST(req: NextRequest): Promise<NextResponse<GetUserResponse>> {
  try {
    const params: GetUserParams = await req.json();
    const user = await UserService.FindUserByClientId(params.clientId);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Unexpected Error in POST /api/user/get:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
