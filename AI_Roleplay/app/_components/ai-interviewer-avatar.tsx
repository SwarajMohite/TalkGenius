// components/ai-interviewer-avatar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AIInterviewerAvatarProps {
  isSpeaking: boolean;
  interviewerName?: string;
  companyName?: string;
  className?: string;
}

const AIInterviewerAvatar: React.FC<AIInterviewerAvatarProps> = ({
  isSpeaking,
  interviewerName = 'Alex',
  companyName = 'Hiring Team',
  className = ''
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Initialize Akool avatar (pseudo-code - replace with actual Akool SDK)
  useEffect(() => {
    const initializeAvatar = async () => {
      try {
        setIsLoading(true);
        
        // This is pseudo-code - replace with actual Akool API implementation
        // const avatar = await AkoolSDK.createAvatar({
        //   style: 'professional',
        //   gender: 'male',
        //   age: '30-40',
        //   background: 'office'
        // });
        
        // Simulate loading an avatar (replace with actual Akool URL)
        setTimeout(() => {
          // For demo purposes, using a placeholder
          setAvatarUrl('/api/placeholder/300/300');
          setIsLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Failed to initialize AI avatar:', err);
        setError('Failed to load interviewer avatar');
        setIsLoading(false);
      }
    };

    initializeAvatar();
  }, []);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-800 ${className}`}>
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <p className="text-xl font-semibold mb-2">{interviewerName}</p>
          <p className="text-sm opacity-75">{companyName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading ? (
        <div className="flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-800 h-full w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          {/* AI Avatar Container */}
          <div className="w-full h-full bg-gradient-to-br from-blue-800 to-purple-800 flex items-center justify-center">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={`${interviewerName} - Interviewer`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-xl font-semibold mb-2">{interviewerName}</p>
                <p className="text-sm opacity-75">{companyName}</p>
              </div>
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

export default AIInterviewerAvatar;