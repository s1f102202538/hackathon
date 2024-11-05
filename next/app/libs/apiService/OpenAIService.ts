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
    if (answer == null) {
      throw new Error('ChatGPT Response not incloud answer');
    }
    return this.createWordsArray(answer);
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
    const wordsArray = answer.split(',');
    return wordsArray;
  }
}
