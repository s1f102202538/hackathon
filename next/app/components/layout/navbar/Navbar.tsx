'use client';

import React, { useState, useEffect } from 'react';
import { BookMarked, Mic, MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('/speak');

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 rounded-t-2xl shadow-lg">
      {/* コンテナの幅を調整し、アイテムを中央に配置 */}
      <div className="container mx-auto flex justify-center items-center space-x-16 max-w-lg">
        {/* Menuリンク */}
        <Link
          href="/word-lists"
          aria-label="Word Lists"
          className={`flex flex-col items-center ${
            activeItem === '/word-lists'
              ? 'text-white bg-sky-500 rounded-full p-3 transition duration-300'
              : 'text-gray-500 hover:text-sky-500 transition duration-300'
          }`}
        >
          <BookMarked className="w-6 h-6" />
          <span className="text-xs mt-1">Menu</span>
        </Link>

        {/* Speakリンク */}
        <Link
          href="/speak"
          aria-label="Speak"
          className={`flex flex-col items-center ${
            activeItem === '/speak' ? 'text-sky-500' : 'text-gray-500 hover:text-sky-500'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
              activeItem === '/speak' ? 'bg-sky-500 shadow-sky-500/50' : 'bg-gray-200 shadow-gray-200/50'
            } -mt-8 transition-all duration-300`}
          >
            <Mic className={`w-8 h-8 ${activeItem === '/speak' ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <span className="text-xs mt-1">Speak</span>
        </Link>

        {/* Placesリンク */}
        <Link
          href="/map"
          aria-label="Places"
          className={`flex flex-col items-center ${
            activeItem === '/map'
              ? 'text-white bg-sky-500 rounded-full p-3 transition duration-300'
              : 'text-gray-500 hover:text-sky-500 transition duration-300'
          }`}
        >
          <MapPin className="w-6 h-6" />
          <span className="text-xs mt-1">Places</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
