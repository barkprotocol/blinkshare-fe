import { ReactNode } from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-100 dark:bg-gray-900">
      <div className="sm:w-1/2 flex items-center justify-center p-8 bg-primary">
        <div className="max-w-md">
          <Image
            src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
            alt="BlinkShare Logo"
            width={200}
            height={200}
            className="mb-8"
          />
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to BlinkShare</h1>
          <p className="text-xl text-white opacity-80">
            Create, share, and manage your Blinks with ease. Powered by BARK Protocol.
          </p>
        </div>
      </div>
      <div className="sm:w-1/2 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}

