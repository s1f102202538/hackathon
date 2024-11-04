'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { List, Mic, MapPinCheckInside } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {/* リストリンク */}
        <Link
          href="/word-lists"
          className={`flex flex-col items-center p-2 text-gray-600 transition-colors duration-200 hover:text-sky-500${
            pathname === '/word-lists' ? 'text-sky-500' : ''
          }`}
        >
          <List className="w-6 h-6" />
        </Link>

        {/* マイリンク */}
        <Link
          href="/speak"
          className={`flex flex-col items-center p-2 text-gray-600 transition-colors duration-200 hover:text-sky-500${
            pathname === '/speak' ? 'text-sky-500' : ''
          }`}
        >
          <Mic className="w-6 h-6" />
        </Link>

        {/* マップリンク */}
        <Link
          href="/map"
          className={`flex flex-col items-center p-2 text-gray-600 transition-colors duration-200 hover:text-sky-500${
            pathname === '/map' ? 'text-sky-500' : ''
          }`}
        >
          <MapPinCheckInside className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
