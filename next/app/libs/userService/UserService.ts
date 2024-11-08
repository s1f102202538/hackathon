import prisma from 'prisma/client';
import { User } from '@prisma/client';
import { ErrorWithtatusCode } from 'app/types/CustomExceptions';

export default class UserService {
  /**
   * クライアントIDに基づいてユーザーを検索します。
   * ユーザーが存在しない場合は null を返します。
   * @param clientId - Clerkから取得したユーザーID
   * @returns User オブジェクトまたは null
   */
  public static async FindUserByClientId(clientId: string): Promise<User | null> {
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
    const existingUser = await this.FindUserByClientId(clientId);

    if (existingUser !== null) {
      throw new ErrorWithtatusCode('UserService: User has already been created', 400);
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
