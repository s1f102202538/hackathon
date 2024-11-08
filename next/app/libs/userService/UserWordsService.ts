import prisma from 'prisma/client';
import UserService from './UserService';
import { Word } from 'app/types/Word';

export default class UserWordsService {
  public static async Create(clientId: string, word: Word): Promise<void> {
    const user = await UserService.FindUserByClientId(clientId);

    if (user !== null) {
      const duplicate = prisma.word.findFirst({
        where: { userId: user.id, ja: word.ja },
      });
      if (duplicate !== null) {
        return;
      }

      prisma.word.create({
        data: {
          userId: user.id,
          ja: word.ja,
          en: word.en,
        },
      });
    }
  }

  public static async GetWordsList(clientId: string): Promise<Word[] | null> {
    const user = await UserService.FindUserByClientId(clientId);

    if (user !== null) {
      const data = await prisma.word.findMany({
        where: { userId: user.id },
      });

      const words: Word[] = data.map((word) => {
        return {
          ja: word.ja,
          en: word.en,
        };
      });

      return words;
    } else {
      return null;
    }
  }
}
