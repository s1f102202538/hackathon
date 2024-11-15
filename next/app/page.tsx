'use client';

import React, { useState } from 'react';
import { Mic, BookMarked, MapPinCheckInside, Check } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  const [activeTab, setActiveTab] = useState('speak');
  const router = useRouter();

  const features = [
    {
      icon: Mic,
      title: 'Voice Translation',
      description: 'Translates into simple Japanese words. Supports conversations in Japanese with Japanese speakers.',
    },
    {
      icon: BookMarked,
      title: 'List of words you used',
      description: 'Each time you translate, your Japanese vocabulary list will grow. Review and practice later.',
    },
    {
      icon: MapPinCheckInside,
      title: 'Lookback Mode',
      description: 'Look back at the words you used and the places you spoke with Japanese people.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      <header className="bg-gradient-to-r from-sky-400 to-blue-500 py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" aria-label="Navigate to Home Page" className="flex items-center">
            <div className="flex">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
              />
              <h1 className="justify-center text-white font-bold-3xl text-3xl">Whispra</h1>
            </div>
          </Link>
          <Button
            variant="outline"
            className="bg-white text-blue-500 hover:bg-blue-50"
            onClick={() => router.push('/sign-in')}
          >
            Login
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* セクション1: メインキャッチコピー */}
        <section className="mb-16 text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 animate-fade-in-down">
            Break the Language Barrier in Japan
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience Japanese to Japanese communication with our AI-powered translation app. Talk, connect, and
            reminisce about your trip to Japan.
          </p>
          <div className="animate-fade-in-up">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg"
              onClick={() => router.push('/sign-in')}
            >
              Start Your Journey
            </Button>
          </div>
        </section>

        {/* セクション2: Why Choose Whispra */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 flex justify-center items-center space-x-2">
            <span className="mx-2">Why Choose</span>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={24}
              height={24}
              className="cursor-pointer transition-transform duration-300 hover:scale-110"
            />
            <span className="font-bold text-sky-500">Whispra</span>?
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="animate-fade-in">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-500">
                      <feature.icon className="mr-2" /> {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* セクション3: How It Works */}
        <section className="mb-16 bg-gradient-to-r from-blue-100 to-sky-100 rounded-lg p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h3>
          <div className="w-full">
            <div className="grid w-full grid-cols-3 mb-4">
              {['speak', 'lists', 'map'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 text-center font-medium ${
                    activeTab === tab ? 'bg-white text-blue-500 rounded-t-lg' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-lg p-4">
              {activeTab === 'speak' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Speak Japanese</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Simply speak into the device in your language. Our AI will translate your speech into simple,
                      understandable Japanese.
                    </p>
                  </CardContent>
                </Card>
              )}
              {activeTab === 'lists' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Original Dictionary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Create your own dictionary. The words you use are saved in your wordlists and you can look back at
                      them anytime.
                    </p>
                  </CardContent>
                </Card>
              )}
              {activeTab === 'map' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Conversation Memories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      You can record the location of your conversations with Japanese people. Link the words you spoke
                      to your location.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* セクション4: Call to Action */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-500 to-sky-500 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Speak Japanese with Confidence?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-2">
                {['Voice translation', 'Your Original Dictionary', 'Conversation Memories'].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2" /> {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="bg-white text-blue-500 hover:bg-blue-50 font-bold py-2 px-6 rounded-full shadow-lg"
                onClick={() => router.push('/sign-in')}
              >
                Start Now
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* セクション5: 最終呼びかけ */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your Japanese Adventure Today!</h2>
          <p className="text-xl text-gray-600 mb-8">Enter our app and transform the way you communicate in Japan.</p>
          <div className="flex justify-center space-x-4"></div>
        </section>
      </main>
    </div>
  );
};

export default Home;
