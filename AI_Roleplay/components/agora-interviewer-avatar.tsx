// components/agora-interviewer-avatar.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface AgoraInterviewerAvatarProps {
  isSpeaking: boolean;
  interviewerName?: string;
  companyName?: string;
  className?: string;
  onAvatarReady?: () => void;
}

const AgoraInterviewerAvatar: React.FC<AgoraInterviewerAvatarProps> = ({
  isSpeaking,
  interviewerName = 'Alex',
  companyName = 'Hiring Team',
  className = '',
  onAvatarReady
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Initialize avatar
  useEffect(() => {
    const initializeAvatar = async () => {
      try {
        setIsLoading(true);
        
        // Simulate loading time
        setTimeout(() => {
          setIsLoading(false);
          if (onAvatarReady) onAvatarReady();
        }, 2000);
        
      } catch (err) {
        console.error('Failed to initialize avatar:', err);
        setError('Failed to load interviewer avatar');
        setIsLoading(false);
        if (onAvatarReady) onAvatarReady();
      }
    };

    initializeAvatar();
  }, [onAvatarReady]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-800 ${className}`}>
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <p className="text-xl font-semibold mb-2">{interviewerName}</p>
          <p className="text-sm opacity-75">{companyName}</p>
          <p className="text-xs text-red-300 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading ? (
        <div className="flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-800 h-full w-full rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <span className="ml-2 text-white">Loading avatar...</span>
        </div>
      ) : (
        <>
          {/* Avatar container */}
          <div className="w-full h-full bg-gradient-to-br from-blue-800 to-purple-800 rounded-lg flex items-center justify-center relative">
            {/* Avatar content */}
            <div className="text-center text-white z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <p className="text-xl font-semibold mb-2">{interviewerName}</p>
              <p className="text-sm opacity-75">{companyName}</p>
              <p className="text-xs mt-2 text-blue-200">AI Interviewer</p>
            </div>
            
            {/* Animated background when speaking */}
            {isSpeaking && (
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg animate-pulse"></div>
            )}
          </div>
          
          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="flex space-x-1 bg-black bg-opacity-50 px-3 py-2 rounded-full">
                <div className="w-2 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-6 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-4 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AgoraInterviewerAvatar;