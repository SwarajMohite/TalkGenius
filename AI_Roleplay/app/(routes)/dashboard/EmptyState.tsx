"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

// Define the props interface
interface EmptyStateProps {
  onCreateInterview?: () => void;
}

/**
 * A component to display when there are no interviews created yet.
 * It contains a button that navigates to the create interview page.
 */
function EmptyState({ onCreateInterview }: EmptyStateProps) {
  const router = useRouter();

  const handleCreateInterview = () => {
    if (onCreateInterview) {
      onCreateInterview();
    } else {
      // Navigate to the create interview page
      console.log('Navigating to:', '/dashboard/interview/create');
      router.push('/dashboard/interview/create');
    }
  };

  return (
    <div className='mt-14 flex flex-col items-center gap-5 border-dashed border-4 border-gray-300 dark:border-gray-600 p-10 bg-gray-50 dark:bg-gray-800 rounded-lg'>
      {/* Empty state icon and text */}
      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <svg 
          className="w-12 h-12 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </div>
      
      <div className="text-center">
        <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
          No Interviews Yet
        </h2>
        <p className='text-lg text-gray-500 dark:text-gray-400 max-w-md'>
          You haven't created any mock interviews yet. Start practicing with AI-powered interviews tailored to your needs.
        </p>
      </div>

      {/* Button to create new interview */}
      <button
        onClick={handleCreateInterview}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Plus className="w-5 h-5" />
        Create New Interview
      </button>
    </div>
  );
}

export default EmptyState;