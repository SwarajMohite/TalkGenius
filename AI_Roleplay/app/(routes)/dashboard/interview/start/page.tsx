// app/(routes)/dashboard/interview/start/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, FileText, Brain, RefreshCw, Users, Target, Zap } from 'lucide-react';

const Button = ({ children, onClick, disabled, className, ...props }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

interface Question {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  category?: string;
  timeLimit?: number;
  fieldRelevant?: boolean;
}

interface InterviewSession {
  profile: {
    jobTitle: string;
    jobDescription: string;
    companyName?: string;
    experience: string;
    skills: string[];
    fieldCategory?: string;
  };
  questions: Question[];
  fieldSpecific: boolean;
  createdAt: string;
  type: string;
}

export default function InterviewStartPage() {
  const router = useRouter();
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadInterviewData = () => {
      try {
        const sessionData = localStorage.getItem('currentInterview');
        const profileData = localStorage.getItem('interviewProfile');
        
        if (!sessionData) {
          setError('No roleplay session found. Please create a roleplay first.');
          setLoading(false);
          return;
        }

        const session = JSON.parse(sessionData);
        const profile = profileData ? JSON.parse(profileData) : session.profile;

        const formattedSession: InterviewSession = {
          profile: profile || {
            jobTitle: session.jobTitle || 'Unknown Position',
            jobDescription: session.jobDescription || '',
            companyName: session.companyName,
            experience: session.experience || 'Not specified',
            skills: session.skills || [],
            fieldCategory: session.fieldCategory
          },
          questions: session.questions || [],
          fieldSpecific: session.fieldSpecific || true,
          createdAt: session.createdAt || new Date().toISOString(),
          type: session.type || 'smart-field-specific'
        };

        setInterviewSession(formattedSession);
      } catch (error) {
        console.error('Failed to parse roleplay session:', error);
        setError('Failed to load roleplay data. Please create a new roleplay.');
      } finally {
        setLoading(false);
      }
    };

    loadInterviewData();
  }, [router]);

  const startInterview = () => {
    if (interviewSession) {
      const interviewState = {
        profile: interviewSession.profile,
        questions: interviewSession.questions,
        startTime: new Date().toISOString(),
        currentQuestionIndex: 0,
        answers: [],
        isActive: true,
        type: interviewSession.type
      };
      
      localStorage.setItem('activeInterview', JSON.stringify(interviewState));
      router.push('/dashboard/interview/active');
    }
  };

  const handleRefreshTopics = () => {
    router.push('/dashboard/interview/create');
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url("/ai2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading roleplay session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url("/ai2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center max-w-md shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard/interview/create')}>
            Create New Roleplay
          </Button>
        </div>
      </div>
    );
  }

  if (!interviewSession) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url("/ai2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center max-w-md shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Roleplay Found</h2>
          <p className="text-gray-600 mb-6">Please create a roleplay first to get started.</p>
          <Button onClick={() => router.push('/dashboard/interview/create')}>
            Create New Roleplay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        backgroundImage: 'url("/ai2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ready to Start Your Roleplay?</h1>
          <p className="text-gray-600 text-lg">
            Your {interviewSession.type.includes('ai') ? 'AI-powered' : 'smart'} roleplay session is prepared and ready to begin.
          </p>
        </div>

        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Session Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Roleplay Details</h2>
            <div className="space-y-6">
              {/* Position Info */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center text-blue-600 mb-3">
                  <FileText className="w-5 h-5 mr-2" />
                  <span className="font-medium">Position</span>
                </div>
                <p className="text-gray-800 text-lg font-medium">{interviewSession.profile.jobTitle}</p>
                {interviewSession.profile.fieldCategory && (
                  <p className="text-blue-600 text-sm mt-1">{interviewSession.profile.fieldCategory}</p>
                )}
              </div>

              {/* Session Info */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center text-green-600 mb-3">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">Session Details</span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <span className="font-semibold">{interviewSession.questions.length}</span> Questions
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold">{interviewSession.profile.experience}</span> Level
                  </p>
                  <p className="text-green-600 text-sm font-medium">
                    {interviewSession.type.replace(/-/g, ' ').toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Skills Preview */}
              {interviewSession.profile.skills.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center text-purple-600 mb-3">
                    <Brain className="w-5 h-5 mr-2" />
                    <span className="font-medium">Key Skills Assessed</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interviewSession.profile.skills.slice(0, 6).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                    {interviewSession.profile.skills.length > 6 && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        +{interviewSession.profile.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Column - Question Preview & Instructions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            {/* Question Types */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Question Types</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {Array.from(new Set(interviewSession.questions.map(q => q.type))).map((type, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-300">
                    <span className="text-gray-700 text-xs font-medium capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sample Question Preview */}
            {interviewSession.questions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-gray-700 text-sm font-medium mb-2">Sample Question:</h4>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-gray-800 text-sm italic mb-3">
                    "{interviewSession.questions[0].question.substring(0, 150)}..."
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs ${
                      interviewSession.questions[0].difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      interviewSession.questions[0].difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {interviewSession.questions[0].difficulty}
                    </span>
                    {interviewSession.questions[0].timeLimit && (
                      <span className="text-blue-600 text-xs font-medium">
                        {Math.floor(interviewSession.questions[0].timeLimit / 60)} min
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Before You Begin */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Before You Begin</h3>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li className="flex items-start">
                  <Target className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Ensure you're in a quiet environment with good lighting</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Check that your camera and microphone are working</span>
                </li>
                <li className="flex items-start">
                  <Users className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Speak clearly and maintain good posture</span>
                </li>
                <li className="flex items-start">
                  <Brain className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Take your time to think before answering each question</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Action Buttons & Additional Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            {/* Action Buttons */}
            <div className="space-y-4 mb-6">
              <Button
                onClick={startInterview}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg transform hover:scale-105 transition-transform"
              >
                <Play className="w-6 h-6 mr-3" />
                Start Roleplay Now
              </Button>
              
              <button
                onClick={handleRefreshTopics}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 border border-gray-300"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Topics
              </button>
            </div>

            {/* Session Statistics */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
              <h4 className="text-gray-700 font-semibold mb-3">Session Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold">{interviewSession.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Duration:</span>
                  <span className="font-semibold">{Math.round(interviewSession.questions.length * 3.5)} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Field-Specific:</span>
                  <span className="font-semibold text-green-600">
                    {interviewSession.fieldSpecific ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Enhanced:</span>
                  <span className="font-semibold text-blue-600">
                    {interviewSession.type.includes('ai') ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200">
              <h4 className="text-cyan-800 font-semibold mb-2">Pro Tips</h4>
              <ul className="text-cyan-700 text-xs space-y-1">
                <li>• Use the STAR method for behavioral questions</li>
                <li>• Provide specific examples from your experience</li>
                <li>• Ask clarifying questions if needed</li>
                <li>• Stay calm and focused throughout</li>
                <li>• Review your answers after completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}