'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  Brain,
  Zap,
  Settings,
  Plus,
  X,
  Search,
  BookOpen,
  GraduationCap,
  MessageCircle,
  UserCheck,
  Users,
  Briefcase,
  Code,
  Target,
  Lightbulb,
  Mic
} from 'lucide-react';

// Define interfaces
interface IFormInput {
  title: string;
  description: string;
  organization?: string;
  experience: string;
  skills: string[];
  resumeFile?: File;
  assessmentType: string;
  subject?: string;
  domain?: string;
  focusArea?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
}

interface GeneratedQuestion {
  id: string;
  question: string;
  type: "technical" | "theoretical" | "behavioral" | "situational" | 
        "domain-specific" | "practical" | "conceptual" |
        "methodological" | "reflective" | "conversational" | "critical";
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number;
  fieldRelevant: boolean;
}

// Tab configuration
const interviewTabs = [
  {
    id: 'technical',
    name: 'Technical Interview',
    description: 'Coding, algorithms, system design and technical problem-solving',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    category: 'professional'
  },
  {
    id: 'academic-viva',
    name: 'Academic Viva',
    description: 'Thesis defense, subject knowledge and research methodology',
    icon: GraduationCap,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500',
    category: 'academic'
  },
  {
    id: 'communication-test',
    name: 'Communication Test',
    description: 'Public speaking, presentation skills and verbal communication',
    icon: MessageCircle,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-gradient-to-br from-green-500 to-emerald-500',
    category: 'communication'
  },
  {
    id: 'behavioral',
    name: 'Behavioral Interview',
    description: 'Situational judgment, teamwork and interpersonal skills',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-gradient-to-br from-orange-500 to-red-500',
    category: 'professional'
  },
  {
    id: 'domain-specific',
    name: 'Domain Specific',
    description: 'Specialized questions for specific industries and fields',
    icon: Target,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-gradient-to-br from-indigo-500 to-purple-500',
    category: 'professional'
  },
  {
    id: 'conceptual',
    name: 'Conceptual Understanding',
    description: 'Deep conceptual knowledge and critical thinking assessment',
    icon: Lightbulb,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-gradient-to-br from-yellow-500 to-amber-500',
    category: 'academic'
  },
  {
    id: 'confidence-building',
    name: 'Confidence Building',
    description: 'Build confidence through structured speaking practice',
    icon: UserCheck,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-gradient-to-br from-pink-500 to-rose-500',
    category: 'personal'
  },
  {
    id: 'general-practice',
    name: 'General Practice',
    description: 'Everyday communication and casual conversation practice',
    icon: Mic,
    color: 'from-gray-500 to-blue-500',
    bgColor: 'bg-gradient-to-br from-gray-500 to-blue-500',
    category: 'communication'
  }
];

const InterviewCreatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get assessment type from URL parameters or default to technical
  const initialTab = searchParams?.get('type') || 'technical';
  const initialCategory = searchParams?.get('category') || 'professional';
  
  // State management
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [newSkill, setNewSkill] = useState('');
  const [detectedField, setDetectedField] = useState<string>('');
  const [searchSkill, setSearchSkill] = useState('');

  // Form data state
  const [formData, setFormData] = useState<IFormInput>({
    title: '',
    description: '',
    organization: '',
    experience: '2-5 years',
    skills: [],
    resumeFile: undefined,
    assessmentType: activeTab,
    subject: '',
    domain: '',
    focusArea: '',
    difficulty: 'medium',
    numberOfQuestions: 8
  });

  // Form validation
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Get current tab info
  const currentTab = interviewTabs.find(tab => tab.id === activeTab) || interviewTabs[0];

  // Update form when tab changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      assessmentType: activeTab,
      title: '',
      description: '',
      subject: '',
      domain: '',
      focusArea: '',
      skills: []
    }));

    // Set default values based on assessment type
    const defaultValues: Record<string, Partial<IFormInput>> = {
      'technical': {
        title: 'Software Engineer Position',
        description: 'Technical interview covering algorithms, data structures, and system design',
        experience: '2-5 years'
      },
      'academic-viva': {
        title: 'Thesis Defense Preparation',
        description: 'Comprehensive viva covering research methodology, findings, and subject knowledge',
        experience: '5-8 years'
      },
      'communication-test': {
        title: 'Public Speaking Assessment',
        description: 'Evaluation of communication skills, presentation abilities, and verbal clarity',
        experience: '0-2 years'
      },
      'behavioral': {
        title: 'Behavioral Competency Assessment',
        description: 'Situational questions testing teamwork, leadership, and problem-solving approach',
        experience: '2-5 years'
      },
      'domain-specific': {
        title: 'Domain Expert Interview',
        description: 'Specialized questions for specific industry knowledge and expertise',
        experience: '5-8 years'
      },
      'conceptual': {
        title: 'Conceptual Understanding Test',
        description: 'Assessment of deep conceptual knowledge and critical thinking abilities',
        experience: '2-5 years'
      },
      'confidence-building': {
        title: 'Confidence Building Session',
        description: 'Structured practice to build speaking confidence and communication skills',
        experience: '0-2 years'
      },
      'general-practice': {
        title: 'General Communication Practice',
        description: 'Casual conversation practice for everyday communication situations',
        experience: '0-2 years'
      }
    };

    if (defaultValues[activeTab]) {
      setFormData(prev => ({
        ...prev,
        ...defaultValues[activeTab]
      }));
    }

    // Auto-detect field
    const field = detectField(activeTab, '');
    setDetectedField(field);
  }, [activeTab]);

  // Detect field based on tab and input
  const detectField = (tab: string, title: string): string => {
    const fieldMap: Record<string, string> = {
      'technical': 'Technology & Engineering',
      'academic-viva': 'Education & Academia',
      'communication-test': 'Communication & Public Speaking',
      'behavioral': 'Professional & Interpersonal Skills',
      'domain-specific': 'Specialized Industry Knowledge',
      'conceptual': 'Conceptual & Critical Thinking',
      'confidence-building': 'Personal Development',
      'general-practice': 'General Communication'
    };
    
    return fieldMap[tab] || 'Professional Assessment';
  };

  // Get field-specific skills for current tab
  const getFieldSpecificSkills = (): string[] => {
    const skillSets: Record<string, string[]> = {
      'technical': [
        'Algorithms', 'Data Structures', 'System Design', 'Database Management',
        'API Development', 'Testing', 'Debugging', 'Performance Optimization',
        'Security', 'Cloud Computing', 'DevOps', 'Mobile Development'
      ],
      'academic-viva': [
        'Research Methodology', 'Literature Review', 'Data Analysis', 'Thesis Writing',
        'Academic Writing', 'Critical Thinking', 'Presentation Skills', 'Statistical Analysis',
        'Experimental Design', 'Peer Review', 'Academic Ethics', 'Publication Process'
      ],
      'communication-test': [
        'Public Speaking', 'Active Listening', 'Presentation Skills', 'Body Language',
        'Voice Modulation', 'Audience Engagement', 'Storytelling', 'Persuasion',
        'Clarity of Expression', 'Confidence', 'Vocabulary', 'Non-verbal Communication'
      ],
      'behavioral': [
        'Teamwork', 'Leadership', 'Conflict Resolution', 'Problem Solving',
        'Adaptability', 'Time Management', 'Decision Making', 'Emotional Intelligence',
        'Stress Management', 'Collaboration', 'Initiative', 'Accountability'
      ],
      'domain-specific': [
        'Industry Knowledge', 'Regulatory Compliance', 'Market Trends', 'Technical Expertise',
        'Best Practices', 'Risk Management', 'Quality Assurance', 'Stakeholder Management',
        'Strategic Planning', 'Innovation', 'Competitive Analysis', 'Customer Insight'
      ],
      'conceptual': [
        'Critical Thinking', 'Analytical Reasoning', 'Problem Decomposition', 'Pattern Recognition',
        'Abstract Thinking', 'Logical Reasoning', 'Systems Thinking', 'Conceptual Modeling',
        'Hypothesis Testing', 'Evidence Evaluation', 'Theoretical Understanding', 'Knowledge Synthesis'
      ],
      'confidence-building': [
        'Self-Confidence', 'Positive Thinking', 'Stress Management', 'Mindfulness',
        'Self-Awareness', 'Assertiveness', 'Emotional Intelligence', 'Resilience',
        'Growth Mindset', 'Self-Esteem', 'Communication', 'Body Language'
      ],
      'general-practice': [
        'Everyday Communication', 'Conversation Skills', 'Social Interactions', 'Active Listening',
        'Small Talk', 'Cultural Awareness', 'Empathy', 'Friendliness',
        'Clarity', 'Patience', 'Adaptability', 'Open-mindedness'
      ]
    };

    return skillSets[activeTab] || skillSets.technical;
  };

  // Filter skills based on search
  const filteredSkills = getFieldSpecificSkills().filter(skill =>
    skill.toLowerCase().includes(searchSkill.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (field: keyof IFormInput, value: string | string[] | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Auto-detect field when title changes
    if (field === 'title' && typeof value === 'string') {
      const field = detectField(activeTab, value);
      setDetectedField(field);
    }
  };

  // Add skill to the list
  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      handleInputChange('skills', [...formData.skills, skill]);
    }
  };

  // Add custom skill
  const addCustomSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  // Remove skill from the list
  const removeSkill = (skillToRemove: string) => {
    handleInputChange('skills', formData.skills.filter(skill => skill !== skillToRemove));
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only.');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB.');
        return;
      }

      setUploadedFile(file);
      setError(null);
      setResumeText(`Resume uploaded: ${file.name} (${Math.round(file.size / 1024)}KB)`);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 30) {
      errors.description = 'Description should be at least 30 characters';
    }
    
    if (formData.skills.length === 0) {
      errors.skills = 'Please add at least one relevant skill';
    }

    // Additional validation for specific tabs
    if (activeTab === 'academic-viva' && !formData.subject) {
      errors.subject = 'Subject/Field is required for academic viva';
    }

    if (activeTab === 'domain-specific' && !formData.domain) {
      errors.domain = 'Domain/Industry is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate questions using AI API
  const generateQuestionsWithAI = async (): Promise<GeneratedQuestion[]> => {
    const requestBody = {
      ...formData,
      resumeText: resumeText,
      fieldCategory: detectedField,
      generateFieldSpecific: true
    };

    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('AI service unavailable - using intelligent field-specific question generation.');
    }

    const result = await response.json();
    return result.questions || [];
  };

  // Generate field-specific smart questions based on tab
  const generateUniversalSmartQuestions = (): GeneratedQuestion[] => {
    const { title, description, skills, experience, subject, domain, focusArea, difficulty } = formData;
    const questionBank: GeneratedQuestion[] = [];

    // Generate questions based on active tab
    switch (activeTab) {
      case 'technical':
        questionBank.push(
          {
            id: 'tech-1',
            question: `Explain the time and space complexity of a binary search algorithm and implement it in your preferred programming language.`,
            type: 'technical',
            difficulty: difficulty,
            category: 'Algorithms & Complexity',
            timeLimit: 180,
            fieldRelevant: true
          },
          {
            id: 'tech-2',
            question: `Describe the differences between SQL and NoSQL databases. When would you choose one over the other for a project?`,
            type: 'technical',
            difficulty: difficulty,
            category: 'Database Systems',
            timeLimit: 150,
            fieldRelevant: true
          },
          {
            id: 'tech-3',
            question: `How would you design a scalable web application that can handle millions of users? Discuss architecture, databases, and caching strategies.`,
            type: 'technical',
            difficulty: 'hard',
            category: 'System Design',
            timeLimit: 300,
            fieldRelevant: true
          }
        );
        break;

      case 'academic-viva':
        questionBank.push(
          {
            id: 'academic-1',
            question: `Introduce your research topic in ${subject || 'your field'} and explain its significance and contribution to the academic community.`,
            type: 'theoretical',
            difficulty: difficulty,
            category: 'Research Significance',
            timeLimit: 180,
            fieldRelevant: true
          },
          {
            id: 'academic-2',
            question: `What research methodology did you employ and why was this approach most suitable for your study compared to alternatives?`,
            type: 'methodological',
            difficulty: difficulty,
            category: 'Research Methodology',
            timeLimit: 240,
            fieldRelevant: true
          },
          {
            id: 'academic-3',
            question: `Discuss the limitations of your research and how they might affect the validity and generalizability of your findings.`,
            type: 'critical',
            difficulty: 'hard',
            category: 'Critical Analysis',
            timeLimit: 200,
            fieldRelevant: true
          }
        );
        break;

      case 'communication-test':
        questionBank.push(
          {
            id: 'comm-1',
            question: `Describe a complex technical concept from your field to someone with no background knowledge. Focus on clarity and simplicity.`,
            type: 'practical',
            difficulty: difficulty,
            category: 'Explanation Skills',
            timeLimit: 180,
            fieldRelevant: true
          },
          {
            id: 'comm-2',
            question: `How would you handle a situation where your audience seems disengaged or confused during an important presentation?`,
            type: 'situational',
            difficulty: difficulty,
            category: 'Audience Engagement',
            timeLimit: 150,
            fieldRelevant: true
          }
        );
        break;

      case 'behavioral':
        questionBank.push(
          {
            id: 'behavioral-1',
            question: `Describe a time when you had to work with a difficult team member. How did you handle the situation and what was the outcome?`,
            type: 'behavioral',
            difficulty: difficulty,
            category: 'Teamwork & Conflict',
            timeLimit: 180,
            fieldRelevant: true
          },
          {
            id: 'behavioral-2',
            question: `Tell me about a situation where you had to make an important decision with incomplete information. What was your process?`,
            type: 'situational',
            difficulty: difficulty,
            category: 'Decision Making',
            timeLimit: 160,
            fieldRelevant: true
          }
        );
        break;

      case 'domain-specific':
        questionBank.push(
          {
            id: 'domain-1',
            question: `What are the current major trends and challenges in the ${domain || 'your industry'} domain, and how are they impacting business strategies?`,
            type: 'domain-specific',
            difficulty: difficulty,
            category: 'Industry Knowledge',
            timeLimit: 200,
            fieldRelevant: true
          },
          {
            id: 'domain-2',
            question: `Describe a complex problem specific to ${domain || 'your field'} and how you would approach solving it.`,
            type: 'domain-specific',
            difficulty: 'hard',
            category: 'Problem Solving',
            timeLimit: 220,
            fieldRelevant: true
          }
        );
        break;

      case 'conceptual':
        questionBank.push(
          {
            id: 'conceptual-1',
            question: `Explain the fundamental concepts behind ${focusArea || 'your area of expertise'} as if you were teaching it to a beginner.`,
            type: 'conceptual',
            difficulty: difficulty,
            category: 'Fundamental Concepts',
            timeLimit: 180,
            fieldRelevant: true
          },
          {
            id: 'conceptual-2',
            question: `What are the key assumptions and limitations of the main theories in ${focusArea || 'your field'}?`,
            type: 'critical',
            difficulty: 'hard',
            category: 'Theoretical Analysis',
            timeLimit: 200,
            fieldRelevant: true
          }
        );
        break;

      case 'confidence-building':
        questionBank.push(
          {
            id: 'confidence-1',
            question: `Tell me about a time when you successfully overcame a challenging situation. What did you learn about yourself?`,
            type: 'behavioral',
            difficulty: 'easy',
            category: 'Self-Reflection',
            timeLimit: 180,
            fieldRelevant: true
          },
          {
            id: 'confidence-2',
            question: `Describe your strengths and how they help you in challenging situations.`,
            type: 'reflective',
            difficulty: 'medium',
            category: 'Self-Awareness',
            timeLimit: 160,
            fieldRelevant: true
          }
        );
        break;

      case 'general-practice':
        questionBank.push(
          {
            id: 'general-1',
            question: `Tell me about yourself and your interests outside of work/studies.`,
            type: 'behavioral',
            difficulty: 'easy',
            category: 'Personal Introduction',
            timeLimit: 120,
            fieldRelevant: true
          },
          {
            id: 'general-2',
            question: `Describe a recent book, movie, or news event that interested you and explain why it caught your attention.`,
            type: 'conversational',
            difficulty: 'easy',
            category: 'General Knowledge',
            timeLimit: 150,
            fieldRelevant: true
          }
        );
        break;
    }

    // Add more questions to reach the desired count
    while (questionBank.length < formData.numberOfQuestions) {
      questionBank.push({
        id: `auto-${questionBank.length + 1}`,
        question: `Additional ${currentTab.name.toLowerCase()} question about ${skills[questionBank.length % skills.length] || 'relevant topic'}.`,
        type: 'conceptual',
        difficulty: difficulty,
        category: 'Additional Questions',
        timeLimit: 120,
        fieldRelevant: true
      });
    }

    return questionBank.slice(0, formData.numberOfQuestions);
  };


  // Main form submission handler
  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please complete all required fields and fix any errors.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      let questions: GeneratedQuestion[] = [];

      if (useAI) {
        try {
          questions = await generateQuestionsWithAI();
        } catch (aiError: any) {
          console.warn('AI generation failed, using intelligent field-specific fallback:', aiError.message);
          setSuccess('AI service unavailable - using intelligent field-specific question generation.');
          questions = generateUniversalSmartQuestions();
        }
      } else {
        questions = generateUniversalSmartQuestions();
      }

      if (questions.length === 0) {
        throw new Error('No questions were generated. Please check your inputs and try again.');
      }

      // Create interview profile
      const interviewProfile = {
        title: formData.title,
        description: formData.description,
        organization: formData.organization || 'Organization',
        experience: formData.experience,
        skills: formData.skills,
        fieldCategory: detectedField,
        resumeUploaded: !!uploadedFile,
        createdAt: new Date().toISOString(),
        assessmentType: activeTab,
        subject: formData.subject,
        domain: formData.domain,
        focusArea: formData.focusArea,
        difficulty: formData.difficulty
      };

      // Create interview session
      const interviewSession = {
        profile: interviewProfile,
        questions: questions,
        fieldSpecific: true,
        createdAt: new Date().toISOString(),
        type: useAI ? 'ai-field-adaptive' : 'smart-field-specific',
        assessmentType: activeTab
      };

      // Save to localStorage
      localStorage.setItem('interviewProfile', JSON.stringify(interviewProfile));
      localStorage.setItem('currentInterview', JSON.stringify(interviewSession));
      
      // Clear any old active interview
      localStorage.removeItem('activeInterview');

      const fieldSpecificCount = questions.filter(q => q.fieldRelevant).length;
      const successMessage = `Successfully generated ${questions.length} ${currentTab.name.toLowerCase()} questions! ${fieldSpecificCount} field-specific questions included.`;
      
      setSuccess(successMessage);
      
      // Navigate to start page
      setTimeout(() => {
        router.push('/dashboard/interview/start');
      }, 2000);

    } catch (error: any) {
      console.error('Error generating questions:', error);
      setError(error.message || 'Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Get field-specific skills for current tab
  const availableSkills = getFieldSpecificSkills();

  // Get tab-specific field labels and placeholders
  const getFieldConfig = () => {
    const config: Record<string, { label: string; placeholder: string }> = {
      title: {
        label: activeTab === 'academic-viva' ? 'Research Topic / Thesis Title' : 
               activeTab === 'communication-test' ? 'Communication Focus Area' :
               activeTab === 'confidence-building' ? 'Session Focus' :
               activeTab === 'general-practice' ? 'Practice Area' : 
               `${currentTab.name} Title`,
        placeholder: activeTab === 'academic-viva' ? "e.g., Machine Learning Algorithms for Healthcare" :
                    activeTab === 'communication-test' ? "e.g., Public Speaking, Business Communication" :
                    activeTab === 'confidence-building' ? "e.g., Interview Confidence, Social Situations" :
                    activeTab === 'general-practice' ? "e.g., Casual Conversations, Professional Meetings" :
                    `e.g., ${currentTab.name} Preparation`
      },
      description: {
        label: activeTab === 'academic-viva' ? 'Research Description / Abstract' :
               activeTab === 'communication-test' ? 'Communication Goals & Context' :
               activeTab === 'confidence-building' ? 'Development Goals & Context' :
               activeTab === 'general-practice' ? 'Practice Context & Goals' : 
               `${currentTab.name} Description`,
        placeholder: activeTab === 'academic-viva' ? "Describe your research topic, methodology, key findings, and significance..." :
                    activeTab === 'communication-test' ? "Describe your communication goals, specific situations you want to practice..." :
                    activeTab === 'confidence-building' ? "Describe situations where you want to build confidence, specific challenges..." :
                    activeTab === 'general-practice' ? "Describe the types of conversations you want to practice, specific situations..." :
                    `Describe the ${currentTab.name.toLowerCase()} context, goals, and requirements...`
      }
    };
    return config;
  };

  const fieldConfig = getFieldConfig();

  return (
    <div 
      className="min-h-screen text-gray-800 p-6"
      style={{
        backgroundImage: 'url("/ai2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center px-4 py-2 bg-white/80 hover:bg-white rounded-lg transition-colors backdrop-blur-sm border border-gray-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
              <Settings className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Mode:</span>
              <button
                onClick={() => setUseAI(!useAI)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  useAI 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {useAI ? 'AI Enhanced' : 'Smart Mode'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Tab Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Assessment Types</h2>
              <div className="space-y-3">
                {interviewTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center p-4 rounded-xl text-left transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 border-2 border-blue-200 shadow-md scale-105'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:scale-102'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${tab.bgColor} flex items-center justify-center mr-3 shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${
                          activeTab === tab.id ? 'text-blue-800' : 'text-gray-700'
                        }`}>
                          {tab.name}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">{tab.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Assessment Type Info - Moved here below the tabs */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-center text-lg font-semibold mb-6 text-gray-800">
                  Assessment Type Features
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Field-Adaptive Questions</h4>
                      <p className="text-xs text-blue-600">
                        Questions tailored to your specific field, level, and assessment type
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Zap className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Smart Difficulty Adjustment</h4>
                      <p className="text-xs text-green-600">
                        Questions adapt to your experience level and progress during assessment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-purple-800">Real-time AI Feedback</h4>
                      <p className="text-xs text-purple-600">
                        Get instant feedback on responses and improvement suggestions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-200">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className={`p-4 ${currentTab.bgColor} rounded-2xl shadow-lg`}>
                    <currentTab.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {currentTab.name}
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  {currentTab.description}
                </p>
                {detectedField && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200 backdrop-blur-sm">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">Assessment Field: {detectedField}</span>
                  </div>
                )}
              </div>

              {/* Status Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">{success}</p>
                    <p className="text-xs text-green-600 mt-1">Redirecting to assessment start page...</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Tab Specific Fields */}
                {(activeTab === 'academic-viva' || activeTab === 'domain-specific' || activeTab === 'conceptual') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTab === 'academic-viva' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject / Field of Study <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm placeholder-gray-400 transition-all duration-300"
                          placeholder="e.g., Computer Science, Physics, Literature, Medicine"
                          disabled={isGenerating}
                        />
                        {formErrors.subject && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.subject}</p>
                        )}
                      </div>
                    )}
                    
                    {activeTab === 'domain-specific' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Domain / Industry <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.domain}
                          onChange={(e) => handleInputChange('domain', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm placeholder-gray-400 transition-all duration-300"
                          placeholder="e.g., Healthcare, Finance, Education, Technology"
                          disabled={isGenerating}
                        />
                        {formErrors.domain && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.domain}</p>
                        )}
                      </div>
                    )}

                    {activeTab === 'conceptual' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Focus Area <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.focusArea}
                          onChange={(e) => handleInputChange('focusArea', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm placeholder-gray-400 transition-all duration-300"
                          placeholder="e.g., Machine Learning, Philosophy, Economics"
                          disabled={isGenerating}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                        disabled={isGenerating}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {fieldConfig.title.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm placeholder-gray-400 transition-all duration-300"
                    placeholder={fieldConfig.title.placeholder}
                    disabled={isGenerating}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>

                {/* Organization Name - For professional tabs */}
                {(activeTab === 'technical' || activeTab === 'behavioral' || activeTab === 'domain-specific') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization / Company Name <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm placeholder-gray-400 transition-all duration-300"
                      placeholder="e.g., Google, Microsoft, Government Organization"
                      disabled={isGenerating}
                    />
                  </div>
                )}

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'academic-viva' ? 'Academic Level' : 'Experience Level'} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    disabled={isGenerating}
                  >
                    {activeTab === 'academic-viva' ? (
                      <>
                        <option value="0-2 years">Undergraduate Level</option>
                        <option value="2-5 years">Masters Level</option>
                        <option value="5-8 years">PhD Candidate</option>
                        <option value="8+ years">Postdoctoral Researcher</option>
                      </>
                    ) : (
                      <>
                        <option value="0-2 years">0-2 years (Beginner)</option>
                        <option value="2-5 years">2-5 years (Intermediate)</option>
                        <option value="5-8 years">5-8 years (Advanced)</option>
                        <option value="8+ years">8+ years (Expert)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.numberOfQuestions}
                    onChange={(e) => handleInputChange('numberOfQuestions', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    disabled={isGenerating}
                  >
                    <option value={5}>5 Questions</option>
                    <option value={8}>8 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={12}>12 Questions</option>
                  </select>
                </div>

                {/* Field-Specific Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'academic-viva' ? 'Research Competencies & Skills' :
                     activeTab === 'communication-test' ? 'Communication Skills Focus' :
                     activeTab === 'confidence-building' ? 'Personal Development Areas' :
                     activeTab === 'general-practice' ? 'Communication Skills' : 
                     'Required Skills & Competencies'} <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Search Skills */}
                  <div className="mb-4 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchSkill}
                      onChange={(e) => setSearchSkill(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm placeholder-gray-400 transition-all duration-300"
                      placeholder="Search skills..."
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 max-h-48 overflow-y-auto p-2">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        disabled={formData.skills.includes(skill) || isGenerating}
                        className={`p-3 text-sm rounded-xl border transition-all duration-300 ${
                          formData.skills.includes(skill)
                            ? 'bg-blue-100 border-blue-300 text-blue-800 shadow-md scale-105'
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-102 hover:border-blue-300'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>

                  {/* Custom skill input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm placeholder-gray-400 transition-all duration-300"
                      placeholder="Add custom skill or competency..."
                      disabled={isGenerating}
                    />
                    <button
                      type="button"
                      onClick={addCustomSkill}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl text-white"
                      disabled={isGenerating}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  {/* Selected skills display */}
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <span className="text-sm text-blue-700 font-medium mr-2">Selected Skills:</span>
                      {formData.skills.map((skill) => (
                        <div
                          key={skill}
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300 rounded-full text-sm backdrop-blur-sm"
                        >
                          <span className="text-blue-800">{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            disabled={isGenerating}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formErrors.skills && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.skills}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {fieldConfig.description.label} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm placeholder-gray-400 transition-all duration-300"
                    placeholder={fieldConfig.description.placeholder}
                    disabled={isGenerating}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formData.description.length} characters</span>
                    <span>Minimum 30 characters required</span>
                  </div>
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>

                {/* File Upload - Optional for all types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'academic-viva' ? 'Research Paper / CV Upload' :
                     activeTab === 'communication-test' ? 'Communication Materials (Optional)' :
                     activeTab === 'confidence-building' ? 'Background Information (Optional)' :
                     activeTab === 'general-practice' ? 'Background Information (Optional)' : 
                     'Resume / CV Upload'} <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="resumeFile"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                        uploadedFile
                          ? 'border-green-400 bg-green-50 shadow-md'
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'
                      } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadedFile ? (
                          <>
                            <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
                            <p className="text-sm text-green-700 font-medium">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-green-600">
                              {Math.round(uploadedFile.size / 1024)}KB uploaded successfully
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-600">
                              <span className="font-semibold">Click to upload</span> your {activeTab === 'academic-viva' ? 'research paper or CV' : 'file'}
                            </p>
                            <p className="text-xs text-gray-500">PDF format only, max 5MB</p>
                          </>
                        )}
                      </div>
                      <input
                        id="resumeFile"
                        type="file"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        disabled={isGenerating}
                      />
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isGenerating}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                    isGenerating
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : `${currentTab.bgColor} hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl text-white`
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>
                        Generating {currentTab.name} Questions...
                      </span>
                    </>
                  ) : (
                    <>
                      {useAI ? <Brain className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                      <span>Generate {currentTab.name}</span>
                      <Sparkles className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCreatePage;