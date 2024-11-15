'use client';

import React from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-sky-400 to-blue-500 p-4 shadow-md relative">
      {/* ロゴを左端に配置し、/speakにリダイレクト */}
      <div className="flex items-center">
        <Link href="/speak" aria-label="Navigate to Speak Page">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="mr-2 cursor-pointer" />
        </Link>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-lg font-bold text-white whitespace-nowrap text-center">{title}</h1>
      </div>

      {/* アイコンを右端に配置 */}
      <div className="flex items-center space-x-2">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
