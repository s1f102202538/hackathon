import { NextRequest, NextResponse } from 'next/server';

import OpenAIService from 'app/libs/apiService/OpenAIService';
import DeepLService from 'app/libs/apiService/DeepLService';
import UserWordsService from 'app/libs/userService/UserWordsService';
import WanakanaService from 'app/libs/WanakanaService';
import UserService from 'app/libs/userService/UserService';
import { Word } from 'app/types/Word';

export type ExtractionWordsParams = {
  clientId: string;
  content: string;
};

export type ExtractionWordsResponse = {
  wordsList: Word[] | null;
};

export async function POST(req: NextRequest): Promise<NextResponse<ExtractionWordsResponse>> {
  try {
    const params: ExtractionWordsParams = await req.json();
    const userUsedLang = await UserService.GetUserUsedLang(params.clientId);

    // userUsedLang が null の場合、エラーレスポンスを返す
    if (!userUsedLang) {
      return NextResponse.json({ wordsList: null }, { status: 400, statusText: 'User language not set' });
    }

    const translateLang = await DeepLService.UserUsedLangConvertTranslateLanguages(userUsedLang);

    const translateContent = await DeepLService.TranslatorText(params.content, 'JA');
    const jp = await OpenAIService.Ask(translateContent);
    const userLang = await DeepLService.TranslatorTextArray(jp, translateLang);
    const romaji = await WanakanaService.TextArrayToRomaji(jp);
    const wordsList: Word[] = [];
    for (let i = 0; i < jp.length; i++) {
      const word: Word = {
        ja: jp[i],
        userLang: userLang[i],
        romaji: romaji[i],
      };
      UserWordsService.Create(params.clientId, word);
      wordsList.push(word);
    }
    return NextResponse.json({ wordsList }, { status: 200 });
  } catch (error) {
    console.error('Unexpected Error in POST /api/word/extraction:', error);
    return NextResponse.json({ wordsList: null }, { status: 500 });
  }
}
