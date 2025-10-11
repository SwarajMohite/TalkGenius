'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  BarChart3, 
  FileText,
  Plus,
  Volume2,
  Download,
  Star,
  Zap,
  Brain,
  GraduationCap,
  MessageCircle,
  UserCheck,
  BookOpen,
  RefreshCw,
  Users,
  Briefcase,
  Play,
  Sparkles,
  Mic,
  Video,
  User,
  ArrowRight,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const Button = ({ children, onClick, className, ...props }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

interface InterviewHistory {
  id: string;
  jobTitle: string;
  date: string;
  totalScore: number;
  questions: any[];
  answers: any[];
  startTime: string;
  endTime: string;
  duration: number;
  type?: string;
  isDynamic?: boolean;
  recordedAudio?: any;
  summary?: {
    strengths: string[];
    improvements: string[];
    overallFeedback: string;
  };
  profile?: {
    jobTitle: string;
    companyName?: string;
    experience: string;
    skills: string[];
  };
  assessmentType?: 'interview' | 'academic-viva' | 'communication-test' | 'knowledge-assessment' | 'confidence-building' | 'general-practice';
  subject?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export default function Dashboard() {
  const router = useRouter();
  const [interviewHistory, setInterviewHistory] = useState<InterviewHistory[]>([]);
  const [stats, setStats] = useState({
    averageScore: 0,
    totalAssessments: 0,
    totalPracticeTime: 0,
    streak: 0,
    improvementAreas: [] as string[],
    bestScore: 0,
    recentTrend: 'stable' as 'improving' | 'declining' | 'stable',
    assessmentTypes: {
      interview: 0,
      academicViva: 0,
      communicationTest: 0,
      knowledgeAssessment: 0,
      confidenceBuilding: 0,
      generalPractice: 0
    },
    todaySessions: 0,
    weeklyProgress: 0
  });
  const [selectedInterview, setSelectedInterview] = useState<InterviewHistory | null>(null);
  const [showInterviewDetails, setShowInterviewDetails] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // FIXED: Single useEffect hook - removed nested useEffect
  useEffect(() => {
    const loadInterviewHistory = () => {
      try {
        const completedInterview = localStorage.getItem('completedInterview');
        const interviewHistory = localStorage.getItem('interviewHistory');
        
        let history: InterviewHistory[] = [];
        
        if (interviewHistory) {
          try {
            const parsedHistory = JSON.parse(interviewHistory);
            // Validate and clean the history data
            history = parsedHistory.filter((assessment: InterviewHistory) => {
              // Ensure each assessment has required fields
              return assessment.id && 
                     assessment.jobTitle && 
                     assessment.date && 
                     assessment.totalScore !== undefined;
            });
          } catch (e) {
            console.error('Error parsing interview history:', e);
            history = [];
          }
        }
        
        // Process new completed interview with validation
        if (completedInterview) {
          try {
            const newInterview: InterviewHistory = JSON.parse(completedInterview);
            
            // FIXED: Validate and complete missing fields
            if (!newInterview.id) {
              newInterview.id = `assessment-${Date.now()}`;
            }
            if (!newInterview.date) {
              newInterview.date = new Date().toISOString();
            }
            if (!newInterview.jobTitle) {
              newInterview.jobTitle = newInterview.profile?.jobTitle || 'Talkgenious AI Assessment';
            }
            if (newInterview.totalScore === undefined || newInterview.totalScore === null) {
              // Calculate score from answers if missing
              if (newInterview.answers && newInterview.answers.length > 0) {
                const validScores = newInterview.answers
                  .filter((answer: any) => answer.score !== undefined && answer.score !== null)
                  .map((answer: any) => answer.score);
                
                if (validScores.length > 0) {
                  const avgScore = validScores.reduce((sum: number, score: number) => sum + score, 0) / validScores.length;
                  newInterview.totalScore = Math.round(avgScore);
                } else {
                  newInterview.totalScore = 0;
                }
              } else {
                newInterview.totalScore = 0;
              }
            }
            if (!newInterview.duration || newInterview.duration === 0) {
              // Calculate duration if missing
              if (newInterview.startTime && newInterview.endTime) {
                const start = new Date(newInterview.startTime).getTime();
                const end = new Date(newInterview.endTime).getTime();
                newInterview.duration = Math.round((end - start) / 1000);
              } else {
                newInterview.duration = 300; // Default 5 minutes
              }
            }
            
            // Add to beginning of history
            history = [newInterview, ...history];
            
            // Save updated history
            localStorage.setItem('interviewHistory', JSON.stringify(history));
            localStorage.removeItem('completedInterview');
            localStorage.removeItem('activeInterview');
            
            console.log('✅ New assessment added to history:', newInterview);
          } catch (e) {
            console.error('Error processing completed interview:', e);
          }
        }
        
        setInterviewHistory(history);
        calculateStatistics(history);
        
      } catch (error) {
        console.error('Error loading interview history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load immediately and set up listeners
    loadInterviewHistory();
    
    const interval = setInterval(loadInterviewHistory, 2000);
    const handleStorageChange = () => loadInterviewHistory();
    const handleInterviewComplete = () => loadInterviewHistory();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('interviewCompleted', handleInterviewComplete);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('interviewCompleted', handleInterviewComplete);
      clearInterval(interval);
    };
  }, [refreshTrigger]); // Only dependency is refreshTrigger

  // FIXED: Enhanced statistics calculation
  const calculateStatistics = (history: InterviewHistory[]) => {
    if (history.length === 0) {
      setStats({
        averageScore: 0,
        totalAssessments: 0,
        totalPracticeTime: 0,
        streak: 0,
        improvementAreas: [],
        bestScore: 0,
        recentTrend: 'stable',
        assessmentTypes: {
          interview: 0,
          academicViva: 0,
          communicationTest: 0,
          knowledgeAssessment: 0,
          confidenceBuilding: 0,
          generalPractice: 0
        },
        todaySessions: 0,
        weeklyProgress: 0
      });
      return;
    }
    
    // FIXED: Filter and validate assessments properly
    const validAssessments = history.filter(assessment => {
      // Ensure assessment has valid score and data
      const hasValidScore = assessment.totalScore !== undefined && 
                           assessment.totalScore !== null && 
                           !isNaN(assessment.totalScore) &&
                           assessment.totalScore >= 0 &&
                           assessment.totalScore <= 100;
      
      const hasValidDuration = assessment.duration !== undefined && 
                             assessment.duration !== null && 
                             !isNaN(assessment.duration);
      
      return hasValidScore && hasValidDuration;
    });
    
    // Calculate statistics only from valid assessments
    const totalScore = validAssessments.reduce((sum, assessment) => sum + assessment.totalScore, 0);
    const averageScore = validAssessments.length > 0 ? Math.round(totalScore / validAssessments.length) : 0;
    
    const bestScore = validAssessments.length > 0 ? 
      Math.max(...validAssessments.map(i => i.totalScore)) : 0;
    
    // FIXED: Calculate total practice time in minutes
    const totalPracticeTimeSeconds = validAssessments.reduce((sum, assessment) => sum + (assessment.duration || 0), 0);
    const totalPracticeTimeMinutes = Math.round(totalPracticeTimeSeconds / 60);
    
    // FIXED: Get improvement areas from the most recent assessment
    const improvementAreas = validAssessments.length > 0 ? 
      (validAssessments[0].summary?.improvements || []) : [];
    
    const streak = calculateStreak(validAssessments);
    const recentTrend = calculateRecentTrend(validAssessments);
    
    // Calculate today's sessions
    const today = new Date().toDateString();
    const todaySessions = validAssessments.filter(assessment => 
      new Date(assessment.date).toDateString() === today
    ).length;

    // Calculate weekly progress
    const weeklyProgress = calculateWeeklyProgress(validAssessments);
    
    // Calculate assessment type distribution
    const assessmentTypes = {
      interview: validAssessments.filter(a => a.assessmentType === 'interview').length,
      academicViva: validAssessments.filter(a => a.assessmentType === 'academic-viva').length,
      communicationTest: validAssessments.filter(a => a.assessmentType === 'communication-test').length,
      knowledgeAssessment: validAssessments.filter(a => a.assessmentType === 'knowledge-assessment').length,
      confidenceBuilding: validAssessments.filter(a => a.assessmentType === 'confidence-building').length,
      generalPractice: validAssessments.filter(a => a.assessmentType === 'general-practice').length
    };
    
    setStats({
      averageScore,
      totalAssessments: validAssessments.length,
      totalPracticeTime: totalPracticeTimeMinutes,
      streak,
      improvementAreas: improvementAreas.slice(0, 3),
      bestScore,
      recentTrend,
      assessmentTypes,
      todaySessions,
      weeklyProgress
    });
  };

  const calculateStreak = (history: InterviewHistory[]): number => {
    if (history.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const assessment of sortedHistory) {
      const assessmentDate = new Date(assessment.date);
      assessmentDate.setHours(0, 0, 0, 0);
      
      const diffTime = currentDate.getTime() - assessmentDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        streak = streak > 0 ? streak : 1;
      } else if (diffDays === streak + 1) {
        streak++;
        currentDate = assessmentDate;
      } else if (diffDays > streak + 1) {
        break;
      }
    }
    
    return streak;
  };

  const calculateRecentTrend = (history: InterviewHistory[]): 'improving' | 'declining' | 'stable' => {
    if (history.length < 2) return 'stable';
    
    const recentScores = history.slice(0, 3).map(i => i.totalScore);
    if (recentScores.length < 2) return 'stable';
    
    if (recentScores.length >= 2) {
      const currentScore = recentScores[0];
      const previousScore = recentScores[1];
      
      if (currentScore > previousScore + 5) return 'improving';
      if (currentScore < previousScore - 5) return 'declining';
    }
    
    return 'stable';
  };

  const calculateWeeklyProgress = (history: InterviewHistory[]): number => {
    if (history.length < 2) return 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekSessions = history.filter(assessment => 
      new Date(assessment.date) >= oneWeekAgo
    ).length;
    
    const lastWeekSessions = history.filter(assessment => {
      const assessmentDate = new Date(assessment.date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return assessmentDate >= twoWeeksAgo && assessmentDate < oneWeekAgo;
    }).length;
    
    if (lastWeekSessions === 0) return thisWeekSessions > 0 ? 100 : 0;
    
    return Math.round(((thisWeekSessions - lastWeekSessions) / lastWeekSessions) * 100);
  };

  const startNewAssessment = () => {
    router.push('/dashboard/interview/create');
  };

  const viewInterviewDetails = (interview: InterviewHistory) => {
    setSelectedInterview(interview);
    setShowInterviewDetails(true);
  };

  const playRecordedAudio = (interview: InterviewHistory) => {
    if (interview.recordedAudio) {
      let audioUrl;
      if (typeof interview.recordedAudio === 'string') {
        audioUrl = interview.recordedAudio;
      } else {
        audioUrl = URL.createObjectURL(interview.recordedAudio);
      }
      
      const audio = new Audio(audioUrl);
      audio.play();
      setPlayingAudio(interview.id);
      
      audio.onended = () => setPlayingAudio(null);
    }
  };

  const downloadInterviewReport = (interview: InterviewHistory) => {
    const report = {
      'Assessment ID': interview.id,
      'Assessment Type': getAssessmentTypeLabel(interview.assessmentType || 'interview'),
      'Subject/Title': interview.jobTitle,
      'Date': new Date(interview.date).toLocaleDateString(),
      'Total Score': `${interview.totalScore}%`,
      'Duration': `${Math.round((interview.duration || 0) / 60)} minutes`,
      'Number of Questions': interview.questions?.length || 0,
      'Questions Answered': interview.answers?.length || 0,
      'Type': interview.type || (interview.isDynamic ? 'Dynamic AI' : 'Standard'),
      'Strengths': interview.summary?.strengths?.join(', ') || 'None identified',
      'Areas for Improvement': interview.summary?.improvements?.join(', ') || 'None identified',
      'Overall Feedback': interview.summary?.overallFeedback || 'No feedback available',
      'Performance Insights': `Scored ${interview.totalScore}% with ${interview.answers?.length || 0} questions answered`
    };
    
    const reportText = Object.entries(report)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getAssessmentTypeLabel(interview.assessmentType || 'interview').toLowerCase().replace(/ /g, '-')}-report-${interview.id.slice(-8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAssessmentTypeLabel = (type: string) => {
    switch (type) {
      case 'academic-viva': return 'Academic Viva';
      case 'communication-test': return 'Communication Test';
      case 'knowledge-assessment': return 'Knowledge Assessment';
      case 'confidence-building': return 'Confidence Building';
      case 'general-practice': return 'General Practice';
      default: return 'Job Interview';
    }
  };

  const getAssessmentTypeIcon = (type: string) => {
    switch (type) {
      case 'academic-viva': return <GraduationCap className="h-4 w-4" />;
      case 'communication-test': return <MessageCircle className="h-4 w-4" />;
      case 'knowledge-assessment': return <BookOpen className="h-4 w-4" />;
      case 'confidence-building': return <UserCheck className="h-4 w-4" />;
      case 'general-practice': return <Users className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const getAssessmentTypeColor = (type: string) => {
    switch (type) {
      case 'academic-viva': return 'bg-purple-100 text-purple-600';
      case 'communication-test': return 'bg-blue-100 text-blue-600';
      case 'knowledge-assessment': return 'bg-green-100 text-green-600';
      case 'confidence-building': return 'bg-orange-100 text-orange-600';
      case 'general-practice': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'declining': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const forceRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const hasActiveInterview = () => {
    const activeInterview = localStorage.getItem('activeInterview');
    return activeInterview !== null;
  };

  const resumeInterview = () => {
    router.push('/dashboard/interview/active');
  };

  if (isLoading) {
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
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundImage: 'url("/ai2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header - TalkGenius Branding */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">TalkGenius</h1>
              <p className="text-lg text-gray-700">AI Roleplay Assessment Platform</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Start & Stats */}
          <div className="space-y-6">
            {/* Quick Start Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h3>
              <button
                onClick={startNewAssessment}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
              >
                <div className="flex items-center justify-center gap-2">
                  <Play className="h-5 w-5" />
                  Start New Assessment
                </div>
              </button>
              
              {hasActiveInterview() && (
                <button
                  onClick={resumeInterview}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5" />
                    Resume Assessment
                  </div>
                </button>
              )}
            </div>

            {/* Performance Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Trophy className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Score</p>
                      <p className="text-xl font-bold text-gray-900">{stats.averageScore}%</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${getTrendColor(stats.recentTrend)}`}>
                    {getTrendIcon(stats.recentTrend)}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Assessments</p>
                      <p className="text-xl font-bold text-gray-900">{stats.totalAssessments}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <Target className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Streak</p>
                      <p className="text-xl font-bold text-gray-900">{stats.streak} days</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Star className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Best Score</p>
                      <p className="text-xl font-bold text-gray-900">{stats.bestScore}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Areas</h3>
              {stats.improvementAreas.length > 0 ? (
                <div className="space-y-3">
                  {stats.improvementAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Award className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-yellow-800 truncate">{area}</span>
                    </div>
                  ))}
                </div>
              ) : stats.totalAssessments > 0 ? (
                <div className="text-center py-4">
                  <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-700">Great job! No major improvement areas.</p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm text-center py-4">Complete assessments to get recommendations</p>
              )}
            </div>
          </div>

          {/* Center Column - Recent Assessments */}
          <div className="space-y-6">
            {/* Recent Assessments */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Assessments</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowDebugInfo(!showDebugInfo)}
                    className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {showDebugInfo ? 'Hide Debug' : 'Show Debug'}
                  </button>
                  <button 
                    onClick={forceRefresh}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {interviewHistory.length > 0 ? (
                <div className="space-y-4">
                  {interviewHistory.slice(0, 5).map((assessment) => (
                    <div 
                      key={assessment.id} 
                      className="flex items-center justify-between p-4 bg-gray-50/80 backdrop-blur-sm rounded-lg hover:bg-gray-100/80 transition-colors cursor-pointer border border-gray-200"
                      onClick={() => viewInterviewDetails(assessment)}
                    >
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          assessment.totalScore >= 80 ? 'bg-green-100 text-green-600' :
                          assessment.totalScore >= 60 ? 'bg-blue-100 text-blue-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {getAssessmentTypeIcon(assessment.assessmentType || 'interview')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate text-sm">{assessment.jobTitle}</h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getAssessmentTypeColor(assessment.assessmentType || 'interview')}`}>
                              {getAssessmentTypeIcon(assessment.assessmentType || 'interview')}
                              {getAssessmentTypeLabel(assessment.assessmentType || 'interview')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {new Date(assessment.date).toLocaleDateString()} • 
                            {assessment.questions?.length || 0} questions • 
                            {Math.round((assessment.duration || 0) / 60)} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <div className={`px-3 py-1 text-sm font-medium rounded-full ${
                          assessment.totalScore >= 80 ? 'bg-green-100 text-green-800' :
                          assessment.totalScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {Math.round(assessment.totalScore)}%
                        </div>
                        {assessment.recordedAudio && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              playRecordedAudio(assessment);
                            }}
                            className="text-gray-600 hover:text-blue-600 transition-colors p-1"
                            title="Play recorded assessment"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-6 text-lg">No assessments yet</p>
                  <button 
                    onClick={startNewAssessment}
                    className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Start Your First Assessment
                  </button>
                </div>
              )}
            </div>

            {/* Debug Information - Improved Design */}
            {showDebugInfo && interviewHistory.length > 0 && (
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-white">Recent Assessment Debug Info</h4>
                  <button 
                    onClick={() => setShowDebugInfo(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Job Title</p>
                    <p className="text-white font-medium truncate">{interviewHistory[0].jobTitle}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Total Score</p>
                    <p className="text-white font-medium">{interviewHistory[0].totalScore}%</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Duration</p>
                    <p className="text-white font-medium">{interviewHistory[0].duration}s</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Questions</p>
                    <p className="text-white font-medium">{interviewHistory[0].questions?.length || 0}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Answers</p>
                    <p className="text-white font-medium">{interviewHistory[0].answers?.length || 0}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Has Profile</p>
                    <p className="text-white font-medium">{interviewHistory[0].profile ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-700/50">
                  <p className="text-blue-300 text-xs mb-2">Assessment ID:</p>
                  <p className="text-blue-100 text-sm font-mono break-all">{interviewHistory[0].id}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Today's Progress & Quick Actions & Assessment Types */}
          <div className="space-y-6">
            {/* Today's Progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Sessions Completed</span>
                    <span>{stats.todaySessions}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(stats.todaySessions * 25, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Weekly Progress</span>
                    <span>{stats.weeklyProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(stats.weeklyProgress, 0)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={startNewAssessment}
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Start New Assessment
                </button>
                {interviewHistory.length > 0 && (
                  <button
                    onClick={() => viewInterviewDetails(interviewHistory[0])}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Latest Results
                  </button>
                )}
                <button className="w-full bg-transparent border border-white text-white py-2 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
                  Download All Reports
                </button>
              </div>
            </div>

            {/* Assessment Types */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Types</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <Briefcase className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-800">Job Interview</p>
                  <p className="text-xs text-blue-600">{stats.assessmentTypes.interview} sessions</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                  <GraduationCap className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-800">Academic Viva</p>
                  <p className="text-xs text-purple-600">{stats.assessmentTypes.academicViva} sessions</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                  <MessageCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">Communication</p>
                  <p className="text-xs text-green-600">{stats.assessmentTypes.communicationTest} sessions</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-center">
                  <UserCheck className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-orange-800">Confidence</p>
                  <p className="text-xs text-orange-600">{stats.assessmentTypes.confidenceBuilding} sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Details Modal */}
      {showInterviewDetails && selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Assessment Details</h3>
                <button 
                  onClick={() => setShowInterviewDetails(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Assessment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Assessment Type</p>
                  <p className="font-semibold text-base">
                    {getAssessmentTypeLabel(selectedInterview.assessmentType || 'interview')}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Score</p>
                  <p className="font-semibold text-base">{selectedInterview.totalScore}%</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Duration</p>
                  <p className="font-semibold text-base">{Math.round((selectedInterview.duration || 0) / 60)} minutes</p>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Performance Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Questions Answered</p>
                    <p className="font-semibold">{selectedInterview.answers?.length || 0}/{selectedInterview.questions?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Completion Rate</p>
                    <p className="font-semibold">
                      {selectedInterview.questions?.length ? 
                        Math.round(((selectedInterview.answers?.length || 0) / selectedInterview.questions.length) * 100) : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Average Answer Score</p>
                    <p className="font-semibold">{selectedInterview.totalScore}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Assessment Type</p>
                    <p className="font-semibold">{selectedInterview.isDynamic ? 'Dynamic AI' : 'Standard'}</p>
                  </div>
                </div>
              </div>

              {/* Questions and Answers */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Questions & Answers</h4>
                <div className="space-y-4">
                  {selectedInterview.questions?.map((question, index) => {
                    const answer = selectedInterview.answers?.[index];
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-gray-900 text-base">Q: {question.question}</p>
                          {answer && (
                            <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2 ${
                              (answer.score || 0) >= 80 ? 'bg-green-100 text-green-800' :
                              (answer.score || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {answer.score}%
                            </span>
                          )}
                        </div>
                        {answer && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">A: {answer.answer}</p>
                            {answer.aiEvaluation && (
                              <div className="mt-2 text-xs text-gray-500">
                                <p><strong>Feedback:</strong> {answer.aiEvaluation.detailedFeedback}</p>
                                {answer.aiEvaluation.strengths && (
                                  <p className="mt-1"><strong>Strengths:</strong> {answer.aiEvaluation.strengths.join(', ')}</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => downloadInterviewReport(selectedInterview)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </button>
                <button 
                  onClick={() => setShowInterviewDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}