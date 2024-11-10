import { NextRequest, NextResponse } from 'next/server';
import UserService from 'app/libs/userService/UserService';
import { User } from '@prisma/client';
import { ErrorWithtatusCode } from 'app/types/CustomExceptions';

export type CreateUserParams = {
  clientId: string;
};

export type CreateUserResponse = {
  user: User | null;
};

/**
 * ユーザーを作成するエンドポイント。
 * ユーザーが既に存在する場合はステータスコード400を返します。
 */
export async function POST(req: NextRequest): Promise<NextResponse<CreateUserResponse>> {
  try {
    const params: CreateUserParams = await req.json();
    const user = await UserService.Create(params.clientId);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof ErrorWithtatusCode) {
      console.error('Error in POST /api/user/create:', error.message);

      return NextResponse.json({ user: null }, { status: error.statusCode });
    }

    console.error('Unexpected Error in POST /api/user/create:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
