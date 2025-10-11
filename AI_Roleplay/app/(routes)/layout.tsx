// app/dashboard/interview/layout.tsx
import React from 'react';

export default function InterviewLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      {children}
    </div>
  );
}