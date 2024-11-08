import prisma from 'prisma/client';
import UserService from './UserService';
import { Location } from 'app/types/Location';

export default class UserLocationService {
  public static async Create(clientId: string, lat: string, lon: string): Promise<void> {
    const user = await UserService.FindUserByClientId(clientId);

    if (user !== null) {
      prisma.location.create({
        data: {
          userId: user.id,
          lat,
          lon,
        },
      });
    }
  }

  public static async GetLocationList(clientId: string): Promise<Location[] | null> {
    const user = await UserService.FindUserByClientId(clientId);

    if (user !== null) {
      const data = await prisma.location.findMany({
        where: { userId: user.id },
      });

      const locationList: Location[] = data.map((location) => {
        return {
          lat: location.lat,
          lon: location.lon,
        };
      });

      return locationList;
    } else {
      return null;
    }
  }
}
