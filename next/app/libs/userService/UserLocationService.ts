import { PrismaClient } from '@prisma/client';
import UserService from './UserService';
import { Location } from 'app/types/Location';

export default class UserLocationService {
  private static readonly prisma = new PrismaClient();

  public static async Create(clientId: string, lat: string, lon: string): Promise<void> {
    const user = await UserService.FindUserByClientId(clientId);
    this.prisma.location.create({
      data: {
        userId: user.id,
        lat,
        lon,
      },
    });
  }

  public static async GetLocationList(clientId: string): Promise<Location[]> {
    const user = await UserService.FindUserByClientId(clientId);

    const data = await this.prisma.location.findMany({
      where: { userId: user.id },
    });

    const locationList: Location[] = data.map((location) => {
      return {
        lat: location.lat,
        lon: location.lon,
      };
    });

    return locationList;
  }
}
