import OpenAI from 'openai';
export default class OpenAIService {
  private static readonly openai = new OpenAI({
    baseURL: `${process.env.OPENAI_BASE_URL}`,
    apiKey: `${process.env.OPENAI_API_KEY}`,
  });

  public static async Ask(content: string): Promise<string[][]> {
    let wordsArray: string[][] = [];
    let attempts = 0;
    const maxAttempts = 3; // 最大試行回数を設定

    while (attempts < maxAttempts) {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: this.formatTranslateContentPrompt(content) }],
        model: 'gpt-4o-mini',
      });

      const answer = completion.choices[0].message?.content;
      if (!answer) {
        throw new Error('ChatGPTの応答に回答が含まれていません');
      }

      wordsArray = this.createWordsArray(answer);
      if (wordsArray.length > 0) {
        // 偶数のリストが取得できた場合、ループを抜ける
        break;
      }

      attempts++;
      console.warn(`試行 ${attempts} 回目: リストの要素数が奇数でした。再試行します。`);
    }

    if (wordsArray.length === 0) {
      throw new Error('リストの要素数が偶数になりませんでした。');
    }

    return wordsArray;
  }

  // TODO プロンプトの改良
  private static formatTranslateContentPrompt(content: string) {
    const prompt = `
以下に回答例を提示します
・例文1
英文 「池袋に行きたい」 を '池袋','行きたい' と助詞を除いても日本語の文として自然になるように単語抽出し
回答: '池袋', '行きたい', 'いけぶくろ', 'いきたい'
・例文2
英文 「明後日、日本に友達が来るので空港で待ち合わせに最適な場所を教えてください」 を '明後日','友達','日本','来る','会う','場所','教えて' と助詞を除いても日本語の文として自然になるように単語抽出し
回答: '明後日','友達','日本','来る','会う','場所','教えて','あさって','ともだち','にほん','くる','あう','ばしょ','おしえて'

・例文3
英文 「ピラティスやりたいから場所を教えて」を 'ピラティス', 'やりたい', '場所', '教えて' と助詞を除いても日本語の文として自然になるように単語抽出し
回答: 'ピラティス', 'やりたい', '場所', '教えて', 'ぴらてぃす', 'やりたい', 'ばしょ', 'おしえて'

・条件
  1. 文章から単語を文意が通じる文法で抽出(いつもありがとう、例文はよく見てね)
                      ↓
  2. 回答は以下のフォーマットに従う、
     ただし前半は抽出したもの漢字/ひらがな/カタカナをそのまま表示し、後半はそれらのひらがなのみを出力してください。
                      ↓
  3. 'OO', 'OO', 'oo', 'oo'
     このように必ず一つの意味区切りでカンマをつけること。一つの単語ごとにクォーテーションをつけること
                      ↓
  4.絶対にリストの数は必ず偶数にすること。つまり、前半と後半が同じ数だけあること。
                      ↓
  5.例文回答を絶対に表示しないこと(回答:を含めないこと)
・文章
${content}
    `;
    return prompt;
  }

  private static createWordsArray(answer: string): string[][] {
    const wordsArray = answer.replace(/\s+/g, '').split(/,|、/);
    console.log(wordsArray);
    // 要素数が偶数か確認
    if (wordsArray.length % 2 !== 0) {
      console.error('要素数が奇数です。もう一度試してください。');
      return [];
    }

    // 配列を半分に分割
    const halfIndex = wordsArray.length / 2;
    const firstHalf = wordsArray.slice(0, halfIndex);
    const secondHalf = wordsArray.slice(halfIndex);

    console.log('前半:', firstHalf);
    console.log('後半:', secondHalf);

    return [firstHalf, secondHalf];
  }
}
