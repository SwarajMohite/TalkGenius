"use client";
import React from 'react';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MenuOptions = [
  {
    name: 'Dashboard',
    path: '/dashboard'
  },
  {
    name: 'Upgrade',
    path: '/upgrade'
  },
  {
    name: 'How it works',
    path: '/how-it-works'
  }
];

function AppHeader() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Image 
          src='/logo.svg' 
          alt='AI Mock Interview Logo' 
          width={40} 
          height={40}
          className="rounded-lg"
          priority
        />
        <Link href="/dashboard">
          <h1 className="text-base font-bold md:text-2xl text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            AI Mock Interview
          </h1>
        </Link>
      </div>
      
      <div className="hidden md:block">
        <ul className='flex gap-6'>
          {MenuOptions.map((option, index) => (
            <li key={index}>
              <Link 
                href={option.path}
                className={`text-lg font-medium transition-all duration-200 hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                  pathname === option.path 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {option.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button 
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2"
          onClick={() => {/* Add mobile menu toggle logic */}}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
              userButtonPopoverCard: "shadow-lg border border-gray-200 dark:border-gray-700"
            }
          }}
        />
      </div>
    </nav>
  );
}

export default AppHeader;