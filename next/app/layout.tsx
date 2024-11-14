// next/app/layout.tsx
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import './styles/globals.css';
import ClientProvider from './components/ClientProvider';

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
  return (
    <html lang="ja">
      <body>
        <ClerkProvider signInFallbackRedirectUrl="/speak">
          <ClientProvider />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
};

export default RootLayout;
