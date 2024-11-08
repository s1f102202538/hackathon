'use client';

import useCreateUser from '../hooks/useCreateUser';
<<<<<<< Updated upstream

const ClientProvider = () => {
  useCreateUser();
  return null; // このコンポーネントはUIを返さない
};

=======
import { useAuth } from '@clerk/nextjs';

const ClientProvider = () => {
  const { isSignedIn, userId } = useAuth();

  // ユーザーがサインインしている場合にのみユーザー作成処理を実行
  useCreateUser(isSignedIn ? userId : null);
  return null; // このコンポーネントはUIを返さない
};

>>>>>>> Stashed changes
export default ClientProvider;
