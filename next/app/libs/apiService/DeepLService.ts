import translate, { DeeplLanguages } from 'deepl';

export default class DeepLService {
  private static readonly apiKey = `${process.env.DEEPL_API_KEY}`;

  public static async TranslatorText(text: string, target: DeeplLanguages): Promise<string> {
    const response = await translate({
      free_api: true,
      text,
      target_lang: target,
      auth_key: this.apiKey,
    });
    return response.data.translations[0].text;
  }

  public static async TranslatorWordsArray(textArray: string[], target: DeeplLanguages): Promise<string[]> {
    const joinText = textArray.join(',');
    const response = await translate({
      free_api: true,
      text: joinText,
      target_lang: target,
      auth_key: this.apiKey,
    });
    return this.createTranslateWordsArray(response.data.translations[0].text);
  }

  private static createTranslateWordsArray(translateText: string): string[] {
    const wordsArray = translateText.split(',');
    return wordsArray;
  }
}
