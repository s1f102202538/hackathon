import prisma from 'prisma/client';
import UserService from './UserService';
import { WordsLocation } from 'app/types/WordsLocation';

import { Word } from 'app/types/Word';

export default class UserWordsLocationService {
  public static async Create(clientId: string, words: Word[], lat: string, lon: string): Promise<void> {
    const user = await UserService.FindUserByClientId(clientId);

    if (user !== null) {
      await prisma.wordsLocation.create({
        data: {
          userId: user.id,
          words: JSON.stringify(words),
          lat,
          lon,
          comment: '',
        },
      });
    }
  }

  public static async GetLocationList(clientId: string): Promise<WordsLocation[] | null> {
    const user = await UserService.FindUserByClientId(clientId);

    if (user !== null) {
      const data = await prisma.wordsLocation.findMany({
        where: { userId: user.id },
      });

      const wordsLocations: WordsLocation[] = data.map((wordsLocation) => {
        return {
          id: wordsLocation.id,
          words: JSON.parse(wordsLocation.words) as Word[],
          lat: wordsLocation.lat,
          lon: wordsLocation.lon,
          comment: wordsLocation.comment,
        };
      });

      return wordsLocations;
    } else {
      return null;
    }
  }

  public static async SaveComment(clientId: string, id: number, comment: string): Promise<void> {
    const user = await UserService.FindUserByClientId(clientId);

    if (user !== null) {
      await prisma.wordsLocation.update({
        where: { userId: user.id, id },
        data: {
          comment,
        },
      });
    }
  }
}
