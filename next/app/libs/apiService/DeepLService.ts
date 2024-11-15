import translate, { DeeplLanguages } from 'deepl';
import { Languages } from '@prisma/client';
import SplitText from '../utility/splitText';

export default class DeepLService {
  private static readonly apiKey = `${process.env.DEEPL_API_KEY}`;

  private static readonly languagesMap: { [key: string]: string } = {
    'en-US': 'EN',
    'en-GB': 'EN-GB',
    'ja-JP': 'JA',
    'fr-FR': 'FR',
    'de-DE': 'DE',
    'es-ES': 'ES',
    'zh-CN': 'ZH',
    'ko-KR': 'KO',
    'it-IT': 'IT',
    'ru-RU': 'RU',
  };

  public static async TranslatorText(text: string, target: DeeplLanguages): Promise<string> {
    const response = await translate({
      free_api: true,
      text,
      target_lang: target,
      auth_key: this.apiKey,
    });
    return response.data.translations[0].text;
  }

  public static async TranslatorTextArray(textArray: string[], target: DeeplLanguages): Promise<string[]> {
    const joinText = textArray.join(',');
    const response = await translate({
      free_api: true,
      text: joinText,
      target_lang: target,
      auth_key: this.apiKey,
    });
    return SplitText(response.data.translations[0].text);
  }

  public static convertTranslateLanguages(lang: string): string {
    const translateLang = this.languagesMap[lang];
    if (translateLang === null) {
      throw Error('DeepLService: Not included in translation languages');
    }

    return translateLang;
  }

  public static UserUsedLangConvertTranslateLanguages(userUsedLang: Languages): DeeplLanguages {
    if (userUsedLang === Languages.EN_GB) {
      return 'EN-GB';
    } else {
      return Languages[userUsedLang] as DeeplLanguages;
    }
  }
}
