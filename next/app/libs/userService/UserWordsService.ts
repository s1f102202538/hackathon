import prisma from 'prisma/client';
import UserService from './UserService';
import { Word, WordWithCount } from 'app/types/Word';

export default class UserWordsService {
  public static async Create(clientId: string, word: Word): Promise<void> {
    const user = await UserService.FindUserByClientId(clientId);

    if (user !== null) {
      const duplicate = await prisma.word.findFirst({
        where: { userId: user.id, ja: word.ja },
      });

      // 既にdbにwordが保存されている場合countを増やす
      if (duplicate !== null) {
        await prisma.word.update({
          where: { id: duplicate.id },
          data: {
            count: duplicate.count++,
          },
        });

        return;
      }

      await prisma.word.create({
        data: {
          userId: user.id,
          ja: word.ja,
          en: word.en,
          romaji: word.romaji,
        },
      });
    }
  }

  public static async GetWordsList(clientId: string): Promise<WordWithCount[] | null> {
    const user = await UserService.FindUserByClientId(clientId);

    if (user !== null) {
      const data = await prisma.word.findMany({
        where: { userId: user.id },
      });

      const words = data.map((word) => {
        return {
          word: {
            ja: word.ja,
            en: word.en,
            romaji: word.romaji,
          } as Word,
          count: word.count,
        };
      });

      return words;
    } else {
      return null;
    }
  }
}
