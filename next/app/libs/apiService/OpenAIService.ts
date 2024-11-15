import OpenAI from 'openai';
import SplitText from '../utility/SplitText';

export default class OpenAIService {
  private static readonly openai = new OpenAI({
    baseURL: `${process.env.OPENAI_BASE_URL}`,
    apiKey: `${process.env.OPENAI_API_KEY}`,
  });

  public static async Ask(content: string): Promise<string[]> {
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: this.formatTranslateContentPrompt(content) }],
      model: 'gpt-4o-mini',
    });

    const answer = completion.choices[0].message?.content;

    if (!answer) {
      throw new Error('OpenAIService: ChatGPT Answer is null');
    }

    return SplitText(answer);
  }

  // TODO プロンプトの改良
  private static formatTranslateContentPrompt(content: string) {
    const prompt = `
以下に回答例を提示します
・例文1
英文 「池袋に行きたい」 を '池袋','行きたい' と単語抽出し
回答: '池袋', '行きたい'
・例文2
英文 「明後日、日本に友達が来るので空港で待ち合わせに最適な場所を教えてください」 を '明後日','友達','日本','来る','会う','場所','教えて' と単語抽出し
回答: '明後日','友達','日本','来る','会う','場所','教えて'
・例文3
英文 「ピラティスやりたいから場所を教えて」を 'ピラティス', 'やりたい', '場所', '教えて' と単語抽出し
回答: 'ピラティス', 'やりたい', '場所', '教えて'
・条件
  1. 文章から単語を文意が通じる日本語の文法で抽出(いつもありがとう、例文はよく見てね)
                      ↓
  2. 回答は以下のフォーマット
  'OO', 'OO', 'OO', 'OO',
     このように必ず一つの意味区切りでカンマをつけること
                      ↓
  3.例文回答を絶対に表示しないこと(回答:を含めないこと)
・文章
${content}
    `;
    return prompt;
  }
}
