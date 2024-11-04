import OpenAI from 'openai';

// OPENAI_API_KEY=lD6B4UmuZU-9DDnC_P6EutwjSNXrHDPjs4K-qam6qypUp_7-GEYRMQep2JEdLKYDyx6_HIndhWIa-3UyiCVvakA
// OPENAI_BASE_URL=https://api.openai.iniad.org/api/v1
export default class OpenAIService {
  private static readonly openai = new OpenAI({
    // baseURL: `${process.env.OPENAI_BASE_URL}`,
    // apiKey: `${process.env.OPENAI_API_KEY}`,
  });

  public static async Ask(content: string): Promise<string[] | null> {
    console.log(`baseURL: ${process.env.OPENAI_BASE_URL}`);
    console.log(`apikey: ${process.env.OPENAI_API_KEY}`);
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: this.formatTranslateContentPrompt(content) }],
      model: 'gpt-4o-mini',
    });
    console.log('completion:', completion);
    const answer = completion.choices[0].message?.content;
    if (answer != null) {
      return this.createWordsArray(answer);
    }
    return null;
  }

  // TODO プロンプトの改良
  private static formatTranslateContentPrompt(content: string) {
    const prompt = `
以下の文章を日本語に翻訳して、条件に従って文意が通るように言葉を抽出して下さい。
・条件
  ・6単語以下にすること
  ・例: I'm looking for a place to eat → ごはん, 探す
  ・回答は以下のフォーマットに従うこと
    ・"ごはん", "探す"
・文章
${content}
    `;
    return prompt;
  }

  private static createWordsArray(answer: string): string[] {
    // 日本語(漢字, ひらがな, 全角カタカナ, 半角英数字)を抽出してstring配列にする
    const wordArray = answer.split('^[a-zA-Z0-9ぁ-んァ-ヶー\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]*$');
    return wordArray;
  }
}
