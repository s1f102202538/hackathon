import OpenAI from 'openai';
export default class OpenAIService {
  private static readonly openai = new OpenAI({
    baseURL: `${process.env.OPENAI_BASE_URL}`,
    apiKey: `${process.env.OPENAI_API_KEY}`,
  });

  private static readonly MAX_ATTEMPTS = 3;

  public static async Ask(content: string): Promise<string[][]> {
    let wordsArray = null;
    let attempts = 0;

    while (attempts < this.MAX_ATTEMPTS) {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: this.formatTranslateContentPrompt(content) }],
        model: 'gpt-4o-mini',
      });

      const answer = completion.choices[0].message?.content;
      if (!answer) {
        throw new Error('ChatGPTの応答に回答が含まれていません');
      }

      wordsArray = this.createWordsArray(answer);
      // 偶数のリストが取得できたら、break
      if (wordsArray !== null) {
        break;
      }

      attempts++;
    }

    if (!wordsArray) {
      throw new Error('正しい単語リストを取得できませんでした。');
    }

    return wordsArray;
  }

  // TODO プロンプトの改良
  private static formatTranslateContentPrompt(content: string) {
    const prompt = `
以下に回答例を提示します
・例文1
英文 「池袋に行きたい」 を '池袋','行きたい' と単語抽出し
回答: '池袋', '行きたい', 'いけぶくろ', 'いきたい'

・例文2
英文 「明後日、日本に友達が来るので空港で待ち合わせに最適な場所を教えてください」 を '明後日','友達','日本','来る','会う','場所','教えて' と助詞を除いても日本語の文として自然になるように単語抽出し
回答: '明後日','友達','日本','来る','会う','場所','教えて','あさって','ともだち','にほん','くる','あう','ばしょ','おしえて'

・例文3
英文 「ピラティスやりたいから場所を教えて」を 'ピラティス', 'やりたい', '場所', '教えて' と助詞を除いても日本語の文として自然になるように単語抽出し
回答: 'ピラティス', 'やりたい', '場所', '教えて', 'ぴらてぃす', 'やりたい', 'ばしょ', 'おしえて'

・条件
  1. 文章から単語を文意が通じる日本語の文法で抽出(いつもありがとう、例文はよく見てね)
                      ↓
  2. 前半に抽出した単語をそのまま表示、後半は抽出した単語のひらがなを出力してください。
                      ↓
  3. 回答は以下のフォーマットに従う
  'OO', 'OO', 'oo', 'oo'
     このように必ず一つの意味区切りでカンマをつけること
                      ↓
  4.絶対にリストの数は必ず偶数にすること。つまり、前半と後半が同じ数だけあること。
                      ↓
  5.例文回答を絶対に表示しないこと(回答:を含めないこと)
・文章
${content}
    `;
    return prompt;
  }

  private static createWordsArray(answer: string): string[][] | null {
    const wordsArray = answer.replace(/\s+/g, '').split(/,|、/);
    console.log(wordsArray);

    // 要素数が偶数か確認
    if (wordsArray.length % 2 !== 0) {
      return null;
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
