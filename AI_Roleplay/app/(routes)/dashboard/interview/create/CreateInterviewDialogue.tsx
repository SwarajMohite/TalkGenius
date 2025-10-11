'use client';

import React, { useState } from 'react';
import { Plus, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Create basic UI components
const Button = ({ children, onClick, disabled, className, ...props }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const Input = ({ placeholder, onChange, className, value, ...props }: any) => (
  <input
    type="text"
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
    {...props}
  />
);

const Textarea = ({ placeholder, onChange, className, value, ...props }: any) => (
  <textarea
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${className || ''}`}
    rows={4}
    {...props}
  />
);

interface InterviewData {
  jobTitle: string;
  jobDescription: string;
  file: File | null;
}

export default function CreateInterviewDialogue() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interviewData, setInterviewData] = useState<InterviewData>({
    jobTitle: '',
    jobDescription: '',
    file: null,
  });

  const handleInputChange = (field: keyof InterviewData, value: string | File) => {
    setInterviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!interviewData.jobTitle || !interviewData.jobDescription || !interviewData.file) {
      setError('Please fill in all fields and upload a resume.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('jobTitle', interviewData.jobTitle);
      formData.append('jobDescription', interviewData.jobDescription);
      formData.append('file', interviewData.file);

      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to generate questions');
      }

      const json = await res.json();

      if (json.questions && json.questions.length > 0) {
        // Create interview session
        const interviewSession = {
          jobTitle: interviewData.jobTitle,
          jobDescription: interviewData.jobDescription,
          questions: json.questions,
          createdAt: new Date().toISOString()
        };

        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentInterview', JSON.stringify(interviewSession));
        }
        
        // Close dialog and navigate
        setOpen(false);
        router.push('/dashboard/interview/start');
      } else {
        throw new Error('No questions were generated');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to generate interview questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setInterviewData({
      jobTitle: '',
      jobDescription: '',
      file: null,
    });
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="w-5 h-5" />
        Create New Interview
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Interview</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Job Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <Input
                placeholder="Ex. Full Stack React Developer"
                value={interviewData.jobTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('jobTitle', e.target.value)
                }
              />
            </div>

            {/* Job Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <Textarea
                placeholder="Enter or paste job description"
                value={interviewData.jobDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  handleInputChange('jobDescription', e.target.value)
                }
                className="min-h-32"
              />
            </div>
            
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Resume
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleInputChange('file', file);
                    }
                  }}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload your resume in PDF format
                  {interviewData.file && (
                    <span className="text-green-600 block">
                      ✓ {interviewData.file.name} selected
                    </span>
                  )}
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                onClick={handleClose}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Interview
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}