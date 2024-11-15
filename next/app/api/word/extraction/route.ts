import { NextRequest, NextResponse } from 'next/server';

import OpenAIService from 'app/libs/apiService/OpenAIService';
import DeepLService from 'app/libs/apiService/DeepLService';
import UserWordsService from 'app/libs/userService/UserWordsService';
import WanakanaService from 'app/libs/WanakanaService';
import UserService from 'app/libs/userService/UserService';
import { Word } from 'app/types/Word';
import GooService from 'app/libs/apiService/GooService';

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
    // Userの言語設定を取得
    const userUsedLang = await UserService.GetUserUsedLang(params.clientId);
    const translateLang = await DeepLService.UserUsedLangConvertTranslateLanguages(userUsedLang);

    // ユーザーの入力を一度日本語に翻訳
    const translateContent = await DeepLService.TranslatorText(params.content, 'JA');
    // 単語抽出
    const kanji = await OpenAIService.Ask(translateContent);
    // 抽出した単語をユーザーの言語に翻訳
    const userLang = await DeepLService.TranslatorTextArray(kanji, translateLang);
    // 抽出した単語をひらがなにする
    const hiragana = await GooService.getHiraganaTextArray(kanji);
    // ひらがなをローマ字に変換
    const romaji = await WanakanaService.TextArrayToRomaji(hiragana);

    const wordsList: Word[] = [];
    for (let i = 0; i < kanji.length; i++) {
      const word: Word = {
        ja: hiragana[i],
        userLang: userLang[i],
        romaji: romaji[i],
      };

      // 抽出した単語をDBに保存
      UserWordsService.Create(params.clientId, word);
      wordsList.push(word);
    }
    return NextResponse.json({ wordsList }, { status: 200 });
  } catch (error) {
    console.error('Unexpected Error in POST /api/word/extraction:', error);
    return NextResponse.json({ wordsList: null }, { status: 500 });
  }
}
