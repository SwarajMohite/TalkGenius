'use client';

import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  return (
    <nav className="relative z-10 flex w-full items-center justify-between border-b border-neutral-700 bg-gray-900 px-4 py-4">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
        <h1 className="text-base font-bold text-white md:text-2xl">TalkGenius</h1>
      </div>
      <SignedIn>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" passHref>
            <button className="w-24 transform rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-500 md:w-32">
              Dashboard
            </button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </nav>
  );
}
