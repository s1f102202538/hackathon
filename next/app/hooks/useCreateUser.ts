// next/app/hooks/useCreateUser.ts
'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

const useCreateUser = () => {
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    const createUser = async () => {
      if (isSignedIn && userId) {
        try {
<<<<<<< Updated upstream
          await axios.post('/api/user/create', { clientId: userId });
          console.log('User created or already exists');
=======
          // ユーザーの存在確認
          const getResponse = await axios.post('/api/user/get', { clientId: userId });
          const { user } = getResponse.data;

          if (!user) {
            // ユーザーが存在しない場合、新規作成
            await axios.post('/api/user/create', { clientId: userId });
            console.log('User created');
          } else {
            console.log('User already exists');
          }
>>>>>>> Stashed changes
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 400) {
              // ユーザーが既に存在する場合は何もしない
              console.log('User already exists');
            } else {
              console.error('Axios Error creating user:', error.message);
            }
          } else {
            console.error('Unexpected Error creating user:', error);
          }
        }
      }
    };

    createUser();
  }, [isSignedIn, userId]);
};

export default useCreateUser;
