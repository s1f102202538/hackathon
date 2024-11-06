import { PrismaClient } from '@prisma/client';
import UserService from './UserService';
import { Word } from 'app/types/Word';

export default class UserWordsService {
  private static readonly prisma = new PrismaClient();

  public static async Create(clientId: string, word: Word): Promise<void> {
    const user = await UserService.FindUserByClientId(clientId);

    // 同じ単語が存在していた場合は作成しない
    const duplicate = this.prisma.word.findFirst({
      where: { userId: user.id, ja: word.ja },
    });
    if (duplicate !== null) {
      return;
    }

    this.prisma.word.create({
      data: {
        userId: user.id,
        ja: word.ja,
        en: word.en,
      },
    });
  }

  public static async GetWordsList(clientId: string): Promise<Word[]> {
    const user = await UserService.FindUserByClientId(clientId);

    const data = await this.prisma.word.findMany({
      where: { userId: user.id },
    });

    const words: Word[] = data.map((word) => {
      return {
        ja: word.ja,
        en: word.en,
      };
    });

    return words;
  }
}
