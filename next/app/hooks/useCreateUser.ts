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
          await axios.post('/api/user/create', { clientId: userId });
          console.log('User created or already exists');
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
