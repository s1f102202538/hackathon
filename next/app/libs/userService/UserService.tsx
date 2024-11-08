// import { PrismaClient, User } from '@prisma/client';

// export default class UserService {
//   private static readonly prisma = new PrismaClient();

//   public static async Create(clientId: string): Promise<User> {
//     const user = await UserService.FindUserByClientId(clientId);
//     if (user !== null) {
//       throw new Error('User has already been created');
//     }

//     const newUser = await this.prisma.user.create({
//       data: {
//         clientId,
//       },
//     });
//     return newUser;
//   }

//   public static async FindUserByClientId(clientId: string): Promise<User> {
//     const user = await this.prisma.user.findUnique({
//       where: { clientId },
//     });

//     if (user === null) {
//       throw new Error('User not found');
//     }

//     return user;
//   }
// }
// next/app/libs/userService/UserService.tsx
import prisma from '../../../prisma/client'; // 正しい相対パス
import { User } from '@prisma/client';

export default class UserService {
  /**
   * クライアントIDに基づいてユーザーを検索します。
   * ユーザーが存在しない場合は null を返します。
   * @param clientId - Clerkから取得したユーザーID
   * @returns User オブジェクトまたは null
   */
  public static async FindUserByClientId(clientId: string): Promise<User | null> {
    console.log(`Finding user with clientId: ${clientId}`);
    const user = await prisma.user.findUnique({
      where: { clientId },
    });
    console.log(`Found user: ${user ? user.id : 'None'}`);
    return user;
  }

  /**
   * クライアントIDに基づいて新しいユーザーを作成します。
   * ユーザーが既に存在する場合はエラーをスローします。
   * @param clientId - Clerkから取得したユーザーID
   * @returns 新しく作成された User オブジェクト
   * @throws エラー: ユーザーが既に存在する場合
   */
  public static async Create(clientId: string): Promise<User> {
    console.log(`Creating user with clientId: ${clientId}`);
    const existingUser = await this.FindUserByClientId(clientId);
    if (existingUser !== null) {
      console.log(`User with clientId ${clientId} already exists.`);
      throw new Error('User has already been created');
    }

    const newUser = await prisma.user.create({
      data: {
        clientId,
      },
    });

    console.log(`User created with ID: ${newUser.id}`);
    return newUser;
  }
}
