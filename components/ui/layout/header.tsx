'use client';

import Navbar from '@/components/ui/layout/navbar';

export function Header() {
  return (
    <header className="bg-black dark:bg-semi-transparent shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-0 flex justify-center items-center">
        <Navbar />
      </div>
    </header>
  );
}
