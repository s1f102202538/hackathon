// next/prisma/client.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Prisma Clientがグローバルに存在することを宣言
  // これにより、開発環境でホットリロード時にクライアントが再生成されないようにします
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
