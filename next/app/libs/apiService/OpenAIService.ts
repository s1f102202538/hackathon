import OpenAI from 'openai';
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
    if (answer === null) {
      throw new Error('ChatGPT Response not incloud answer');
    }
    return this.createWordsArray(answer);
  }

  // TODO プロンプトの改良
  private static formatTranslateContentPrompt(content: string) {
    const prompt = `
以下に回答例を提示します
・例文1
英文 「明後日、日本に友達が来るので空港で待ち合わせに最適な場所を教えてください」 を "あさって","ともだち","にほん","くる","あう","ばしょ","おしえて" と単語抽出し
回答"あさって","ともだち","にほん","くる","あう","ばしょ","おしえて"
・例文2
英文「明日は雨が降るそうなので、行く観光地を変更したいと思っています。」 を "あした","てんき","あめ","いく","かんこう","ばしょ","かえたい" と単語抽出し
回答"あした","てんき","あめ","いく","かんこう","ばしょ","かえたい"


質問: 以下の文章を条件の順番に従って単語を抽出して下さい。回答は単語のみを返してください。例文回答を絶対表示しないでください
・条件
  1,文章から単語を文意が通じる文法で抽出
                      ↓
  2,単語はひらがなにする
                      ↓
  3,回答は以下のフォーマットに従う
    ・"〇〇", "〇〇"
                      ↓
  4,回答は単語のみにすること
                      ↓
  5,例文回答を絶対に表示しないこと
・文章
${content}
    `;
    return prompt;
  }

  private static createWordsArray(answer: string): string[] {
    const wordsArray = answer.split(',');
    return wordsArray;
  }
}
