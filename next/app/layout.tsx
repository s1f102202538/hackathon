import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Next App',
  description: 'Next App Description',
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <ClerkProvider>
    <html lang="en">
      <body>{children}</body>
    </html>
  </ClerkProvider>
);

export default RootLayout;
