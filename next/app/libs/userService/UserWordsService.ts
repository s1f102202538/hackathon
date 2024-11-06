import { PrismaClient } from '@prisma/client';
import UserService from './UserService';
import { Word } from 'app/types/Word';

export default class UserWordsService {
  private static readonly prisma = new PrismaClient();

  public static async Create(clientId: string, word: Word): Promise<void> {
    const user = await UserService.FindUserByClientId(clientId);

    this.prisma.word.create({
      data: {
        userId: user.id,
        ja: word.ja,
        en: word.en,
      },
    });
  }
}
