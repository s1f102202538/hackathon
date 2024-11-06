import { PrismaClient, User } from '@prisma/client';

export default class UserService {
  private static readonly prisma = new PrismaClient();

  public static async Create(clientId: string): Promise<User> {
    const user = await UserService.FindUserByClientId(clientId);
    if (user !== null) {
      throw new Error('User has already been created');
    }

    const newUser = await this.prisma.user.create({
      data: {
        clientId,
      },
    });
    return newUser;
  }

  public static async FindUserByClientId(clientId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { clientId },
    });

    if (user === null) {
      throw new Error('User not found');
    }

    return user;
  }
}
