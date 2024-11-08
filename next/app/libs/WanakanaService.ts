import { toRomaji } from 'wanakana';

export default class WanakanaService {
  public static TextArrayToRomaji(textArray: string[]): string[] {
    const romajiList = textArray.map((text) => {
      return toRomaji(text);
    });

    return romajiList;
  }
}
