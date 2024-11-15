'use client';

import React from 'react';
import { BookText, Mic, MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const isDictionaryActive = pathname === '/word-lists';
  const isSpeakActive = pathname === '/speak';
  const isMapActive = pathname === '/map';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 rounded-t-2xl shadow-lg">
      <div className="container mx-auto flex justify-center items-center space-x-16 max-w-lg">
        {/* Dictionaryリンク */}
        <Link
          href="/word-lists"
          aria-label="Lists"
          className="group flex flex-col items-center transition duration-300"
        >
          <BookText
            className={`w-6 h-6 ${isDictionaryActive ? 'text-sky-500' : 'text-gray-500 group-hover:text-sky-500'}`}
          />
          <span
            className={`text-xs mt-1 ${isDictionaryActive ? 'text-sky-500' : 'text-gray-500 group-hover:text-sky-500'}`}
          >
            Lists
          </span>
        </Link>

        {/* Speakリンク */}
        <Link href="/speak" aria-label="Speak" className="group flex flex-col items-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg -mt-8 transition-all duration-300 ${
              isSpeakActive
                ? 'bg-sky-500 shadow-sky-500/50'
                : 'bg-gray-200 shadow-gray-200/50 group-hover:bg-sky-500 group-hover:shadow-sky-500/50'
            }`}
          >
            <Mic className={`w-8 h-8 ${isSpeakActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
          </div>
          <span className={`text-xs mt-1 ${isSpeakActive ? 'text-sky-500' : 'text-gray-500 group-hover:text-sky-500'}`}>
            Speak
          </span>
        </Link>

        {/* Mapリンク */}
        <Link href="/map" aria-label="Map" className="group flex flex-col items-center transition duration-300">
          <MapPin className={`w-6 h-6 ${isMapActive ? 'text-sky-500' : 'text-gray-500 group-hover:text-sky-500'}`} />
          <span className={`text-xs mt-1 ${isMapActive ? 'text-sky-500' : 'text-gray-500 group-hover:text-sky-500'}`}>
            Map
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
