'use client';

import useCreateUser from '../hooks/useCreateUser';

const ClientProvider = () => {
  useCreateUser();
  return null; // このコンポーネントはUIを返さない
};

export default ClientProvider;
