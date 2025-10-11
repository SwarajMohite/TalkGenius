// app/(routes)/dashboard/interview/active-with-avatar/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import AgoraInterviewerAvatar from '@/components/agora-interviewer-avatar';

// Import from the correct path - go up one level to the interview directory
const OriginalActiveInterview = dynamic(
  () => import('../active/page'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
);

const ActiveInterviewWithAvatar: React.FC = () => {
  const [isAvatarReady, setIsAvatarReady] = useState(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const router = useRouter();

  // Simulate interviewer speaking (replace with real TTS integration)
  useEffect(() => {
    // This would be replaced with actual speech detection
    // For now, we'll simulate occasional speaking
    const interval = setInterval(() => {
      setIsInterviewerSpeaking(prev => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fallback component in case the dynamic import fails
  const InterviewFallback = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Interview Session</h2>
        <p className="text-gray-600 mb-4">Unable to load the interview interface.</p>
        <button
          onClick={() => router.push('/dashboard/interview/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create New Interview
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Floating Agora Avatar */}
        <div className="fixed bottom-6 right-6 z-50 w-32 h-32 rounded-full overflow-hidden shadow-lg border-2 border-white">
          <AgoraInterviewerAvatar 
            isSpeaking={isInterviewerSpeaking}
            interviewerName="Alex"
            companyName="Interviewer"
            onAvatarReady={() => setIsAvatarReady(true)}
          />
        </div>
        
        {/* Original Interview Content with error boundary */}
        <React.Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <OriginalActiveInterview />
        </React.Suspense>
        
        {/* Optional: Add a loading overlay until avatar is ready */}
        {!isAvatarReady && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white p-4 rounded-lg text-center flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
              <p className="text-sm">Setting up AI interviewer...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveInterviewWithAvatar;