'use client';

import { useEffect } from 'react';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import HowToPlay from '@/components/home/HowToPlay';

export default function HomePage() {
  useEffect(() => {
    // Enable scrolling on the homepage by adding a body class
    document.body.classList.add('homepage');
    return () => {
      document.body.classList.remove('homepage');
    };
  }, []);

  return (
    <main className="flex-1 flex flex-col">
      <Navbar />
      <Hero />
      <HowToPlay />
    </main>
  );
}
