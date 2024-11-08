import prisma from 'prisma/client';
import UserService from './UserService';
import { WordsLocation } from 'app/types/WordsLocation';

import { Word } from 'app/types/Word';

export default class UserWordsLocationService {
  public static async Create(clientId: string, words: Word[], lat: string, lon: string): Promise<void> {
    const user = await UserService.FindUserByClientId(clientId);

    if (user !== null) {
      prisma.wordsLocation.create({
        data: {
          userId: user.id,
          words: JSON.stringify(words),
          lat,
          lon,
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
          words: JSON.parse(wordsLocation.words) as Word[],
          lat: wordsLocation.lat,
          lon: wordsLocation.lon,
        };
      });

      return wordsLocations;
    } else {
      return null;
    }
  }
}
