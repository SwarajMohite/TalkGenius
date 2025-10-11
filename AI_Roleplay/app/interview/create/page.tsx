// app/interview/create/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InterviewCreateRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/interview/create');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Redirecting to interview creation page...</p>
      </div>
    </div>
  );
}