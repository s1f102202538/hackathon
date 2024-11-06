import { PrismaClient } from '@prisma/client';
import UserService from './UserService';

export default class LocationService {
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
}
