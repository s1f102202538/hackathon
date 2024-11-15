import { NextRequest, NextResponse } from 'next/server';

import UserWordsLocationService from 'app/libs/userService/UserWordsLocationService';

export type SaveCommentParams = {
  clientId: string;
  id: number;
  comment: string;
};

export async function POST(req: NextRequest): Promise<NextResponse<{ status: number }>> {
  try {
    const params: SaveCommentParams = await req.json();

    await UserWordsLocationService.SaveComment(params.clientId, params.id, params.comment);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Unexpected Error in POST /api/words-location/save/comment:', error);
    return NextResponse.json({ status: 500 });
  }
}
