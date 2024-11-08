import { NextRequest, NextResponse } from 'next/server';
import UserService from 'app/libs/userService/UserService';
import { User } from '@prisma/client';

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
    console.log('Creating user with clientId:', params.clientId);
    const user = await UserService.Create(params.clientId);
    console.log('User created:', user);
    return NextResponse.json({
      user,
    });
  } catch (error: unknown) {
    // 型を 'unknown' に変更
    if (error instanceof Error) {
      // 型チェックを実施
      console.error('Error in POST /api/user/create:', error.message);

      if (error.message === 'User has already been created') {
        return NextResponse.json({ user: null }, { status: 400 });
      }
    } else {
      console.error('Unexpected Error in POST /api/user/create:', error);
    }

    return NextResponse.json({ user: null }, { status: 500 });
  }
}
