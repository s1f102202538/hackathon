'use client';

import useCreateUser from '../hooks/useCreateUser';
import { useAuth } from '@clerk/nextjs';

const ClientProvider = () => {
  const { isSignedIn, userId } = useAuth();

  // ユーザーがサインインしている場合にのみユーザー作成処理を実行
  useCreateUser(isSignedIn ? userId : null);
  return null; // このコンポーネントはUIを返さない
};

export default ClientProvider;
