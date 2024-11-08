// next/app/layout.tsx
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import './styles/globals.css';
import ClientProvider from './components/ClientProvider';
<<<<<<< Updated upstream
=======
// import { useAuth } from '@clerk/nextjs';
// import useCreateUser from './hooks/useCreateUser';
>>>>>>> Stashed changes

export const metadata: Metadata = {
  title: 'Next App',
  description: 'Next App Description',
};

// ClerkProvider を動的インポートし、サーバーサイドレンダリングを無効化
const ClerkProvider = dynamic(() => import('@clerk/nextjs').then((mod) => mod.ClerkProvider), {
  ssr: false,
});

type Props = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
<<<<<<< Updated upstream
=======
  // const [userId, setUserId] = useState(String);

  // if (userId === null) {
  //   const userId = useAuth();
  //   setUserId(userId);
  // }

  // if (!userId){
  //   useCreateUser();
  // }
  // const [userId, setUserId] = useState();

>>>>>>> Stashed changes
  return (
    <html lang="ja">
      <body>
        <ClerkProvider>
          <ClientProvider />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
};

export default RootLayout;
