import prisma from 'prisma/client';
import { Languages, User } from '@prisma/client';
import { ErrorWithtatusCode } from 'app/types/CustomExceptions';

export default class UserService {
  private static readonly usedLanguagesMap: { [key: string]: string } = {
    'en-US': 'EN',
    'en-GB': 'EN_GB',
    'ja-JP': 'JA',
    'fr-FR': 'FR',
    'de-DE': 'DE',
    'es-ES': 'ES',
    'zh-CN': 'ZH',
    'ko-KR': 'KO',
    'it-IT': 'IT',
    'ru-RU': 'RU',
  };

  /**
   * クライアントIDに基づいてユーザーを検索します。
   * ユーザーが存在しない場合は null を返します。
   * @param clientId - Clerkから取得したユーザーID
   * @returns User オブジェクトまたは null
   */
  public static async FindUserByClientId(clientId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { clientId },
    });

    console.log(`Found user: ${user ? user.id : 'None'}`);
    return user;
  }

  /**
   * クライアントIDに基づいて新しいユーザーを作成します。
   * ユーザーが既に存在する場合はエラーをスローします。
   * @param clientId - Clerkから取得したユーザーID
   * @returns 新しく作成された User オブジェクト
   * @throws エラー: ユーザーが既に存在する場合
   */
  public static async Create(clientId: string): Promise<User> {
    const existingUser = await this.FindUserByClientId(clientId);

    if (existingUser !== null) {
      throw new ErrorWithtatusCode('UserService: User has already been created', 400);
    }

    const newUser = await prisma.user.create({
      data: {
        clientId,
      },
    });

    console.log(`User created with ID: ${newUser.id}`);
    return newUser;
  }

  public static async GetUserUsedLang(clientId: string): Promise<Languages> {
    const user = await this.FindUserByClientId(clientId);
    if (user === null || user.usedLang === null) {
      throw new Error('UserService: User UsedLang not found');
    }

    return user.usedLang;
  }

  public static async SetUserUsedLang(clientId: string, usedLang: Languages): Promise<void> {
    const user = await this.FindUserByClientId(clientId);
    if (user === null) {
      return;
    }

    await prisma.user.update({
      where: { clientId: clientId },
      data: {
        usedLang: usedLang,
      },
    });
  }

  public static ConvertLanguagesEnum(lang: string): Languages {
    const usedLang = this.usedLanguagesMap[lang];
    if (!usedLang) {
      throw Error('UserService: Not included in available languages');
    }

    const language = Languages[usedLang as keyof typeof Languages];
    return language;
  }

  public static ConvertSpeakLanguages(usedLang: Languages): string | null {
    for (const [key, val] of Object.entries(this.usedLanguagesMap)) {
      if (val === usedLang) {
        return key;
      }
    }

    return null;
  }
}
