import { NextRequest, NextResponse } from 'next/server';
import UserService from 'app/libs/userService/UserService';
import { User } from '@prisma/client';

export type CreateUserParams = {
  clientId: string;
};

export type CreateUserResponse = {
  user: User;
};

export async function POST(req: NextRequest): Promise<NextResponse<CreateUserResponse>> {
  const params: CreateUserParams = await req.json();
  const user = await UserService.Create(params.clientId);
  return NextResponse.json({
    user,
  });
}
