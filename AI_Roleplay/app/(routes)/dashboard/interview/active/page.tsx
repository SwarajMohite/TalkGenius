// Add this at the top of your file if using older Node.js versions
'use client';
if (!AbortSignal.timeout) {
  AbortSignal.timeout = function(ms) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new Error('Timeout')), ms);
    return controller.signal;
  };
}

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, 
  MicOff, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Brain,
  AlertCircle,
  Play,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ArrowLeft,
  Save,
  Pause,
  StopCircle,
  Zap,
  User,
  Briefcase,
  Award,
  Star,
  Maximize2,
  Minimize2,
  Square,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';

// Add type declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Enhanced Types for Real Analysis
interface GestureAnalysis {
  eyeContact: number;
  posture: number;
  headMovement: number;
  smiling: number;
  attention: number;
  gestures: number;
}

interface VoiceAnalysis {
  volume: number;
  clarity: number;
  pace: number;
  tone: number;
  fillerWords: number;
  pauses: number;
  confidence: number;
}

interface BehavioralAnalysis {
  score: number;
  eyeContact: number;
  posture: number;
  gestures: number;
  facialExpressions: number;
  confidenceLevel: number;
  engagement: number;
  professionalism: number;
  analysis: {
    gazeDirection: number[];
    headPose: number[];
    smileIntensity: number;
    gestureFrequency: number;
  };
}

interface ComprehensiveFeedback {
  contentScore: number;
  behavioralScore: number;
  voiceScore: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  contentAnalysis: {
    relevance: number;
    structure: number;
    examples: number;
    depth: number;
  };
  behavioralAnalysis: BehavioralAnalysis;
  voiceAnalysis: VoiceAnalysis;
  specificSuggestions: {
    content: string[];
    delivery: string[];
    behavior: string[];
  };
}

interface Question {
  id: string;
  question: string;
  type: 'introduction' | 'technical' | 'behavioral' | 'situational' | 'problem-solving' | 'domain-specific' | 'follow-up' | 'probing' | 'skill-assessment';
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  fieldRelevant?: boolean;
  reasoning?: string;
  followsUp?: boolean;
  skillFocus?: string[];
  followUpCount?: number;
  isFollowUp?: boolean;
  parentQuestionId?: string;
}

interface Answer {
  questionId: string;
  answer: string;
  timestamp: string;
  score?: number;
  audioBlob?: Blob;
  aiEvaluation?: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    skillAssessment: { [key: string]: number };
    detailedFeedback: string;
    confidenceLevel: number;
    behavioralAnalysis?: BehavioralAnalysis;
    voiceAnalysis?: VoiceAnalysis;
    comprehensiveFeedback?: ComprehensiveFeedback;
    interviewerResponse: string;
    correctedAnswer: string;
    expectedAnswer: string;
    followUpQuestion?: string;
    contentScore?: number;
    behavioralScore?: number;
    voiceScore?: number;
  };
}

interface InterviewProfile {
  jobTitle: string;
  jobDescription: string;
  companyName?: string;
  experience: string;
  skills: string[];
  fieldCategory?: string;
  userName?: string;
  assessmentType?: string;
  subject?: string;
  domain?: string;
}

interface InterviewState {
  performanceScore: number;
  skillProficiency: { [key: string]: number };
  difficultyLevel: 'easy' | 'medium' | 'hard';
  answeredQuestions: number;
  conversationContext: string[];
  weakAreas: string[];
  strongAreas: string[];
  adaptiveInsights: string[];
  interviewStage: 'introduction' | 'skill-assessment' | 'technical-evaluation' | 'behavioral-assessment' | 'closing';
  userName?: string;
  currentFollowUpCount: number;
  currentMainQuestionId?: string;
  currentQuestionHasFollowUps?: boolean;
}

interface ActiveInterview {
  profile: InterviewProfile;
  questions: Question[];
  startTime: string;
  currentQuestionIndex: number;
  answers: Answer[];
  isActive: boolean;
  type: string;
  isDynamic?: boolean;
}

// Fixed RealTimeAnalyzer Class with better accuracy
class RealTimeAnalyzer {
  private isInitialized = false;
  private analysisInterval: NodeJS.Timeout | null = null;
  private gestureData: GestureAnalysis = {
    eyeContact: 0,
    posture: 0,
    headMovement: 0,
    smiling: 0,
    attention: 0,
    gestures: 0
  };
  private voiceData: VoiceAnalysis = {
    volume: 0,
    clarity: 0,
    pace: 150,
    tone: 0,
    fillerWords: 0,
    pauses: 0,
    confidence: 0
  };
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private speechStartTime: number = 0;
  private wordCount: number = 0;
  private isAudioContextClosed = false;
  private hasUserSpoken: boolean = false;

  async initialize() {
    try {
      if (!this.audioContext || this.isAudioContextClosed) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.isAudioContextClosed = false;
      }
      this.isInitialized = true;
      console.log('Real-time analyzer initialized');
    } catch (error) {
      console.error('Error initializing analyzer:', error);
      this.isInitialized = false;
    }
  }

  // Enhanced video analysis with better accuracy
  async analyzeVideoFrame(videoElement: HTMLVideoElement): Promise<GestureAnalysis> {
    if (!this.isInitialized) {
      return this.getFallbackGestureAnalysis();
    }

    try {
      if (!videoElement.videoWidth || !videoElement.videoHeight || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        return this.getFallbackGestureAnalysis();
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return this.getFallbackGestureAnalysis();

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      if (canvas.width === 0 || canvas.height === 0) {
        return this.getFallbackGestureAnalysis();
      }

      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const analysis = this.analyzeFrameData(imageData, canvas.width, canvas.height);
      
      this.gestureData = analysis;
      return analysis;

    } catch (error) {
      console.error('Video analysis error:', error);
      return this.getFallbackGestureAnalysis();
    }
  }

  private analyzeFrameData(imageData: ImageData, width: number, height: number): GestureAnalysis {
    if (!imageData || !imageData.data || imageData.data.length === 0) {
      return this.getFallbackGestureAnalysis();
    }

    const data = imageData.data;
    let faceCenterX = 0, faceCenterY = 0;
    let facePixels = 0;
    
    // More accurate face detection
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (this.isSkinTone(r, g, b)) {
        const pixelIndex = i / 4;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        
        faceCenterX += x;
        faceCenterY += y;
        facePixels++;
      }
    }
    
    if (facePixels > 20) { // Increased minimum face pixels for better accuracy
      faceCenterX /= facePixels;
      faceCenterY /= facePixels;
      
      const idealCenterX = width / 2;
      const idealCenterY = height / 3; // Face should be in upper third
      
      const eyeContact = Math.max(0, 100 - Math.abs(faceCenterX - idealCenterX) / width * 200);
      const postureScore = Math.max(0, 100 - Math.abs(faceCenterY - idealCenterY) / height * 150);
      
      const faceSize = facePixels / (width * height);
      const posture = Math.min(100, faceSize * 15000); // Adjusted calculation
      
      const headMovement = Math.min(100, Math.abs(faceCenterX - idealCenterX) / width * 200);
      
      const smiling = this.analyzeFacialExpression(data, width, height, faceCenterX, faceCenterY);
      
      const attention = (eyeContact + postureScore + (100 - headMovement) + smiling) / 4;
      
      const gestures = this.analyzeGestures(data, width, height);
      
      return {
        eyeContact: Math.min(100, Math.max(0, eyeContact)),
        posture: Math.min(100, Math.max(0, posture)),
        headMovement: Math.min(100, Math.max(0, headMovement)),
        smiling: Math.min(100, Math.max(0, smiling)),
        attention: Math.min(100, Math.max(0, attention)),
        gestures: Math.min(100, Math.max(0, gestures))
      };
    }
    
    return this.getFallbackGestureAnalysis();
  }

  private isSkinTone(r: number, g: number, b: number): boolean {
    // More accurate skin tone detection
    const isInRange = r > 95 && g > 40 && b > 20 && 
                     r > g && r > b && 
                     Math.abs(r - g) > 15;
    
    const brightness = (r + g + b) / 3;
    const isBrightEnough = brightness > 60 && brightness < 220;
    
    return isInRange && isBrightEnough;
  }

  private analyzeFacialExpression(data: Uint8ClampedArray, width: number, height: number, faceX: number, faceY: number): number {
    const mouthRegionSize = Math.min(60, width / 6);
    let smileIntensity = 0;
    let mouthPixels = 0;
    
    const startY = Math.max(0, Math.min(height - 1, faceY + 25)); // Adjusted mouth position
    const endY = Math.max(0, Math.min(height - 1, faceY + mouthRegionSize));
    const startX = Math.max(0, Math.min(width - 1, faceX - mouthRegionSize/2));
    const endX = Math.max(0, Math.min(width - 1, faceX + mouthRegionSize/2));
    
    for (let y = startY; y < endY; y += 2) {
      for (let x = startX; x < endX; x += 2) {
        const i = (y * width + x) * 4;
        if (i >= 0 && i < data.length - 3) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          
          // More accurate lip detection
          if (r > 130 && g < 100 && b < 100 && r > g + 30) {
            smileIntensity += 2;
          } else if (r > 100 && g < 90 && b < 90) {
            smileIntensity += 1;
          }
          mouthPixels++;
        }
      }
    }
    
    return mouthPixels > 0 ? Math.min(100, (smileIntensity / mouthPixels) * 150) : 25;
  }

  private analyzeGestures(data: Uint8ClampedArray, width: number, height: number): number {
    let edgePixels = 0;
    let totalPixels = 0;
    
    for (let y = 3; y < height - 3; y += 6) {
      for (let x = 3; x < width - 3; x += 6) {
        const i = (y * width + x) * 4;
        if (i >= 0 && i < data.length - 3) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          
          const right = ((y * width + x + 3) * 4);
          const down = (((y + 3) * width + x) * 4);
          
          if (right < data.length - 3 && down < data.length - 3) {
            const rightBrightness = (data[right] + data[right + 1] + data[right + 2]) / 3;
            const downBrightness = (data[down] + data[down + 1] + data[down + 2]) / 3;
            
            if (Math.abs(brightness - rightBrightness) > 30 || 
                Math.abs(brightness - downBrightness) > 30) {
              edgePixels++;
            }
          }
          totalPixels++;
        }
      }
    }
    
    return totalPixels > 0 ? Math.min(100, (edgePixels / totalPixels) * 400) : 40;
  }

  // Enhanced audio analysis with speech detection
  analyzeAudio(audioStream: MediaStream): VoiceAnalysis {
    if (!this.isInitialized || !this.audioContext || this.isAudioContextClosed) {
      return this.getFallbackVoiceAnalysis();
    }

    try {
      if (!audioStream.active) {
        return this.getFallbackVoiceAnalysis();
      }

      if (!this.analyzer) {
        const source = this.audioContext.createMediaStreamSource(audioStream);
        this.analyzer = this.audioContext.createAnalyser();
        this.analyzer.fftSize = 512; // Increased for better accuracy
        this.analyzer.smoothingTimeConstant = 0.8;
        source.connect(this.analyzer);
      }
      
      const bufferLength = this.analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const timeDomainArray = new Uint8Array(bufferLength);
      
      // Get frequency data for volume analysis
      this.analyzer.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / bufferLength;
      
      // Get time domain data for pitch and clarity analysis
      this.analyzer.getByteTimeDomainData(timeDomainArray);
      const tone = this.analyzePitch(timeDomainArray);
      const clarity = this.calculateClarity(timeDomainArray);
      
      // Only calculate confidence if user has spoken
      let confidence = this.voiceData.confidence;
      if (this.hasUserSpoken) {
        confidence = Math.min(100, (volume * 0.3 + clarity * 0.4 + tone * 0.3) * 100);
      } else {
        confidence = 0; // No confidence if user hasn't spoken
      }
      
      return {
        volume: Math.min(100, (volume / 256) * 100),
        clarity: Math.min(100, clarity),
        pace: this.voiceData.pace,
        tone: Math.min(100, tone * 100),
        fillerWords: this.voiceData.fillerWords,
        pauses: this.voiceData.pauses,
        confidence: confidence
      };
    } catch (error) {
      console.error('Audio analysis error:', error);
      return this.getFallbackVoiceAnalysis();
    }
  }

  private analyzePitch(dataArray: Uint8Array): number {
    let zeroCrossings = 0;
    let prevSample = dataArray[0] - 128;
    
    for (let i = 1; i < dataArray.length; i++) {
      const sample = dataArray[i] - 128;
      if ((prevSample < 0 && sample >= 0) || (prevSample >= 0 && sample < 0)) {
        zeroCrossings++;
      }
      prevSample = sample;
    }
    
    const pitch = zeroCrossings / dataArray.length;
    return Math.min(1, pitch * 8); // Adjusted multiplier
  }

  private calculateClarity(dataArray: Uint8Array): number {
    let clarity = 0;
    let significantSamples = 0;
    let totalAmplitude = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const amplitude = Math.abs(dataArray[i] - 128);
      totalAmplitude += amplitude;
      
      if (amplitude > 20) { // Increased threshold for better accuracy
        significantSamples++;
      }
    }
    
    const avgAmplitude = totalAmplitude / dataArray.length;
    const amplitudeScore = Math.min(100, (avgAmplitude / 64) * 100);
    const clarityScore = (significantSamples / dataArray.length) * 100;
    
    clarity = (amplitudeScore * 0.6 + clarityScore * 0.4);
    return Math.min(100, clarity);
  }

  updateSpeechMetrics(transcript: string, duration: number) {
    const words = transcript.split(/\s+/).filter(word => word.length > 0);
    this.wordCount = words.length;
    
    // Mark that user has spoken
    if (words.length > 0) {
      this.hasUserSpoken = true;
    }
    
    // Calculate speaking pace (words per minute)
    if (duration > 0 && words.length > 5) { // Only calculate if meaningful speech
      this.voiceData.pace = Math.max(50, Math.min(300, (words.length / duration) * 60));
    }
    
    // Analyze filler words in real transcript
    const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'so', 'well', 'okay', 'right'];
    const fillerCount = words.filter(word => 
      fillerWords.includes(word.toLowerCase().replace(/[.,!?;:]/g, ''))
    ).length;
    
    this.voiceData.fillerWords = fillerCount;
    
    // Analyze pauses (based on punctuation and speech patterns)
    const pauseIndicators = ['.', '?', '!', ',', ';', ':'];
    const pauseCount = words.filter(word => 
      pauseIndicators.some(p => word.includes(p))
    ).length;
    
    this.voiceData.pauses = pauseCount;
  }

  startRealTimeAnalysis(videoElement: HTMLVideoElement, audioStream: MediaStream) {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }

    if (!this.audioContext || this.isAudioContextClosed) {
      this.initialize();
    }

    this.analysisInterval = setInterval(async () => {
      try {
        if (videoElement.readyState >= 2 && audioStream.active) {
          const gestureAnalysis = await this.analyzeVideoFrame(videoElement);
          this.gestureData = gestureAnalysis;
          
          const voiceAnalysis = this.analyzeAudio(audioStream);
          this.voiceData = { ...this.voiceData, ...voiceAnalysis };
        }
      } catch (error) {
        console.error('Real-time analysis error:', error);
      }
    }, 2000); // Reduced to 2 seconds for more responsive analysis
  }

  stopAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    if (this.audioContext && !this.isAudioContextClosed) {
      try {
        this.audioContext.close().then(() => {
          this.isAudioContextClosed = true;
          this.analyzer = null;
        }).catch(error => {
          console.warn('Error closing audio context:', error);
          this.isAudioContextClosed = true;
          this.analyzer = null;
        });
      } catch (error) {
        console.warn('Error closing audio context:', error);
        this.isAudioContextClosed = true;
        this.analyzer = null;
      }
    }
  }

  getCurrentAnalysis(): { gestures: GestureAnalysis; voice: VoiceAnalysis } {
    return {
      gestures: this.gestureData,
      voice: this.voiceData
    };
  }

  resetUserSpeech() {
    this.hasUserSpoken = false;
    this.voiceData.confidence = 0;
    this.voiceData.pace = 150;
    this.voiceData.fillerWords = 0;
    this.voiceData.pauses = 0;
  }

  private getFallbackGestureAnalysis(): GestureAnalysis {
    // Return very low scores when no analysis is possible
    return {
      eyeContact: 10,
      posture: 15,
      headMovement: 80,
      smiling: 20,
      attention: 15,
      gestures: 25
    };
  }

  private getFallbackVoiceAnalysis(): VoiceAnalysis {
    // Return zero scores when no audio analysis is possible
    return {
      volume: 0,
      clarity: 0,
      pace: 0,
      tone: 0,
      fillerWords: 0,
      pauses: 0,
      confidence: 0
    };
  }
}

// Initialize the real-time analyzer
const realTimeAnalyzer = new RealTimeAnalyzer();

// Components
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

const Textarea = ({ placeholder, onChange, className, value, ...props }: any) => (
  <textarea
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${className || ''}`}
    rows={6}
    {...props}
  />
);

// Fixed Video Interviewer Component
const VideoInterviewer = ({ 
  isSpeaking, 
  currentQuestion, 
  onVideoEnd,
  isVideoEnabled = true,
  shouldShowVideo = true,
  isUserAnswering = false
}: { 
  isSpeaking: boolean;
  currentQuestion: string;
  onVideoEnd: () => void;
  isVideoEnabled?: boolean;
  shouldShowVideo?: boolean;
  isUserAnswering?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isVideoLoaded) return;

    const playVideo = async () => {
      try {
        if (videoElement.currentTime >= videoElement.duration - 1) {
          videoElement.currentTime = 0;
        }
        
        if (videoElement.readyState >= 2) {
          await videoElement.play();
          setIsVideoPlaying(true);
        }
      } catch (error) {
        console.warn('Video play failed:', error);
        setVideoError(true);
        setIsVideoPlaying(false);
      }
    };

    const pauseVideo = () => {
      if (videoElement) {
        videoElement.pause();
        setIsVideoPlaying(false);
      }
    };

    if (isVideoEnabled && shouldShowVideo && isSpeaking) {
      playVideo();
    } else if (isUserAnswering) {
      pauseVideo();
    }

  }, [isVideoEnabled, shouldShowVideo, isVideoLoaded, isSpeaking, isUserAnswering]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoEnd = () => {
      if (videoElement) {
        videoElement.currentTime = 0;
        if (isVideoEnabled && shouldShowVideo && isSpeaking) {
          videoElement.play().catch(console.warn);
        }
      }
    };

    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [isVideoEnabled, shouldShowVideo, isSpeaking]);

  const handleVideoError = () => {
    setVideoError(true);
    setIsVideoPlaying(false);
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setVideoError(false);
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden w-full h-full">
      {isVideoEnabled && shouldShowVideo && !videoError ? (
        <>
          <video
            ref={videoRef}
            src="/videos/interviewer-question.mp4"
            muted
            playsInline
            loop
            preload="metadata"
            className="w-full h-full object-cover"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onCanPlay={handleVideoLoad}
          />
          
          {!isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Loading interviewer...</p>
              </div>
            </div>
          )}

          {isVideoPlaying && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Live
            </div>
          )}

          {isUserAnswering && (
            <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Your Turn
            </div>
          )}

          {isSpeaking && !isUserAnswering && (
            <div className="absolute top-3 left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              AI Speaking
            </div>
          )}

          {currentQuestion && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4">
              <p className="text-white text-sm text-center">
                {currentQuestion}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-800">
          <div className="text-center text-white p-4">
            <User className="h-12 w-12 mx-auto mb-3 opacity-80" />
            <p className="text-lg font-semibold mb-1">Talkgenious AI</p>
            <p className="text-xs opacity-75 mb-4">AI-Powered Assessment</p>
            
            {currentQuestion && (
              <div className="mt-4 p-3 bg-black bg-opacity-50 rounded-lg max-w-md">
                <p className="text-sm">{currentQuestion}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Comprehensive Feedback Display Component
const ComprehensiveFeedbackDisplay = ({ 
  feedback, 
  isVisible,
  onClose 
}: { 
  feedback: ComprehensiveFeedback; 
  isVisible: boolean;
  onClose: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-start">
        <Brain className="h-7 w-7 text-blue-600 mr-4 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-blue-800 font-semibold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Comprehensive AI Assessment
            </h4>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm bg-white px-3 py-1 rounded-lg border"
            >
              Close
            </button>
          </div>
          
          {/* Overall Score */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className={`text-2xl font-bold ${
                feedback.overallScore >= 80 ? 'text-green-600' :
                feedback.overallScore >= 70 ? 'text-blue-600' : 
                feedback.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {feedback.overallScore}%
              </div>
              <div className="text-sm text-gray-600">Overall</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className={`text-xl font-bold ${
                feedback.contentScore >= 80 ? 'text-green-600' :
                feedback.contentScore >= 70 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {feedback.contentScore}%
              </div>
              <div className="text-sm text-gray-600">Content</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className={`text-xl font-bold ${
                feedback.voiceScore >= 80 ? 'text-green-600' :
                feedback.voiceScore >= 70 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {feedback.voiceScore}%
              </div>
              <div className="text-sm text-gray-600">Delivery</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className={`text-xl font-bold ${
                feedback.behavioralScore >= 80 ? 'text-green-600' :
                feedback.behavioralScore >= 70 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {feedback.behavioralScore}%
              </div>
              <div className="text-sm text-gray-600">Behavior</div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Voice Metrics */}
            <div className="bg-white p-4 rounded-lg border">
              <h5 className="text-blue-700 font-medium mb-3 text-sm">Voice Analysis</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Volume:</span>
                  <span>{Math.round(feedback.voiceAnalysis.volume)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Clarity:</span>
                  <span>{Math.round(feedback.voiceAnalysis.clarity)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pace:</span>
                  <span>{Math.round(feedback.voiceAnalysis.pace)} wpm</span>
                </div>
                <div className="flex justify-between">
                  <span>Filler Words:</span>
                  <span>{feedback.voiceAnalysis.fillerWords}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span>{Math.round(feedback.voiceAnalysis.confidence)}%</span>
                </div>
              </div>
            </div>

            {/* Behavior Metrics */}
            <div className="bg-white p-4 rounded-lg border">
              <h5 className="text-green-700 font-medium mb-3 text-sm">Behavior Analysis</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Eye Contact:</span>
                  <span>{Math.round(feedback.behavioralAnalysis.eyeContact)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Posture:</span>
                  <span>{Math.round(feedback.behavioralAnalysis.posture)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Gestures:</span>
                  <span>{Math.round(feedback.behavioralAnalysis.gestures)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Facial Expressions:</span>
                  <span>{Math.round(feedback.behavioralAnalysis.facialExpressions)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Engagement:</span>
                  <span>{Math.round(feedback.behavioralAnalysis.engagement)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h5 className="text-green-700 font-medium mb-3 text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Strengths
              </h5>
              <ul className="text-green-800 text-sm space-y-1">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h5 className="text-orange-700 font-medium mb-3 text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Areas for Improvement
              </h5>
              <ul className="text-orange-800 text-sm space-y-1">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Specific Suggestions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedback.specificSuggestions.content.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h6 className="text-blue-700 font-medium mb-2 text-xs">Content Tips</h6>
                <ul className="text-blue-800 text-xs space-y-1">
                  {feedback.specificSuggestions.content.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback.specificSuggestions.delivery.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h6 className="text-purple-700 font-medium mb-2 text-xs">Voice & Delivery</h6>
                <ul className="text-purple-800 text-xs space-y-1">
                  {feedback.specificSuggestions.delivery.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback.specificSuggestions.behavior.length > 0 && (
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                <h6 className="text-teal-700 font-medium mb-2 text-xs">Body Language</h6>
                <ul className="text-teal-800 text-xs space-y-1">
                  {feedback.specificSuggestions.behavior.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Corrected Answer Display Component
const CorrectedAnswerDisplay = ({ 
  correctedAnswer, 
  expectedAnswer, 
  isVisible,
  onClose 
}: { 
  correctedAnswer: string; 
  expectedAnswer: string; 
  isVisible: boolean;
  onClose: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-start">
        <Brain className="h-7 w-7 text-blue-600 mr-4 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-blue-800 font-semibold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Suggested Improvements
            </h4>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm bg-white px-3 py-1 rounded-lg border"
            >
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
              <h5 className="text-blue-700 font-medium mb-3 text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                How to improve your answer:
              </h5>
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                <p className="text-blue-800 text-sm leading-relaxed">{correctedAnswer}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
              <h5 className="text-purple-700 font-medium mb-3 text-sm flex items-center gap-2">
                <Star className="h-4 w-4" />
                Ideal answer structure:
              </h5>
              <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                <p className="text-purple-800 text-sm leading-relaxed">{expectedAnswer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: Enhanced Follow-up Question Display Component with Answer Input
const FollowUpQuestionDisplay = ({ 
  followUpQuestion, 
  followUpCount,
  maxFollowUps,
  isVisible,
  onAnswer,
  onSkip,
  currentAnswer,
  setCurrentAnswer,
  isRecording,
  startRecording,
  stopRecording,
  recordedChunks,
  hasMediaPermissions,
  isMicEnabled,
  isSpeechRecognitionActive,
  loading,
  isGeneratingNext
}: { 
  followUpQuestion: string;
  followUpCount: number;
  maxFollowUps: number;
  isVisible: boolean;
  onAnswer: () => void;
  onSkip: () => void;
  currentAnswer: string;
  setCurrentAnswer: (answer: string) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  recordedChunks: Blob[];
  hasMediaPermissions: boolean;
  isMicEnabled: boolean;
  isSpeechRecognitionActive: boolean;
  loading: boolean;
  isGeneratingNext: boolean;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-start">
        <MessageSquare className="h-7 w-7 text-orange-600 mr-4 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-orange-800 font-semibold text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Follow-up Question ({followUpCount}/{maxFollowUps})
            </h4>
            <button 
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 text-sm bg-white px-3 py-1 rounded-lg border"
            >
              Skip Follow-up
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm mb-4">
            <h5 className="text-orange-700 font-medium mb-3 text-sm">Follow-up Question:</h5>
            <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-400">
              <p className="text-orange-800 text-sm leading-relaxed">{followUpQuestion}</p>
            </div>
            <p className="text-orange-600 text-xs mt-3">
              This is follow-up question {followUpCount} of {maxFollowUps}. Please provide more details to improve your response.
            </p>
          </div>

          {/* Answer Input Area for Follow-up Questions */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Your Follow-up Response:
                </span>
                {isRecording && (
                  <div className="flex items-center gap-2 text-red-600 animate-pulse">
                    <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                    <span className="text-sm font-medium">Recording in progress...</span>
                  </div>
                )}
                {isSpeechRecognitionActive && (
                  <div className="flex items-center gap-2 text-green-600 animate-pulse">
                    <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                    <span className="text-sm font-medium">Listening...</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {currentAnswer.trim().split(/\s+/).length} words • Target: 50-150 words
              </div>
            </div>
            
            <Textarea
              placeholder="Please provide your detailed response to the follow-up question. Include specific examples, outcomes, or clarify your approach..."
              value={currentAnswer}
              onChange={(e: any) => setCurrentAnswer(e.target.value)}
              className="mb-4 min-h-32"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {hasMediaPermissions && (
                  <>
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-3 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                      disabled={!isMicEnabled}
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    
                    {recordedChunks.length > 0 && (
                      <Button
                        onClick={() => {
                          const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                          const audioUrl = URL.createObjectURL(audioBlob);
                          const audio = new Audio(audioUrl);
                          audio.play().catch(console.error);
                        }}
                        className="p-3 bg-green-600 hover:bg-green-700"
                        title="Play recorded response"
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                    )}
                  </>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
                  <span>Response quality:</span>
                  <div className={`px-2 py-1 rounded text-xs ${
                    currentAnswer.trim().split(/\s+/).length > 80 ? 'bg-green-100 text-green-700' :
                    currentAnswer.trim().split(/\s+/).length > 40 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {currentAnswer.trim().split(/\s+/).length > 80 ? 'Detailed' :
                     currentAnswer.trim().split(/\s+/).length > 40 ? 'Good' : 'Brief'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={onAnswer}
                  disabled={(!currentAnswer.trim() && recordedChunks.length === 0) || loading || isGeneratingNext}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700"
                >
                  {loading || isGeneratingNext ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Follow-up</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: Next Question Prompt Component
const NextQuestionPrompt = ({ 
  isVisible,
  onProceed
}: { 
  isVisible: boolean;
  onProceed: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-green-600" />
          <div>
            <h4 className="text-green-800 font-medium">Ready for the next question?</h4>
            <p className="text-green-600 text-sm">
              You've completed this question. Continue to the next challenge.
            </p>
          </div>
        </div>
        <Button
          onClick={onProceed}
          className="bg-green-600 hover:bg-green-700"
        >
          Next Question
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// NEW: Enhanced User Question Input Component with Resume Interview
const UserQuestionInput = ({ 
  isVisible,
  onAskQuestion,
  currentUserQuestion,
  setCurrentUserQuestion,
  isMicEnabled,
  hasMediaPermissions,
  onResumeInterview,
  isQuestionChatActive
}: { 
  isVisible: boolean;
  onAskQuestion: (question: string) => void;
  currentUserQuestion: string;
  setCurrentUserQuestion: (question: string) => void;
  isMicEnabled: boolean;
  hasMediaPermissions: boolean;
  onResumeInterview: () => void;
  isQuestionChatActive: boolean;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-start">
        <MessageSquare className="h-7 w-7 text-purple-600 mr-4 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-purple-800 font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Ask the Interviewer
            </h4>
            {isQuestionChatActive && (
              <Button
                onClick={onResumeInterview}
                className="bg-green-600 hover:bg-green-700 text-sm"
              >
                Resume Interview
              </Button>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm mb-4">
            <p className="text-purple-700 text-sm mb-3">
              Have a question for the interviewer? You can ask for clarification, repetition, or any other questions about the role or process.
            </p>
            
            <Textarea
              placeholder="Type your question for the interviewer here... (e.g., 'Could you please repeat the question?', 'Can you clarify what you mean by...?')"
              value={currentUserQuestion}
              onChange={(e: any) => setCurrentUserQuestion(e.target.value)}
              className="mb-4 min-h-20"
            />
            
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  if (hasMediaPermissions && isMicEnabled) {
                    // Add speech recognition for user questions
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                      const recognition = new SpeechRecognition();
                      recognition.continuous = false;
                      recognition.interimResults = false;
                      recognition.lang = 'en-US';
                      
                      recognition.onresult = (event: any) => {
                        const transcript = event.results[0][0].transcript;
                        setCurrentUserQuestion(transcript);
                      };
                      
                      recognition.start();
                    }
                  }
                }}
                disabled={!hasMediaPermissions || !isMicEnabled}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Mic className="h-4 w-4 mr-2" />
                Speak Question
              </Button>
              
              <Button
                onClick={() => onAskQuestion(currentUserQuestion)}
                disabled={!currentUserQuestion.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Ask Question
                <MessageSquare className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: Interviewer Response Display Component
const InterviewerResponseDisplay = ({
  response,
  isVisible,
  onResumeInterview
}: {
  response: string;
  isVisible: boolean;
  onResumeInterview: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-start">
        <User className="h-7 w-7 text-blue-600 mr-4 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-blue-800 font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Interviewer Response
            </h4>
            <Button
              onClick={onResumeInterview}
              className="bg-green-600 hover:bg-green-700 text-sm"
            >
              Resume Interview
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
              <p className="text-blue-800 text-sm leading-relaxed">{response}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Real Analysis Functions
// ENHANCED: Improved real-time analysis with better data validation
const analyzeBehaviorFromVideo = async (videoElement: HTMLVideoElement): Promise<BehavioralAnalysis> => {
  try {
    if (!videoElement || videoElement.readyState < 2) {
      console.warn('Video element not ready for analysis');
      return getFallbackBehavioralAnalysis();
    }

    const gestureAnalysis = await realTimeAnalyzer.analyzeVideoFrame(videoElement);
    
    console.log('Gesture analysis results:', gestureAnalysis);
    
    // Only use real data if we have meaningful analysis
    const hasValidData = gestureAnalysis.eyeContact > 15 && gestureAnalysis.posture > 15;
    
    if (!hasValidData) {
      console.warn('Invalid gesture analysis data received, using enhanced fallback');
      return getEnhancedFallbackBehavioralAnalysis();
    }
    
    const behavioralScore = Math.round(
      (gestureAnalysis.eyeContact * 0.25) +
      (gestureAnalysis.posture * 0.20) +
      (gestureAnalysis.gestures * 0.15) +
      (gestureAnalysis.smiling * 0.15) +
      (gestureAnalysis.attention * 0.25)
    );
    
    const analysis: BehavioralAnalysis = {
      score: behavioralScore,
      eyeContact: gestureAnalysis.eyeContact,
      posture: gestureAnalysis.posture,
      gestures: gestureAnalysis.gestures,
      facialExpressions: gestureAnalysis.smiling,
      confidenceLevel: gestureAnalysis.attention,
      engagement: gestureAnalysis.eyeContact,
      professionalism: gestureAnalysis.posture,
      analysis: {
        gazeDirection: [0.5, 0.5],
        headPose: [0, 0, 0],
        smileIntensity: gestureAnalysis.smiling / 100,
        gestureFrequency: gestureAnalysis.gestures / 100
      }
    };

    console.log('Behavioral analysis completed:', analysis);
    return analysis;

  } catch (error) {
    console.error('Behavior analysis error:', error);
    return getEnhancedFallbackBehavioralAnalysis();
  }
};

// ENHANCED: Improved fallback behavioral analysis
const getEnhancedFallbackBehavioralAnalysis = (): BehavioralAnalysis => {
  // More realistic fallback scores based on typical user behavior
  return {
    score: 45,
    eyeContact: 50,
    posture: 55,
    gestures: 40,
    facialExpressions: 35,
    confidenceLevel: 45,
    engagement: 50,
    professionalism: 55,
    analysis: {
      gazeDirection: [0.5, 0.5],
      headPose: [0, 0, 0],
      smileIntensity: 0.3,
      gestureFrequency: 0.4
    }
  };
};

const analyzeVoiceFromAudio = (audioStream: MediaStream, transcript: string, duration: number): VoiceAnalysis => {
  try {
    // Only update speech metrics if there's actual speech
    if (transcript.trim().length > 0) {
      realTimeAnalyzer.updateSpeechMetrics(transcript, duration);
    }
    
    const voiceAnalysis = realTimeAnalyzer.analyzeAudio(audioStream);
    
    // Only return real data if we have meaningful audio
    const hasValidAudio = voiceAnalysis.volume > 5 && voiceAnalysis.clarity > 5;
    
    if (!hasValidAudio) {
      console.warn('Invalid voice analysis data received');
      return getFallbackVoiceAnalysis();
    }
    
    return voiceAnalysis;
  } catch (error) {
    console.error('Voice analysis error:', error);
    return getFallbackVoiceAnalysis();
  }
};

// Enhanced content scoring function
const calculateContentScore = (answer: string, question: Question): number => {
  // If answer is empty or very short, return low score
  if (!answer.trim() || answer.trim().length < 10) {
    return 10;
  }

  const words = answer.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  let score = 0;
  
  // Length factor (0-25 points)
  if (wordCount >= 100) score += 25;
  else if (wordCount >= 70) score += 22;
  else if (wordCount >= 50) score += 18;
  else if (wordCount >= 30) score += 14;
  else if (wordCount >= 15) score += 10;
  else if (wordCount >= 5) score += 5;
  
  // Structure factor (0-25 points)
  const sentenceCount = (answer.match(/[.!?]+/g) || []).length;
  if (sentenceCount >= 6) score += 25;
  else if (sentenceCount >= 4) score += 20;
  else if (sentenceCount >= 3) score += 15;
  else if (sentenceCount >= 2) score += 10;
  else if (sentenceCount >= 1) score += 5;
  
  // Content quality factors (0-50 points)
  const hasExamples = /example|for instance|such as|specifically|e\.g/i.test(answer);
  const hasOutcomes = /result|outcome|achieved|accomplished|saved|improved|increased|reduced/i.test(answer);
  const hasMetrics = /\d+%|\d+ hours|\d+ dollars|\d+ users|\d+ projects/i.test(answer);
  const hasStructure = /first|then|next|finally|because|therefore|however/i.test(answer);
  
  if (hasExamples) score += 12;
  if (hasOutcomes) score += 12;
  if (hasMetrics) score += 13;
  if (hasStructure) score += 13;
  
  // Question relevance (bonus/malus)
  const questionKeywords = question.question.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const relevantKeywords = questionKeywords.filter(keyword => 
    answer.toLowerCase().includes(keyword)
  );
  const relevanceRatio = relevantKeywords.length / Math.max(1, questionKeywords.length);
  score += Math.round(relevanceRatio * 20);
  
  return Math.min(95, Math.max(10, score));
};

// Enhanced voice scoring - only score if user has actually spoken
const calculateVoiceScore = (voiceData: VoiceAnalysis, hasUserSpoken: boolean): number => {
  if (!hasUserSpoken) {
    return 0; // No voice score if user hasn't spoken
  }

  const weights = {
    volume: 0.25,
    clarity: 0.30,
    pace: 0.20,
    tone: 0.15,
    fillerWords: 0.05,
    pauses: 0.05
  };

  let paceScore = 0;
  if (voiceData.pace >= 140 && voiceData.pace <= 160) {
    paceScore = 100;
  } else if (voiceData.pace >= 130 && voiceData.pace <= 170) {
    paceScore = 80;
  } else if (voiceData.pace >= 120 && voiceData.pace <= 180) {
    paceScore = 60;
  } else {
    paceScore = 40;
  }

  const fillerWordPenalty = Math.min(voiceData.fillerWords * 5, 25);
  const pausePenalty = Math.min(voiceData.pauses * 2, 15);

  const rawScore = 
    (voiceData.volume * weights.volume) +
    (voiceData.clarity * weights.clarity) +
    (paceScore * weights.pace) +
    (voiceData.tone * weights.tone);

  const finalScore = Math.max(0, rawScore - fillerWordPenalty - pausePenalty);
  return Math.round(finalScore);
};

// Enhanced skill assessment
const generateSkillAssessment = (
  contentScore: number,
  behavioralScore: number,
  voiceScore: number,
  questionType: string
): { [key: string]: number } => {
  const baseCommunication = Math.round((contentScore * 0.4 + voiceScore * 0.6) * 0.9);
  const baseConfidence = Math.round((behavioralScore * 0.7 + voiceScore * 0.3) * 0.9);
  const baseProblemSolving = Math.round(contentScore * (questionType === 'problem-solving' ? 0.95 : 0.8));
  const baseTechnical = Math.round(contentScore * (questionType === 'technical' ? 0.95 : 0.7));
  
  return {
    'Communication': Math.max(10, baseCommunication),
    'Problem Solving': Math.max(10, baseProblemSolving),
    'Technical Knowledge': Math.max(10, baseTechnical),
    'Confidence': Math.max(10, baseConfidence),
    'Professionalism': Math.max(10, behavioralScore * 0.9),
    'Algorithms': Math.max(0, contentScore * (questionType === 'technical' ? 0.8 : 0.3))
  };
};

// ENHANCED: Improved analysis function with better answer understanding and feedback
const getEnhancedRealAnalysis = (
  question: Question,
  answer: string,
  behavioralData: BehavioralAnalysis,
  voiceData: VoiceAnalysis,
  userName: string = '',
  isFollowUp: boolean = false,
  followUpCount: number = 0
) => {
  const hasUserSpoken = answer.trim().length > 0;
  const contentScore = calculateContentScore(answer, question);
  const behavioralScore = behavioralData.score;
  const voiceScore = calculateVoiceScore(voiceData, hasUserSpoken);

  const overallScore = Math.round(
    (contentScore * 0.5) + 
    (behavioralScore * 0.3) + 
    (voiceScore * 0.2)
  );

  const skillAssessment = generateSkillAssessment(
    contentScore,
    behavioralScore,
    voiceScore,
    question.type
  );

  const comprehensiveFeedback = generateComprehensiveFeedback(
    contentScore,
    behavioralScore,
    voiceScore,
    { score: contentScore },
    behavioralData,
    voiceData
  );

  const userPrefix = userName ? `${userName}, ` : '';
  
  let feedback = '';
  let interviewerResponse = '';
  let followUpQuestion = null;

  // ENHANCED: Better answer analysis and feedback generation
  const answerLower = answer.toLowerCase();
  
  // Check for common issues in answers
  const isConfused = /don't understand|don't know|not sure|confused|can you repeat|what do you mean/i.test(answerLower);
  const isVague = /maybe|perhaps|probably|I think|I guess|kind of|sort of/i.test(answerLower);
  const isShort = answer.trim().split(/\s+/).length < 20;
  const lacksExamples = !/example|for instance|such as|specifically|in my experience/i.test(answerLower);
  const lacksStructure = !/first|then|next|finally|because|therefore|however/i.test(answerLower);

  // Generate appropriate feedback based on answer quality
  if (isConfused) {
    feedback = `${userPrefix}I notice you seem unsure about this question. Let me clarify what I'm looking for and give you another chance to answer.`;
    interviewerResponse = `${userPrefix}I understand this might be challenging. Let me rephrase the question to make it clearer for you.`;
    followUpQuestion = generateClarificationFollowUp(question, answer);
  } 
  else if (overallScore >= 90) {
    feedback = `${userPrefix}excellent response! You provided comprehensive details with specific examples and demonstrated strong communication skills.`;
    interviewerResponse = `${userPrefix}thank you for that outstanding answer. You clearly have deep expertise in this area.`;
  } else if (overallScore >= 85) {
    feedback = `${userPrefix}that was a very good response. You covered the main points well with relevant examples and good delivery.`;
    interviewerResponse = `${userPrefix}thank you for that detailed answer. It gives me a clear picture of your capabilities.`;
  } else if (overallScore >= 75) {
    feedback = `${userPrefix}good response. You addressed the question appropriately. Consider improving your delivery and adding more specific examples.`;
    interviewerResponse = `${userPrefix}thank you for your response. That helps me understand your approach.`;
    if (shouldAskFollowUp(overallScore, followUpCount)) {
      followUpQuestion = generateFirstFollowUp(question, answer, overallScore);
    }
  } else if (overallScore >= 65) {
    feedback = `${userPrefix}you've made a good attempt. The response would be stronger with more specific details, better vocal delivery, and confident body language.`;
    interviewerResponse = `${userPrefix}I appreciate your answer. Let me ask a follow-up to better understand your experience.`;
    if (shouldAskFollowUp(overallScore, followUpCount)) {
      followUpQuestion = followUpCount === 0 ? 
        generateFirstFollowUp(question, answer, overallScore) : 
        generateSecondFollowUp(question, answer, overallScore);
    }
  } else {
    feedback = `${userPrefix}your response was quite brief. In professional settings, it's important to provide comprehensive answers with specific examples, confident delivery, and professional body language.`;
    interviewerResponse = `${userPrefix}thank you for attempting the question. Let me ask a follow-up to help you provide more detail.`;
    if (shouldAskFollowUp(overallScore, followUpCount)) {
      followUpQuestion = followUpCount === 0 ? 
        generateFirstFollowUp(question, answer, overallScore) :
        followUpCount === 1 ?
        generateSecondFollowUp(question, answer, overallScore) :
        generateThirdFollowUp(question, answer, overallScore);
    }
  }

  // ENHANCED: Generate more specific corrected answer based on actual response issues
  let correctedAnswer = "An improved answer would include specific examples, measurable results, clearer connections to the role requirements, confident vocal delivery, and professional body language.";
  
  if (isVague) {
    correctedAnswer = "Try to be more definitive in your responses. Instead of 'I think maybe...' say 'Based on my experience...' and provide concrete examples.";
  }
  if (lacksExamples) {
    correctedAnswer = "Include specific examples from your experience. For instance, instead of saying 'I handled projects,' say 'I managed a team of 5 on Project X which resulted in 20% efficiency improvement.'";
  }
  if (lacksStructure) {
    correctedAnswer = "Structure your answer clearly. Start with your main point, provide supporting evidence or examples, then conclude with the outcome or learning.";
  }

  return {
    score: overallScore,
    contentScore,
    behavioralScore,
    voiceScore,
    strengths: generateStrengths(contentScore, behavioralScore, voiceScore),
    improvements: generateImprovements(contentScore, behavioralScore, voiceScore),
    suggestions: [
      "Include specific metrics when possible",
      "Use concrete examples from your experience",
      "Explain your thought process clearly",
      "Highlight measurable outcomes and achievements"
    ],
    skillAssessment,
    detailedFeedback: feedback,
    confidenceLevel: overallScore,
    behavioralAnalysis: behavioralData,
    voiceAnalysis: voiceData,
    comprehensiveFeedback,
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: "An ideal response demonstrates expertise through specific examples, shows problem-solving methodology, highlights relevant outcomes with metrics, uses confident and clear communication, and maintains professional presence.",
    followUpQuestion
  };
};

// ENHANCED: Improved follow-up question generators with better context awareness


// ENHANCED: Improved function to handle user questions to interviewer with better analysis
const handleUserQuestionToInterviewer = (userQuestion: string, currentQuestion: Question, interviewState: InterviewState): string => {
  const lowerQuestion = userQuestion.toLowerCase();
  
  // Enhanced analysis of user questions with more realistic responses
  const isAskingForClarification = /clarify|explain|what do you mean|don't understand|not clear/i.test(lowerQuestion);
  const isAskingForRepetition = /repeat|say that again|didn't catch|missed that/i.test(lowerQuestion);
  const isAskingAboutProcess = /process|next|how many|what happens|after this/i.test(lowerQuestion);
  const isAskingAboutEvaluation = /evaluate|looking for|criteria|how am i doing|performance/i.test(lowerQuestion);
  const isAskingAboutRole = /role|position|job|responsibilities|what would i do/i.test(lowerQuestion);
  const isAskingAboutFeedback = /feedback|how did i do|my answer|assessment/i.test(lowerQuestion);
  const isAskingAboutTime = /time|long|duration|how much longer/i.test(lowerQuestion);
  const isAskingTechnical = /technical|skill|experience|knowledge|background/i.test(lowerQuestion);
  const isAskingPersonal = /your|you|who are you|your role/i.test(lowerQuestion);
  
  // Handle request to repeat question
  if (isAskingForRepetition) {
    return `Of course, I'd be happy to repeat the question. "${currentQuestion.question}" Please take your time to think about your response.`;
  }
  
  // Handle clarification requests with more specific, realistic responses
  if (isAskingForClarification) {
    return `I'd be happy to clarify that for you. The question is asking about ${
      currentQuestion.type === 'technical' ? 'your technical knowledge and how you approach problems in this area' :
      currentQuestion.type === 'behavioral' ? 'a specific example from your past experience that demonstrates your capabilities' :
      currentQuestion.type === 'problem-solving' ? 'your methodology for solving challenges and the steps you take' :
      'your relevant experience and thought process'
    }. Could you provide a specific example that relates to this?`;
  }
  
  // Handle questions about the interview process with realistic timing
  if (isAskingAboutProcess) {
    const mainQuestionsCount = interviewState.answeredQuestions;
    const remaining = Math.max(0, 10 - mainQuestionsCount);
    const estimatedTime = Math.max(5, remaining * 3); // 3 minutes per question estimate
    
    return `We're about halfway through the assessment. We've completed ${mainQuestionsCount} main questions with approximately ${remaining} remaining. The entire session typically takes around ${estimatedTime} more minutes. The interview adapts based on your responses to better understand your capabilities.`;
  }
  
  // Handle questions about evaluation criteria with realistic, encouraging feedback
  if (isAskingAboutEvaluation) {
    const score = interviewState.performanceScore;
    let performanceText = '';
    let encouragement = '';
    
    if (score >= 80) {
      performanceText = 'strong';
      encouragement = 'You\'re demonstrating excellent communication skills and relevant experience.';
    } else if (score >= 70) {
      performanceText = 'good';
      encouragement = 'You\'re providing solid answers with good examples.';
    } else if (score >= 60) {
      performanceText = 'satisfactory';
      encouragement = 'You\'re on the right track, focus on providing more specific examples.';
    } else {
      performanceText = 'developing';
      encouragement = 'Try to provide more detailed responses with concrete examples from your experience.';
    }
    
    return `I evaluate responses based on several factors: relevance to the question, depth of examples provided, clarity of communication, problem-solving approach, and how well your experience aligns with role requirements. Based on your responses so far, your performance is ${performanceText} with an overall score of ${score}%. ${encouragement}`;
  }
  
  // Handle personal questions about the AI interviewer
  if (isAskingPersonal) {
    return "I'm your AI interviewer conducting this assessment. My role is to understand your capabilities and experience through our conversation, and provide you with constructive feedback to help you improve.";
  }
  
  // Handle other questions with more natural, conversational responses
  if (isAskingAboutRole) {
    return "That's a great question about the role. In a real interview setting, this shows your interest in understanding the position better. For this assessment, I'd recommend focusing on demonstrating how your specific skills and experiences make you a strong fit through your answers to the questions asked.";
  }
  
  if (isAskingAboutFeedback) {
    const weakAreas = Object.entries(interviewState.skillProficiency)
      .filter(([_, score]) => score < 60)
      .map(([skill]) => skill)
      .slice(0, 2);
    
    if (weakAreas.length > 0) {
      return `Based on our conversation so far, you're doing well overall. To strengthen your responses further, consider providing more specific examples when discussing ${weakAreas.join(' and ')}. Use the STAR method - Situation, Task, Action, Result - to structure your answers with concrete outcomes.`;
    } else {
      return "You're providing good, comprehensive answers. Continue focusing on specific examples with measurable results, and maintain the clear communication style you've been demonstrating.";
    }
  }
  
  // Default response for other questions
  return "That's a relevant question. In a professional interview setting, asking thoughtful questions demonstrates your engagement and understanding. For this assessment, I'd recommend we continue with the planned questions to thoroughly evaluate your capabilities, but I appreciate your curiosity and engagement.";
};

// Helper functions for generating feedback
const generateStrengths = (contentScore: number, behavioralScore: number, voiceScore: number): string[] => {
  const strengths: string[] = [];
  
  if (contentScore >= 70) strengths.push("Strong content quality and relevance");
  if (behavioralScore >= 70) strengths.push("Good body language and professional presence");
  if (voiceScore >= 70) strengths.push("Clear and confident vocal delivery");
  if (contentScore >= 80 && behavioralScore >= 80) strengths.push("Excellent overall communication skills");
  
  if (strengths.length === 0) {
    strengths.push("Good attempt at answering the question");
  }
  
  return strengths;
};

const generateImprovements = (contentScore: number, behavioralScore: number, voiceScore: number): string[] => {
  const improvements: string[] = [];
  
  if (contentScore < 70) improvements.push("Need more specific examples and detailed explanations");
  if (behavioralScore < 70) improvements.push("Improve body language and professional presence");
  if (voiceScore < 70) improvements.push("Work on vocal clarity and confidence");
  if (contentScore < 60) improvements.push("Provide more structured and comprehensive answers");
  
  return improvements;
};

// Enhanced comprehensive feedback generation
const generateComprehensiveFeedback = (
  contentScore: number,
  behavioralScore: number,
  voiceScore: number,
  contentAnalysis: any,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis
): ComprehensiveFeedback => {
  const overallScore = Math.round(
    (contentScore * 0.5) + 
    (behavioralScore * 0.3) + 
    (voiceScore * 0.2)
  );

  const strengths = generateStrengths(contentScore, behavioralScore, voiceScore);
  const improvements = generateImprovements(contentScore, behavioralScore, voiceScore);
  const contentSuggestions: string[] = [];
  const deliverySuggestions: string[] = [];
  const behaviorSuggestions: string[] = [];

  // Content feedback
  if (contentScore < 70) {
    contentSuggestions.push("Include more concrete examples from your experience");
    contentSuggestions.push("Provide measurable outcomes and results");
    contentSuggestions.push("Structure your answer with clear beginning, middle, and end");
  }

  if (contentScore < 60) {
    contentSuggestions.push("Connect your experience directly to the question asked");
    contentSuggestions.push("Use the STAR method (Situation, Task, Action, Result)");
  }

  // Behavioral feedback
  if (behavioralData) {
    if (behavioralData.eyeContact < 60) {
      behaviorSuggestions.push("Look directly at the camera when speaking to simulate eye contact");
    }

    if (behavioralData.posture < 60) {
      behaviorSuggestions.push("Sit straight and avoid slouching during the interview");
    }

    if (behavioralData.gestures < 50) {
      behaviorSuggestions.push("Use occasional hand gestures to appear more engaging");
    } else if (behavioralData.gestures > 90) {
      behaviorSuggestions.push("Keep gestures controlled and purposeful");
    }

    if (behavioralData.confidenceLevel < 60) {
      behaviorSuggestions.push("Practice power poses before the interview to boost confidence");
    }
  }

  // Voice feedback
  if (voiceData) {
    if (voiceData.volume < 60) {
      deliverySuggestions.push("Practice speaking at a volume that carries authority");
    }

    if (voiceData.clarity < 70) {
      deliverySuggestions.push("Practice articulating words clearly and deliberately");
    }

    if (voiceData.pace < 120) {
      deliverySuggestions.push("Aim for 150-160 words per minute for optimal engagement");
    } else if (voiceData.pace > 180) {
      deliverySuggestions.push("Use strategic pauses to emphasize key points");
    }

    if (voiceData.fillerWords > 5) {
      deliverySuggestions.push("Practice pausing instead of using filler words");
    }

    if (voiceData.tone < 60) {
      deliverySuggestions.push("Use vocal inflection to emphasize important points");
    }
  }

  let detailedFeedback = `Overall Performance: ${overallScore}/100\n\n`;
  
  if (strengths.length > 0) {
    detailedFeedback += "Strengths:\n• " + strengths.join("\n• ") + "\n\n";
  }

  if (improvements.length > 0) {
    detailedFeedback += "Areas for Improvement:\n• " + improvements.join("\n• ") + "\n\n";
  }

  detailedFeedback += "Breakdown:\n";
  detailedFeedback += `• Content Quality: ${contentScore}/100\n`;
  detailedFeedback += `• Delivery & Voice: ${voiceScore}/100\n`;
  detailedFeedback += `• Body Language: ${behavioralScore}/100`;

  return {
    contentScore,
    behavioralScore,
    voiceScore,
    overallScore,
    strengths,
    improvements,
    detailedFeedback,
    contentAnalysis: {
      relevance: Math.min(contentScore + 10, 100),
      structure: Math.min(contentScore + 5, 100),
      examples: Math.min(contentScore, 100),
      depth: Math.min(contentScore - 5, 100)
    },
    behavioralAnalysis: behavioralData || getFallbackBehavioralAnalysis(),
    voiceAnalysis: voiceData || getFallbackVoiceAnalysis(),
    specificSuggestions: {
      content: contentSuggestions,
      delivery: deliverySuggestions,
      behavior: behaviorSuggestions
    }
  };
};

// Fallback functions
const getFallbackBehavioralAnalysis = (): BehavioralAnalysis => ({
  score: 25,
  eyeContact: 30,
  posture: 35,
  gestures: 25,
  facialExpressions: 20,
  confidenceLevel: 25,
  engagement: 30,
  professionalism: 35,
  analysis: {
    gazeDirection: [0.5, 0.5],
    headPose: [0, 0, 0],
    smileIntensity: 0.2,
    gestureFrequency: 0.3
  }
});

const getFallbackVoiceAnalysis = (): VoiceAnalysis => ({
  volume: 0,
  clarity: 0,
  pace: 0,
  tone: 0,
  fillerWords: 0,
  pauses: 0,
  confidence: 0
});

// ENHANCED: Improved analyzeAnswerWithAI function with better answer understanding
// ENHANCED: Improved analyzeAnswerWithAI function with real behavioral and voice analysis
// CORRECTED: Enhanced analyzeAnswerWithAI function with proper answer analysis and follow-up generation
// ENHANCED: Improved analyzeAnswerWithAI function with proper answer analysis and follow-up generation
// REAL AI ANALYSIS: Connect to Groq API for actual answer analysis
// ENHANCED: Real feedback for ALL questions and proper speech flow
const analyzeAnswerWithAI = async (
  question: Question, 
  answer: string, 
  state: InterviewState,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis,
  userName: string = '',
  isUserQuestion: boolean = false,
  userQuestion: string = '',
  followUpCount: number = 0,
  mediaStream: MediaStream | null = null,
  isVideoEnabled: boolean = false
): Promise<any> => {
  try {
    console.log('Calling real AI analysis API for:', {
      questionType: question.type,
      isFollowUp: followUpCount > 0,
      followUpCount,
      answerLength: answer.length
    });

    // Handle user questions to interviewer
    if (isUserQuestion) {
      const interviewerResponse = await handleUserQuestionWithAPI(userQuestion, question, state, userName);
      
      return {
        score: 0,
        contentScore: 0,
        behavioralScore: 0,
        voiceScore: 0,
        strengths: [],
        improvements: [],
        suggestions: [],
        skillAssessment: {},
        detailedFeedback: `Thank you for your question. ${userName ? `${userName}, ` : ''}I appreciate your engagement.`,
        confidenceLevel: 0,
        behavioralAnalysis: behavioralData || getFallbackBehavioralAnalysis(),
        voiceAnalysis: voiceData || getFallbackVoiceAnalysis(),
        comprehensiveFeedback: null,
        interviewerResponse,
        correctedAnswer: "",
        expectedAnswer: "",
        followUpQuestion: null,
        isUserQuestionResponse: true
      };
    }

    // Call the actual AI API for ALL questions (main and follow-up)
    const analysis = await callAnalysisAPI(question, answer, state, behavioralData, voiceData, userName, followUpCount);

    console.log('Real AI analysis received for all questions:', {
      score: analysis.score,
      hasFollowUp: !!analysis.followUpQuestion,
      feedbackLength: analysis.detailedFeedback?.length,
      isFollowUpQuestion: followUpCount > 0
    });

    return analysis;

  } catch (error) {
    console.error('Real AI analysis error:', error);
    
    // Enhanced fallback for ALL questions
    return await getEnhancedRealAnalysisWithFollowUps(
      question, 
      answer, 
      behavioralData || getFallbackBehavioralAnalysis(),
      voiceData || getFallbackVoiceAnalysis(),
      userName,
      followUpCount,
      state
    );
  }
};

// ENHANCED: Call API for ALL question types

// NEW: Call your actual API route - MAKE SURE THIS FUNCTION EXISTS
// FIXED: Enhanced API call with better error handling and first question support
const callAnalysisAPI = async (
  question: Question,
  answer: string,
  state: InterviewState,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis,
  userName: string = '',
  followUpCount: number = 0
) => {
  // ADDED: Special debugging for first question
  const isFirstQuestionChain = state.answeredQuestions === 0 && followUpCount <= 3;
  
  console.log('🔍 API Call Debug - First Question Chain:', {
    isFirstQuestionChain,
    questionId: question.id,
    questionType: question.type,
    answeredQuestions: state.answeredQuestions,
    followUpCount,
    answerLength: answer.length,
    hasUserName: !!userName
  });

  const requestBody = {
    question: question.question,
    answer: answer,
    questionType: question.type,
    difficulty: question.difficulty,
    category: question.category || '',
    userName: userName,
    followUpCount: followUpCount,
    isFollowUpResponse: followUpCount > 0,
    performanceScore: state.performanceScore,
    conversationContext: state.conversationContext.slice(-3),
    skillProficiency: state.skillProficiency,
    behavioralData: behavioralData || {},
    voiceData: voiceData || {},
    // ADDED: Flag to identify first question chain
    isFirstQuestionChain: isFirstQuestionChain
  };

  try {
    console.log('📤 Sending API request for first question chain...');
    
    const response = await fetch('/api/analyze-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      // ADDED: Better timeout handling
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API response error for first question:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API response error: ${response.status} - ${response.statusText}`);
    }

    const analysis = await response.json();
    
    console.log('✅ API Success for first question chain:', {
      score: analysis.score,
      hasFollowUp: !!analysis.followUpQuestion,
      feedbackLength: analysis.detailedFeedback?.length,
      interviewerResponseLength: analysis.interviewerResponse?.length
    });

    // ENHANCED: Better validation for first question responses
    if (isFirstQuestionChain) {
      console.log('🎯 First Question Chain Analysis Received:', {
        score: analysis.score,
        hasRealFeedback: !analysis.detailedFeedback?.includes('generic'),
        followUpQuestion: analysis.followUpQuestion
      });
    }

    // ENHANCED: Ensure we have valid data structure with proper fallbacks
    return {
      score: analysis.score || 70,
      contentScore: analysis.contentScore || analysis.score || 70,
      behavioralScore: analysis.behavioralScore || (behavioralData?.score || 70),
      voiceScore: analysis.voiceScore || (voiceData?.confidence || 70),
      strengths: analysis.strengths || ['Good engagement with the question'],
      improvements: analysis.improvements || ['Provide more specific examples'],
      suggestions: analysis.suggestions || ['Include measurable results in your answers'],
      skillAssessment: analysis.skillAssessment || generateSkillAssessment(
        analysis.contentScore || analysis.score || 70,
        analysis.behavioralScore || (behavioralData?.score || 70),
        analysis.voiceScore || (voiceData?.confidence || 70),
        question.type
      ),
      detailedFeedback: analysis.detailedFeedback || 'Thank you for your response. Please provide more specific examples from your experience.',
      confidenceLevel: analysis.confidenceLevel || analysis.score || 70,
      behavioralAnalysis: analysis.behavioralAnalysis || behavioralData || getFallbackBehavioralAnalysis(),
      voiceAnalysis: analysis.voiceAnalysis || voiceData || getFallbackVoiceAnalysis(),
      comprehensiveFeedback: analysis.comprehensiveFeedback || generateComprehensiveFeedback(
        analysis.contentScore || analysis.score || 70,
        analysis.behavioralScore || (behavioralData?.score || 70),
        analysis.voiceScore || (voiceData?.confidence || 70),
        { score: analysis.contentScore || analysis.score || 70 },
        behavioralData,
        voiceData
      ),
      interviewerResponse: analysis.interviewerResponse || 'Thank you for your answer. Let me ask a follow-up question to better understand your experience.',
      correctedAnswer: analysis.correctedAnswer || 'Try to include specific examples, measurable results, and your thought process in your responses.',
      expectedAnswer: analysis.expectedAnswer || 'An ideal response would include specific examples, measurable outcomes, clear problem-solving approach, and relevant experience details.',
      followUpQuestion: analysis.followUpQuestion || (followUpCount < 3 ? 'Could you provide a specific example to illustrate your point?' : null)
    };

  } catch (error) {
    console.error('❌ API Call Failed for first question chain:', error);
    
    // ENHANCED: Better fallback for first question chain
    if (isFirstQuestionChain) {
      console.log('🔄 Using enhanced fallback for first question chain');
      return getEnhancedFirstQuestionFallback(question, answer, userName, followUpCount, behavioralData, voiceData);
    }
    
    throw error;
  }
};

// NEW: Enhanced fallback specifically for first question chain
const getEnhancedFirstQuestionFallback = (
  question: Question,
  answer: string,
  userName: string,
  followUpCount: number,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis
) => {
  const userPrefix = userName ? `${userName}, ` : '';
  
  // Analyze the actual answer content for dynamic feedback
  const wordCount = answer.trim().split(/\s+/).length;
  const hasExamples = /example|for instance|such as|specifically/i.test(answer.toLowerCase());
  const hasMetrics = /\d+%|\d+ years|\d+ projects|\d+ team/i.test(answer);
  const hasStructure = /first|then|next|finally|because|therefore/i.test(answer.toLowerCase());
  
  // Dynamic scoring based on actual content
  let contentScore = 50;
  if (wordCount > 100) contentScore += 25;
  else if (wordCount > 60) contentScore += 20;
  else if (wordCount > 30) contentScore += 15;
  else if (wordCount > 15) contentScore += 10;
  
  if (hasExamples) contentScore += 15;
  if (hasMetrics) contentScore += 15;
  if (hasStructure) contentScore += 10;
  
  contentScore = Math.min(95, Math.max(30, contentScore));
  const overallScore = contentScore;

  // Dynamic feedback based on actual answer quality
  let detailedFeedback = '';
  let interviewerResponse = '';
  let correctedAnswer = '';
  let followUpQuestion = null;

  if (overallScore >= 80) {
    detailedFeedback = `${userPrefix}Excellent response! You provided comprehensive details ${hasExamples ? 'with specific examples' : ''} ${hasMetrics ? 'and measurable results' : ''}. Your answer demonstrates strong understanding and clear communication.`;
    interviewerResponse = `${userPrefix}Thank you for that thorough answer. You clearly have solid experience in this area.`;
    correctedAnswer = "Your answer was already strong. To make it even better, consider discussing alternative approaches or key learnings from your experience.";
  } else if (overallScore >= 70) {
    detailedFeedback = `${userPrefix}Good response addressing the main points. ${hasExamples ? 'The examples helped illustrate your points well.' : 'Consider adding specific examples to strengthen your answer.'}`;
    interviewerResponse = `${userPrefix}Thank you for your response. You covered the key aspects well.`;
    correctedAnswer = "Try to include more specific metrics and outcomes. For example, instead of 'improved performance', say 'increased efficiency by 25% through process optimization'.";
  } else if (overallScore >= 60) {
    detailedFeedback = `${userPrefix}You've made a good attempt at answering the question. The response would be stronger with more specific details and examples from your experience.`;
    interviewerResponse = `${userPrefix}Thank you for your answer. Let me ask a follow-up to better understand your approach.`;
    correctedAnswer = "An improved answer would include: 1) A specific example from your experience, 2) Your step-by-step approach, 3) Measurable results or outcomes, 4) Key learnings gained.";
  } else {
    detailedFeedback = `${userPrefix}Your response was ${wordCount < 20 ? 'quite brief' : 'a good start'}. In professional interviews, it's important to provide comprehensive answers with specific examples and measurable outcomes.`;
    interviewerResponse = `${userPrefix}Thank you for attempting the question. Let me ask a follow-up to help you provide more detail.`;
    correctedAnswer = "For stronger responses, use the STAR method: Describe the Situation, Task, Action you took, and Results achieved. Include specific numbers and outcomes.";
  }

  // Dynamic follow-up questions for first question chain
  if (followUpCount < 3 && overallScore < 85) {
    if (!hasExamples && followUpCount === 0) {
      followUpQuestion = "Could you provide a specific example from your experience that illustrates this point?";
    } else if (!hasMetrics && followUpCount === 1) {
      followUpQuestion = "What were the measurable outcomes or results in that situation? Can you quantify the impact?";
    } else if (followUpCount === 2) {
      followUpQuestion = "Could you walk me through your thought process in more detail? What alternative approaches did you consider?";
    } else {
      followUpQuestion = "How would you apply this experience to the requirements of this role?";
    }
  }

  return {
    score: overallScore,
    contentScore,
    behavioralScore: behavioralData?.score || Math.max(50, contentScore - 5),
    voiceScore: voiceData?.confidence || Math.max(50, contentScore - 5),
    strengths: hasExamples ? 
      ['Used specific examples to illustrate points', 'Good structure and clarity'] : 
      ['Addressed the question directly', 'Clear communication style'],
    improvements: !hasExamples ? 
      ['Add more specific examples from experience', 'Include measurable results and outcomes'] : 
      ['Provide more detailed explanations', 'Connect experience more directly to role requirements'],
    suggestions: [
      'Use the STAR method (Situation, Task, Action, Result) for behavioral questions',
      'Include quantifiable metrics whenever possible',
      'Connect your experience directly to the role requirements',
      'Explain your thought process and decision-making'
    ],
    skillAssessment: {
      'Communication': contentScore,
      'Problem Solving': Math.max(50, contentScore - 5),
      'Technical Knowledge': contentScore,
      'Confidence': Math.max(50, contentScore - 10),
      'Professionalism': Math.max(50, contentScore - 5)
    },
    detailedFeedback,
    confidenceLevel: overallScore,
    behavioralAnalysis: behavioralData || getFallbackBehavioralAnalysis(),
    voiceAnalysis: voiceData || getFallbackVoiceAnalysis(),
    comprehensiveFeedback: generateComprehensiveFeedback(
      contentScore,
      behavioralData?.score || 65,
      voiceData?.confidence || 65,
      { score: contentScore },
      behavioralData,
      voiceData
    ),
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: `An ideal response would include specific examples, measurable outcomes, clear problem-solving methodology, and relevant experience details. For ${question.type} questions, focus on ${question.type === 'behavioral' ? 'concrete examples from your past experience' : question.type === 'technical' ? 'your technical approach and methodology' : 'your relevant skills and capabilities'}.`,
    followUpQuestion
  };
};

// NEW: Handle user questions with API - MAKE SURE THIS FUNCTION EXISTS
const handleUserQuestionWithAPI = async (
  userQuestion: string,
  currentQuestion: Question,
  interviewState: InterviewState,
  userName: string = ''
): Promise<string> => {
  try {
    const response = await fetch('/api/analyze-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: currentQuestion.question,
        answer: '', // Empty since user is asking, not answering
        userQuestion: userQuestion,
        isUserQuestion: true,
        userName: userName,
        performanceScore: interviewState.performanceScore,
        conversationContext: interviewState.conversationContext
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.interviewerResponse || getDefaultUserQuestionResponse(userQuestion, userName);
    } else {
      console.error('User question API error:', response.status);
    }
  } catch (error) {
    console.error('Error handling user question with API:', error);
  }

  return getDefaultUserQuestionResponse(userQuestion, userName);
};

// Helper function for user question responses - MAKE SURE THIS EXISTS
// NEW: Call actual Groq API for analysis
const callAIAnalysisAPI = async (
  question: Question,
  answer: string,
  state: InterviewState,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis,
  userName: string = '',
  followUpCount: number = 0
) => {
  const apiUrl = '/api/analyze-answer'; // Your API route
  
  const requestBody = {
    question: question.question,
    answer: answer,
    questionType: question.type,
    difficulty: question.difficulty,
    category: question.category,
    userName: userName,
    followUpCount: followUpCount,
    isFollowUpResponse: followUpCount > 0,
    performanceScore: state.performanceScore,
    conversationContext: state.conversationContext.slice(-3),
    skillProficiency: state.skillProficiency,
    behavioralData: behavioralData || {},
    voiceData: voiceData || {}
  };

  console.log('Sending to AI API:', {
    questionType: question.type,
    answerLength: answer.length,
    followUpCount
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`API response error: ${response.status}`);
  }

  const analysis = await response.json();
  
  // Ensure we have valid data structure
  return {
    score: analysis.score || 70,
    contentScore: analysis.contentScore || analysis.score || 70,
    behavioralScore: analysis.behavioralScore || behavioralData?.score || 70,
    voiceScore: analysis.voiceScore || voiceData?.confidence || 70,
    strengths: analysis.strengths || ['Good engagement with the question'],
    improvements: analysis.improvements || ['Provide more specific examples'],
    suggestions: analysis.suggestions || ['Include measurable results in your answers'],
    skillAssessment: analysis.skillAssessment || generateSkillAssessment(
      analysis.contentScore || analysis.score || 70,
      analysis.behavioralScore || behavioralData?.score || 70,
      analysis.voiceScore || voiceData?.confidence || 70,
      question.type
    ),
    detailedFeedback: analysis.detailedFeedback || 'Thank you for your response. Please provide more specific examples from your experience.',
    confidenceLevel: analysis.confidenceLevel || analysis.score || 70,
    behavioralAnalysis: analysis.behavioralAnalysis || behavioralData || getFallbackBehavioralAnalysis(),
    voiceAnalysis: analysis.voiceAnalysis || voiceData || getFallbackVoiceAnalysis(),
    comprehensiveFeedback: analysis.comprehensiveFeedback || generateComprehensiveFeedback(
      analysis.contentScore || analysis.score || 70,
      analysis.behavioralScore || behavioralData?.score || 70,
      analysis.voiceScore || voiceData?.confidence || 70,
      { score: analysis.contentScore || analysis.score || 70 },
      behavioralData,
      voiceData
    ),
    interviewerResponse: analysis.interviewerResponse || 'Thank you for your answer. Let me ask a follow-up question to better understand your experience.',
    correctedAnswer: analysis.correctedAnswer || 'Try to include specific examples, measurable results, and your thought process in your responses.',
    expectedAnswer: analysis.expectedAnswer || 'An ideal response would include specific examples, measurable outcomes, clear problem-solving approach, and relevant experience details.',
    followUpQuestion: analysis.followUpQuestion || (followUpCount < 3 ? 'Could you provide a specific example to illustrate your point?' : null)
  };
};

// NEW: Handle user questions with AI
const handleUserQuestionWithAI = async (
  userQuestion: string,
  currentQuestion: Question,
  interviewState: InterviewState,
  userName: string = ''
): Promise<string> => {
  try {
    const response = await fetch('/api/analyze-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: currentQuestion.question,
        answer: '', // Empty since user is asking, not answering
        userQuestion: userQuestion,
        isUserQuestion: true,
        userName: userName,
        performanceScore: interviewState.performanceScore,
        conversationContext: interviewState.conversationContext
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.interviewerResponse || getDefaultUserQuestionResponse(userQuestion, userName);
    }
  } catch (error) {
    console.error('Error handling user question with AI:', error);
  }

  return getDefaultUserQuestionResponse(userQuestion, userName);
};

// Helper function for user question responses
const getDefaultUserQuestionResponse = (userQuestion: string, userName: string): string => {
  const lowerQuestion = userQuestion.toLowerCase();
  
  if (/repeat|say that again|didn't catch|missed that/i.test(lowerQuestion)) {
    return `Of course${userName ? `, ${userName}` : ''}. I'd be happy to repeat the question. Please listen carefully.`;
  }
  
  if (/clarify|explain|what do you mean|don't understand/i.test(lowerQuestion)) {
    return `I'd be happy to clarify${userName ? `, ${userName}` : ''}. Could you let me know which specific part you'd like me to explain in more detail?`;
  }
  
  return `Thank you for your question${userName ? `, ${userName}` : ''}. That shows good engagement. Let me address that before we continue.`;
};
// NEW: Content-based answer analysis function
const analyzeAnswerContent = async (
  question: Question,
  answer: string,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis,
  userName: string = '',
  followUpCount: number = 0,
  interviewState?: InterviewState
) => {
  // Calculate scores based on actual answer content
  const contentScore = calculateContentScore(answer, question);
  const behavioralScore = behavioralData?.score || 60;
  const voiceScore = voiceData?.confidence || 60;

  const overallScore = Math.round(
    (contentScore * 0.5) + 
    (behavioralScore * 0.3) + 
    (voiceScore * 0.2)
  );

  // Analyze answer quality for specific feedback
  const answerAnalysis = analyzeAnswerQuality(answer, question);
  
  // Generate follow-up questions based on answer gaps
  const followUpQuestion = generateContentBasedFollowUp(
    question, 
    answer, 
    answerAnalysis, 
    followUpCount,
    overallScore
  );

  const skillAssessment = generateSkillAssessment(
    contentScore,
    behavioralScore,
    voiceScore,
    question.type
  );

  const comprehensiveFeedback = generateComprehensiveFeedback(
    contentScore,
    behavioralScore,
    voiceScore,
    { score: contentScore },
    behavioralData,
    voiceData
  );

  const userPrefix = userName ? `${userName}, ` : '';
  
  // Generate feedback based on actual answer content
  const { feedback, interviewerResponse, correctedAnswer } = generateContentBasedFeedback(
    answerAnalysis,
    overallScore,
    userPrefix,
    followUpCount
  );

  return {
    score: overallScore,
    contentScore,
    behavioralScore,
    voiceScore,
    strengths: answerAnalysis.strengths,
    improvements: answerAnalysis.improvements,
    suggestions: answerAnalysis.suggestions,
    skillAssessment,
    detailedFeedback: feedback,
    confidenceLevel: overallScore,
    behavioralAnalysis: behavioralData || getFallbackBehavioralAnalysis(),
    voiceAnalysis: voiceData || getFallbackVoiceAnalysis(),
    comprehensiveFeedback,
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: answerAnalysis.expectedAnswer,
    followUpQuestion
  };
};

// NEW: Analyze answer quality based on content
const analyzeAnswerQuality = (answer: string, question: Question) => {
  const words = answer.trim().split(/\s+/);
  const wordCount = words.length;
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Check for specific content indicators
  const hasExamples = /example|for instance|such as|specifically|e\.g|in my experience/i.test(answer);
  const hasMetrics = /\d+%|\d+ hours|\d+ dollars|\d+ users|\d+ projects|\d+ years/i.test(answer);
  const hasStructure = /first|then|next|finally|because|therefore|however|although/i.test(answer);
  const hasOutcomes = /result|outcome|achieved|accomplished|saved|improved|increased|reduced|solved/i.test(answer);
  const hasProcess = /process|approach|method|steps|plan|strategy/i.test(answer);
  const hasChallenges = /challenge|difficult|problem|obstacle|setback|issue/i.test(answer);
  const hasLearnings = /learned|realized|understood|discovered|found out/i.test(answer);

  // Calculate content quality score
  let contentQuality = 0;
  if (wordCount > 100) contentQuality += 25;
  else if (wordCount > 60) contentQuality += 20;
  else if (wordCount > 30) contentQuality += 15;
  else if (wordCount > 15) contentQuality += 10;
  
  if (hasExamples) contentQuality += 20;
  if (hasMetrics) contentQuality += 15;
  if (hasStructure) contentQuality += 15;
  if (hasOutcomes) contentQuality += 15;
  if (hasProcess) contentQuality += 10;

  // Generate strengths and improvements
  const strengths: string[] = [];
  const improvements: string[] = [];
  const suggestions: string[] = [];

  if (wordCount > 60) strengths.push("Comprehensive response");
  else improvements.push("Provide more detailed answers");

  if (hasExamples) strengths.push("Good use of specific examples");
  else improvements.push("Include concrete examples from your experience");

  if (hasMetrics) strengths.push("Effective use of measurable results");
  else suggestions.push("Add quantifiable metrics to strengthen your answer");

  if (hasStructure) strengths.push("Well-structured response");
  else suggestions.push("Use clear structure (e.g., STAR method)");

  if (hasOutcomes) strengths.push("Clear focus on results and outcomes");
  else improvements.push("Emphasize the outcomes and impact of your actions");

  if (strengths.length === 0) {
    strengths.push("Engaged with the question");
  }

  // Generate expected answer based on question type
  let expectedAnswer = "An ideal response would include specific examples, measurable outcomes, clear problem-solving approach, and relevant experience details.";
  
  if (question.type === 'behavioral') {
    expectedAnswer = "Use the STAR method: Describe the Situation, Task, Action you took, and Results achieved with specific metrics.";
  } else if (question.type === 'technical') {
    expectedAnswer = "Explain your technical approach, tools/methods used, challenges faced, and measurable outcomes with specific examples.";
  } else if (question.type === 'problem-solving') {
    expectedAnswer = "Describe your problem-solving methodology, steps taken, alternatives considered, and the final solution with results.";
  }

  return {
    wordCount,
    hasExamples,
    hasMetrics,
    hasStructure,
    hasOutcomes,
    hasProcess,
    hasChallenges,
    hasLearnings,
    contentQuality,
    strengths,
    improvements,
    suggestions,
    expectedAnswer
  };
};

// NEW: Generate content-based follow-up questions
const generateContentBasedFollowUp = (
  question: Question,
  answer: string,
  analysis: any,
  followUpCount: number,
  score: number
): string | null => {
  // Don't generate follow-up if score is excellent and we've already asked some
  if (score >= 85 && followUpCount >= 1) {
    return null;
  }

  // Maximum 3 follow-ups per question
  if (followUpCount >= 3) {
    return null;
  }

  const followUps = [];

  // First follow-up: Ask for examples if missing
  if (followUpCount === 0 && !analysis.hasExamples) {
    followUps.push(
      "Could you provide a specific example from your experience that illustrates this?",
      "Can you share a real-world scenario where you applied this knowledge?",
      "What's a concrete example that demonstrates this in practice?"
    );
  }

  // Second follow-up: Ask for metrics or outcomes
  if (followUpCount === 1 && !analysis.hasMetrics) {
    followUps.push(
      "What were the measurable results or outcomes in that situation?",
      "Can you quantify the impact with specific numbers or percentages?",
      "What metrics would you use to measure success in this context?"
    );
  }

  // Third follow-up: Ask for process or challenges
  if (followUpCount === 2 && !analysis.hasProcess) {
    followUps.push(
      "Could you walk me through your specific approach or methodology?",
      "What challenges did you face and how did you overcome them?",
      "What alternative approaches did you consider and why?"
    );
  }

  // General follow-ups based on answer gaps
  if (followUps.length === 0) {
    if (!analysis.hasOutcomes) {
      followUps.push("What was the final outcome or result of this experience?");
    } else if (!analysis.hasLearnings) {
      followUps.push("What did you learn from this experience that you applied later?");
    } else if (!analysis.hasChallenges) {
      followUps.push("What were the main challenges you encountered and how did you address them?");
    } else {
      // Exploratory follow-up for good answers
      followUps.push(
        "How would you apply this approach in a different context?",
        "What would you do differently if you faced this situation today?",
        "How does this experience relate to the requirements of this role?"
      );
    }
  }

  return followUps.length > 0 ? followUps[Math.floor(Math.random() * followUps.length)] : null;
};

// NEW: Generate feedback based on answer content
const generateContentBasedFeedback = (
  analysis: any,
  score: number,
  userPrefix: string,
  followUpCount: number
) => {
  let feedback = '';
  let interviewerResponse = '';
  let correctedAnswer = '';

  if (score >= 85) {
    feedback = `${userPrefix}excellent response! You provided comprehensive details with specific examples and demonstrated strong communication skills.`;
    interviewerResponse = `${userPrefix}thank you for that outstanding answer. You clearly have deep expertise in this area.`;
    correctedAnswer = "Your answer was already strong. To make it even better, you could consider adding more specific metrics or discussing alternative approaches.";
  } else if (score >= 75) {
    feedback = `${userPrefix}very good response. You covered the main points well with relevant examples and good structure.`;
    interviewerResponse = `${userPrefix}thank you for that detailed answer. It gives me a clear picture of your capabilities.`;
    correctedAnswer = "Consider adding more specific metrics to quantify your achievements and emphasizing the key learnings from your experience.";
  } else if (score >= 65) {
    feedback = `${userPrefix}good response. You addressed the question appropriately. Consider adding more specific examples and measurable outcomes.`;
    interviewerResponse = `${userPrefix}thank you for your response. That helps me understand your approach.`;
    correctedAnswer = "Try to use the STAR method: Describe a specific Situation, the Task required, Actions you took, and Results achieved with numbers.";
  } else {
    feedback = `${userPrefix}your response was quite brief. In professional settings, it's important to provide comprehensive answers with specific examples, confident delivery, and professional body language.`;
    interviewerResponse = `${userPrefix}thank you for attempting the question. Let me ask a follow-up to help you provide more detail.`;
    correctedAnswer = "An improved answer would include: 1) A specific example from your experience, 2) Your step-by-step approach, 3) Measurable results or outcomes, 4) Key learnings or insights gained.";
  }

  // Add specific suggestions based on analysis
  if (!analysis.hasExamples && score < 80) {
    correctedAnswer += " Include concrete examples from your actual work experience to make your answer more credible and engaging.";
  }

  if (!analysis.hasMetrics && score < 80) {
    correctedAnswer += " Add quantifiable results like percentages, time saved, costs reduced, or performance improvements to demonstrate impact.";
  }

  return { feedback, interviewerResponse, correctedAnswer };
};

// NEW: Fallback content-based analysis
const generateContentBasedAnalysis = (
  question: Question,
  answer: string,
  behavioralData: BehavioralAnalysis,
  voiceData: VoiceAnalysis,
  userName: string = '',
  followUpCount: number = 0
) => {
  const analysis = analyzeAnswerQuality(answer, question);
  const contentScore = analysis.contentQuality;
  const behavioralScore = behavioralData.score;
  const voiceScore = voiceData.confidence;

  const overallScore = Math.round(
    (contentScore * 0.5) + 
    (behavioralScore * 0.3) + 
    (voiceScore * 0.2)
  );

  const followUpQuestion = generateContentBasedFollowUp(
    question, 
    answer, 
    analysis, 
    followUpCount,
    overallScore
  );

  const userPrefix = userName ? `${userName}, ` : '';
  const { feedback, interviewerResponse, correctedAnswer } = generateContentBasedFeedback(
    analysis,
    overallScore,
    userPrefix,
    followUpCount
  );

  return {
    score: overallScore,
    contentScore,
    behavioralScore,
    voiceScore,
    strengths: analysis.strengths,
    improvements: analysis.improvements,
    suggestions: analysis.suggestions,
    skillAssessment: generateSkillAssessment(contentScore, behavioralScore, voiceScore, question.type),
    detailedFeedback: feedback,
    confidenceLevel: overallScore,
    behavioralAnalysis: behavioralData,
    voiceAnalysis: voiceData,
    comprehensiveFeedback: generateComprehensiveFeedback(contentScore, behavioralScore, voiceScore, { score: contentScore }, behavioralData, voiceData),
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: analysis.expectedAnswer,
    followUpQuestion
  };
};

// NEW: Enhanced real analysis function with proper follow-up generation
const getEnhancedRealAnalysisWithFollowUps = async (
  question: Question,
  answer: string,
  behavioralData: BehavioralAnalysis,
  voiceData: VoiceAnalysis,
  userName: string = '',
  currentFollowUpCount: number = 0,
  interviewState?: InterviewState
) => {
  const hasUserSpoken = answer.trim().length > 0;
  const contentScore = calculateContentScore(answer, question);
  const behavioralScore = behavioralData.score;
  const voiceScore = calculateVoiceScore(voiceData, hasUserSpoken);

  const overallScore = Math.round(
    (contentScore * 0.5) + 
    (behavioralScore * 0.3) + 
    (voiceScore * 0.2)
  );

  const skillAssessment = generateSkillAssessment(
    contentScore,
    behavioralScore,
    voiceScore,
    question.type
  );

  const comprehensiveFeedback = generateComprehensiveFeedback(
    contentScore,
    behavioralScore,
    voiceScore,
    { score: contentScore },
    behavioralData,
    voiceData
  );

  const userPrefix = userName ? `${userName}, ` : '';
  
  let feedback = '';
  let interviewerResponse = '';
  let followUpQuestion = null;

  // ENHANCED: Better answer analysis and feedback generation
  const answerLower = answer.toLowerCase();
  
  // Analyze answer quality for follow-up decisions
  const isConfused = /don't understand|don't know|not sure|confused|can you repeat|what do you mean/i.test(answerLower);
  const isVague = /maybe|perhaps|probably|I think|I guess|kind of|sort of/i.test(answerLower);
  const isShort = answer.trim().split(/\s+/).length < 20;
  const lacksExamples = !/example|for instance|such as|specifically|in my experience/i.test(answerLower);
  const lacksStructure = !/first|then|next|finally|because|therefore|however/i.test(answerLower);
  const lacksMetrics = !/\d+%|\d+ hours|\d+ dollars|\d+ users|\d+ projects/i.test(answerLower);

  // Generate appropriate feedback based on answer quality
  if (isConfused) {
    feedback = `${userPrefix}I notice you seem unsure about this question. Let me clarify what I'm looking for and give you another chance to answer.`;
    interviewerResponse = `${userPrefix}I understand this might be challenging. Let me rephrase the question to make it clearer for you.`;
    followUpQuestion = generateClarificationFollowUp(question, answer);
  } 
  else if (overallScore >= 90 && currentFollowUpCount === 0) {
    feedback = `${userPrefix}excellent response! You provided comprehensive details with specific examples and demonstrated strong communication skills.`;
    interviewerResponse = `${userPrefix}thank you for that outstanding answer. You clearly have deep expertise in this area.`;
    // Even with high scores, ask one follow-up to explore depth
    if (currentFollowUpCount < 1) {
      followUpQuestion = generateExploratoryFollowUp(question, answer, overallScore);
    }
  } else if (overallScore >= 85) {
    feedback = `${userPrefix}that was a very good response. You covered the main points well with relevant examples and good delivery.`;
    interviewerResponse = `${userPrefix}thank you for that detailed answer. It gives me a clear picture of your capabilities.`;
    if (shouldAskFollowUp(overallScore, currentFollowUpCount)) {
      followUpQuestion = generateFirstFollowUp(question, answer, overallScore);
    }
  } else if (overallScore >= 75) {
    feedback = `${userPrefix}good response. You addressed the question appropriately. Consider improving your delivery and adding more specific examples.`;
    interviewerResponse = `${userPrefix}thank you for your response. That helps me understand your approach.`;
    if (shouldAskFollowUp(overallScore, currentFollowUpCount)) {
      followUpQuestion = generateFirstFollowUp(question, answer, overallScore);
    }
  } else if (overallScore >= 65) {
    feedback = `${userPrefix}you've made a good attempt. The response would be stronger with more specific details, better vocal delivery, and confident body language.`;
    interviewerResponse = `${userPrefix}I appreciate your answer. Let me ask a follow-up to better understand your experience.`;
    if (shouldAskFollowUp(overallScore, currentFollowUpCount)) {
      followUpQuestion = currentFollowUpCount === 0 ? 
        generateFirstFollowUp(question, answer, overallScore) : 
        generateSecondFollowUp(question, answer, overallScore);
    }
  } else {
    feedback = `${userPrefix}your response was quite brief. In professional settings, it's important to provide comprehensive answers with specific examples, confident delivery, and professional body language.`;
    interviewerResponse = `${userPrefix}thank you for attempting the question. Let me ask a follow-up to help you provide more detail.`;
    if (shouldAskFollowUp(overallScore, currentFollowUpCount)) {
      followUpQuestion = currentFollowUpCount === 0 ? 
        generateFirstFollowUp(question, answer, overallScore) :
        currentFollowUpCount === 1 ?
        generateSecondFollowUp(question, answer, overallScore) :
        generateThirdFollowUp(question, answer, overallScore);
    }
  }

  // ENHANCED: Generate more specific corrected answer based on actual response issues
  let correctedAnswer = "An improved answer would include specific examples, measurable results, clearer connections to the role requirements, confident vocal delivery, and professional body language.";
  
  if (isVague) {
    correctedAnswer = "Try to be more definitive in your responses. Instead of 'I think maybe...' say 'Based on my experience...' and provide concrete examples.";
  }
  if (lacksExamples) {
    correctedAnswer = "Include specific examples from your experience. For instance, instead of saying 'I handled projects,' say 'I managed a team of 5 on Project X which resulted in 20% efficiency improvement.'";
  }
  if (lacksStructure) {
    correctedAnswer = "Structure your answer clearly. Start with your main point, provide supporting evidence or examples, then conclude with the outcome or learning.";
  }
  if (lacksMetrics) {
    correctedAnswer = "Include measurable results when possible. Instead of 'improved performance,' say 'increased efficiency by 25%' or 'reduced costs by $50,000 annually.'";
  }

  return {
    score: overallScore,
    contentScore,
    behavioralScore,
    voiceScore,
    strengths: generateStrengths(contentScore, behavioralScore, voiceScore),
    improvements: generateImprovements(contentScore, behavioralScore, voiceScore),
    suggestions: [
      "Include specific metrics when possible",
      "Use concrete examples from your experience",
      "Explain your thought process clearly",
      "Highlight measurable outcomes and achievements"
    ],
    skillAssessment,
    detailedFeedback: feedback,
    confidenceLevel: overallScore,
    behavioralAnalysis: behavioralData,
    voiceAnalysis: voiceData,
    comprehensiveFeedback,
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: "An ideal response demonstrates expertise through specific examples, shows problem-solving methodology, highlights relevant outcomes with metrics, uses confident and clear communication, and maintains professional presence.",
    followUpQuestion
  };
};

// ENHANCED: Improved follow-up question generators with better context awareness


const generateClarificationFollowUp = (question: Question, answer: string): string => {
  const clarifications = [
    "Let me simplify that question for you. Could you tell me about a time when you faced a similar challenge and how you approached it?",
    "I understand this might be complex. Let me rephrase: What would be your first steps if you encountered this situation in your work?",
    "Let me make this clearer. Can you share an example from your past experience that relates to this topic?",
    "I'll break this down differently. What skills or knowledge would you apply to address this kind of problem?"
  ];
  return clarifications[Math.floor(Math.random() * clarifications.length)];
};

const generateExploratoryFollowUp = (question: Question, answer: string, score: number): string => {
  const followUps = [
    "That's very insightful. Could you tell me more about how you would apply this approach in a different context?",
    "Excellent answer. What would you say was the most challenging aspect of implementing this solution?",
    "Great perspective. How do you stay updated with the latest developments in this area?",
    "Very comprehensive. What advice would you give to someone just starting in this field?"
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
};

const generateFirstFollowUp = (question: Question, answer: string, score: number): string => {
  const followUps = [
    "Could you provide a specific example to illustrate your experience with this?",
    "Can you elaborate more on your thought process behind that approach?",
    "What were the measurable outcomes or results from that experience?",
    "How did you handle any obstacles or challenges you encountered?",
    "Could you walk me through a real-world scenario where you applied this knowledge?"
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
};

const generateSecondFollowUp = (question: Question, answer: string, score: number): string => {
  const followUps = [
    "I'd like to understand this better. Could you provide more details about your specific role and contributions?",
    "Can you give me a concrete example with specific numbers or metrics?",
    "What was the impact of your actions on the team or project?",
    "How does this experience relate to the requirements of this position?",
    "Could you break down your approach step by step for me?"
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
};

const generateThirdFollowUp = (question: Question, answer: string, score: number): string => {
  const followUps = [
    "Let me rephrase that - could you tell me more about your direct experience with this?",
    "I want to make sure I understand correctly. Could you provide a specific instance?",
    "What specific skills or knowledge did you gain from this experience?",
    "How would you apply what you learned to this role specifically?",
    "Could you share a bit more about the context and your specific responsibilities?"
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
};

// ENHANCED: Improved follow-up decision logic
const shouldAskFollowUp = (score: number, followUpCount: number): boolean => {
  // Always ask at least one follow-up for scores below 85
  if (followUpCount === 0 && score < 85) {
    return true;
  }
  
  // Ask second follow-up for scores below 75
  if (followUpCount === 1 && score < 75) {
    return true;
  }
  
  // Ask third follow-up for scores below 65
  if (followUpCount === 2 && score < 65) {
    return true;
  }
  
  // Maximum of 3 follow-ups
  return followUpCount < 3 && score < 85;
};

// Main Component with Enhanced Features
export default function EnhancedActiveInterviewPage() {
  const router = useRouter();
  
  // Basic state
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [profile, setProfile] = useState<InterviewProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string>('');
  const [useAI, setUseAI] = useState(true);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [isDynamicMode, setIsDynamicMode] = useState(true);
  const [interviewPhase, setInterviewPhase] = useState<'intro' | 'main' | 'closing'>('intro');
  const [userName, setUserName] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);

  // ENHANCED: Improved flow management with question chat states
  const [interviewFlow, setInterviewFlow] = useState<
    'welcome' | 
    'question-asked' | 
    'waiting-for-answer' | 
    'processing' | 
    'showing-feedback' | 
    'showing-corrected-answers' | 
    'asking-followup' |
    'proceeding-to-next' |
    'user-question' |
    'user-question-response' |
    'feedback-complete'
  >('welcome');
  
  const [pendingFollowUpQuestion, setPendingFollowUpQuestion] = useState<string | null>(null);
  const [isFollowUpRound, setIsFollowUpRound] = useState(false);
  const [currentInterviewerMessage, setCurrentInterviewerMessage] = useState<string>('');

  // ENHANCED: Improved state management for question chat
  const [showCorrectedAnswer, setShowCorrectedAnswer] = useState(false);
  const [currentCorrectedAnswer, setCurrentCorrectedAnswer] = useState('');
  const [currentExpectedAnswer, setCurrentExpectedAnswer] = useState('');
  const [currentQuestionScore, setCurrentQuestionScore] = useState<number>(0);
  const [comprehensiveFeedback, setComprehensiveFeedback] = useState<ComprehensiveFeedback | null>(null);

  // ENHANCED: Improved user question state with resume functionality
  const [currentUserQuestion, setCurrentUserQuestion] = useState<string>('');
  const [showUserQuestionInput, setShowUserQuestionInput] = useState<boolean>(false);
  const [userQuestionResponse, setUserQuestionResponse] = useState<string>('');
  const [isQuestionChatActive, setIsQuestionChatActive] = useState<boolean>(false);

  // Video Interviewer State
  const [isVideoInterviewerEnabled, setIsVideoInterviewerEnabled] = useState(true);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [shouldShowVideo, setShouldShowVideo] = useState(true);
  const [isUserAnswering, setIsUserAnswering] = useState(false);

  // Interview state - FIXED: Initialize with proper question counting
  const [interviewState, setInterviewState] = useState<InterviewState>({
    performanceScore: 0,
    skillProficiency: {},
    difficultyLevel: 'medium',
    answeredQuestions: 0,
    conversationContext: [],
    weakAreas: [],
    strongAreas: [],
    adaptiveInsights: [],
    interviewStage: 'introduction',
    currentFollowUpCount: 0,
    currentMainQuestionId: undefined,
    currentQuestionHasFollowUps: false
  });

  // Media state
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [cameraError, setCameraError] = useState<string>('');

  // Speech recognition state
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Track interview flow
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [hasAskedFirstQuestion, setHasAskedFirstQuestion] = useState(false);

  // Interview question limits - FIXED: Proper question counting
  const MAX_MAIN_QUESTIONS = 10;
  const MAX_FOLLOW_UPS_PER_QUESTION = 3;

  // ENHANCED: Improved answer submission with better feedback delivery
  // ENHANCED: Improved answer submission with better real-time data capture
// ENHANCED: Improved answer submission with better real-time data capture
// FIXED: Improved answer submission with proper feedback flow for ALL questions
// FIXED: Improved answer submission with proper feedback timing for ALL questions
// FIXED: Realistic interview flow with immediate feedback and quick follow-ups
const handleSubmitAnswer = async () => {
  if (!currentAnswer.trim() && recordedChunks.length === 0) {
    alert('Please provide an answer before proceeding');
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    setError('No current question found');
    return;
  }

  setInterviewFlow('processing');
  setIsAnalyzing(true);

  try {
    if (currentQuestion.type === 'introduction' && !userName) {
      const extractedName = extractUserName(currentAnswer);
      if (extractedName) {
        setUserName(extractedName);
      }
    }

    // Get real-time analysis data
    const currentAnalysis = realTimeAnalyzer.getCurrentAnalysis();
    
    let behavioralData: BehavioralAnalysis | undefined;
    let voiceData: VoiceAnalysis | undefined;

    if (mediaStream && isVideoEnabled && videoRef.current) {
      behavioralData = await analyzeBehaviorFromVideo(videoRef.current);
    } else {
      behavioralData = currentAnalysis.gestures ? {
        score: Math.round(
          (currentAnalysis.gestures.eyeContact * 0.25) +
          (currentAnalysis.gestures.posture * 0.20) +
          (currentAnalysis.gestures.gestures * 0.15) +
          (currentAnalysis.gestures.smiling * 0.15) +
          (currentAnalysis.gestures.attention * 0.25)
        ),
        eyeContact: currentAnalysis.gestures.eyeContact,
        posture: currentAnalysis.gestures.posture,
        gestures: currentAnalysis.gestures.gestures,
        facialExpressions: currentAnalysis.gestures.smiling,
        confidenceLevel: currentAnalysis.gestures.attention,
        engagement: currentAnalysis.gestures.eyeContact,
        professionalism: currentAnalysis.gestures.posture,
        analysis: {
          gazeDirection: [0.5, 0.5],
          headPose: [0, 0, 0],
          smileIntensity: currentAnalysis.gestures.smiling / 100,
          gestureFrequency: currentAnalysis.gestures.gestures / 100
        }
      } : getFallbackBehavioralAnalysis();
    }

    voiceData = currentAnalysis.voice;

    // Get REAL AI analysis immediately
    const analysis = await analyzeAnswerWithAI(
      currentQuestion, 
      currentAnswer, 
      interviewState,
      behavioralData,
      voiceData,
      userName || '',
      false,
      '',
      interviewState.currentFollowUpCount,
      mediaStream,
      isVideoEnabled
    );

    const answer: Answer = {
      questionId: currentQuestion.id,
      answer: currentAnswer,
      timestamp: new Date().toISOString(),
      score: analysis.score,
      aiEvaluation: analysis
    };

    if (recordedChunks.length > 0) {
      answer.audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
    }

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    setCurrentQuestionScore(analysis.score);
    
    // Set comprehensive feedback for display
    if (analysis.comprehensiveFeedback) {
      setComprehensiveFeedback(analysis.comprehensiveFeedback);
    }

    // Update interview state
    const newSkillProficiency = {
      ...interviewState.skillProficiency,
      ...analysis.skillAssessment
    };
    
    const mainQuestionsAnswered = updatedAnswers.filter(a => 
      !questions.find(q => q.id === a.questionId)?.isFollowUp
    ).length;
    
    const totalScore = updatedAnswers.reduce((acc, ans) => acc + (ans.score || 0), 0);
    const avgScore = updatedAnswers.length > 0 ? Math.round(totalScore / updatedAnswers.length) : 0;
    
    const newState: InterviewState = {
      ...interviewState,
      performanceScore: avgScore,
      answeredQuestions: mainQuestionsAnswered,
      conversationContext: [
        ...interviewState.conversationContext.slice(-3),
        `Q: ${currentQuestion.question.substring(0, 100)}... A: ${currentAnswer.substring(0, 100)}...`
      ],
      skillProficiency: newSkillProficiency,
    };
    setInterviewState(newState);

    // Check if interview should end
    if (shouldEndInterview(mainQuestionsAnswered)) {
      completeInterview(updatedAnswers, newSkillProficiency, avgScore, analysis);
      return;
    }

    // FIXED: Set BOTH types of feedback
    setCurrentFeedback(analysis.detailedFeedback); // This is for DISPLAY (assessment feedback)
    
    // FIXED: Immediate realistic flow
    setInterviewFlow('showing-feedback');
    
    // Set corrected answers for display
    setCurrentCorrectedAnswer(analysis.correctedAnswer);
    setCurrentExpectedAnswer(analysis.expectedAnswer);

    // FIXED: Speak ONLY the interviewer response (natural conversation)
    console.log('Interviewer speaking natural response:', analysis.interviewerResponse);
    await speakInterviewerMessage(analysis.interviewerResponse);

    // FIXED: Immediately decide on follow-up without long delays
    const shouldAskFollowUp = analysis.followUpQuestion && 
      interviewState.currentFollowUpCount < MAX_FOLLOW_UPS_PER_QUESTION &&
      !currentQuestion.isFollowUp;

    if (shouldAskFollowUp) {
      // Update follow-up count
      setInterviewState(prev => ({
        ...prev,
        currentFollowUpCount: prev.currentFollowUpCount + 1,
        currentQuestionHasFollowUps: true,
        currentMainQuestionId: currentQuestion.id
      }));

      setPendingFollowUpQuestion(analysis.followUpQuestion || null);
      setInterviewFlow('asking-followup');
      setIsUserAnswering(false);
      
      // FIXED: Ask follow-up question immediately after response
      console.log('Immediately asking follow-up:', analysis.followUpQuestion);
      setTimeout(() => {
        speakInterviewerMessage(analysis.followUpQuestion || '');
      }, 800); // Very short delay for natural flow
    } else {
      // FIXED: Show corrected answers briefly, then move to next
      setShowCorrectedAnswer(true);
      setInterviewFlow('showing-corrected-answers');
      
      // Brief pause to see corrections, then auto-proceed
      setTimeout(() => {
        setInterviewFlow('feedback-complete');
        setInterviewState(prev => ({
          ...prev,
          currentFollowUpCount: 0,
          currentQuestionHasFollowUps: false,
          currentMainQuestionId: undefined
        }));
      }, 3000); // Short 3-second pause for corrections
    }

  } catch (error) {
    console.error('Error processing answer:', error);
    setError(`Error processing answer: ${error}`);
    setInterviewFlow('waiting-for-answer');
  } finally {
    setIsAnalyzing(false);
  }
};

// FIXED: Realistic follow-up answer handling
const handleFollowUpAnswer = async () => {
  if (!currentAnswer.trim() && recordedChunks.length === 0) {
    alert('Please provide an answer to the follow-up question');
    return;
  }

  setInterviewFlow('processing');
  setIsAnalyzing(true);

  try {
    const followUpQuestion: Question = {
      id: `followup-${Date.now()}`,
      question: pendingFollowUpQuestion || 'Could you elaborate on that?',
      type: 'follow-up',
      difficulty: interviewState.difficultyLevel,
      category: questions[currentQuestionIndex]?.category || 'General',
      timeLimit: 120,
      fieldRelevant: true,
      followsUp: true,
      isFollowUp: true,
      parentQuestionId: interviewState.currentMainQuestionId || questions[currentQuestionIndex]?.id
    };

    // Get real-time analysis
    const currentAnalysis = realTimeAnalyzer.getCurrentAnalysis();
    
    let behavioralData: BehavioralAnalysis | undefined;
    let voiceData: VoiceAnalysis | undefined;

    if (mediaStream && isVideoEnabled && videoRef.current) {
      behavioralData = await analyzeBehaviorFromVideo(videoRef.current);
    }

    if (mediaStream && isMicEnabled) {
      const answerDuration = Math.max(10, currentAnswer.split(/\s+/).length / 3);
      voiceData = analyzeVoiceFromAudio(mediaStream, currentAnswer, answerDuration);
    }

    // Get REAL AI analysis for follow-up
    const analysis = await analyzeAnswerWithAI(
      followUpQuestion, 
      currentAnswer, 
      interviewState,
      behavioralData,
      voiceData,
      userName || '',
      false,
      '',
      interviewState.currentFollowUpCount,
      mediaStream,
      isVideoEnabled
    );

    const answer: Answer = {
      questionId: followUpQuestion.id,
      answer: currentAnswer,
      timestamp: new Date().toISOString(),
      score: analysis.score,
      aiEvaluation: analysis
    };

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    setCurrentQuestionScore(analysis.score);

    // Set comprehensive feedback
    if (analysis.comprehensiveFeedback) {
      setComprehensiveFeedback(analysis.comprehensiveFeedback);
    }

    const newSkillProficiency = {
      ...interviewState.skillProficiency,
      ...analysis.skillAssessment
    };
    
    const totalScore = updatedAnswers.reduce((acc, ans) => acc + (ans.score || 0), 0);
    const avgScore = updatedAnswers.length > 0 ? Math.round(totalScore / updatedAnswers.length) : interviewState.performanceScore;

    const newState: InterviewState = {
      ...interviewState,
      performanceScore: avgScore,
      skillProficiency: newSkillProficiency,
    };
    setInterviewState(newState);

    // Check if interview should end
    const mainQuestionsAnswered = updatedAnswers.filter(a => 
      !questions.find(q => q.id === a.questionId)?.isFollowUp
    ).length;
    
    if (shouldEndInterview(mainQuestionsAnswered)) {
      completeInterview(updatedAnswers, newSkillProficiency, avgScore, analysis);
      return;
    }

    setCurrentFeedback(analysis.detailedFeedback);
    setInterviewFlow('showing-feedback');
    
    setCurrentCorrectedAnswer(analysis.correctedAnswer);
    setCurrentExpectedAnswer(analysis.expectedAnswer);
    
    // FIXED: Speak natural interviewer response immediately
    await speakInterviewerMessage(analysis.interviewerResponse);

    // FIXED: Immediate decision for next follow-up or next question
    const shouldContinueFollowUp = analysis.followUpQuestion && 
      analysis.score < 85 && 
      interviewState.currentFollowUpCount < MAX_FOLLOW_UPS_PER_QUESTION;
          
    if (shouldContinueFollowUp) {
      // Update follow-up count
      setInterviewState(prev => ({
        ...prev,
        currentFollowUpCount: prev.currentFollowUpCount + 1
      }));

      // Ask next follow-up immediately
      setPendingFollowUpQuestion(analysis.followUpQuestion || null);
      setInterviewFlow('asking-followup');
      setIsUserAnswering(false);
      
      setTimeout(() => {
        speakInterviewerMessage(analysis.followUpQuestion || '');
      }, 800);
    } else {
      // Show corrections briefly, then move to next question
      setShowCorrectedAnswer(true);
      setInterviewFlow('showing-corrected-answers');
      
      setTimeout(() => {
        setInterviewFlow('feedback-complete');
        setInterviewState(prev => ({
          ...prev,
          currentFollowUpCount: 0,
          currentQuestionHasFollowUps: false,
          currentMainQuestionId: undefined
        }));
      }, 3000);
    }

  } catch (error) {
    console.error('Error processing follow-up answer:', error);
    setError(`Error processing follow-up answer: ${error}`);
    setInterviewFlow('asking-followup');
  } finally {
    setIsAnalyzing(false);
  }
};

// FIXED: Improved follow-up answer submission with complete feedback delivery


  // ENHANCED: Improved follow-up answer submission with voice feedback
 // ENHANCED: Improved follow-up answer submission with voice feedback



  

  // ENHANCED: Improved user question handling with resume functionality
 // ENHANCED: Improved user question handling with resume functionality
const handleUserQuestion = async (userQuestion: string) => {
  if (!userQuestion.trim()) return;

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return;

  // Save the current interview flow state before processing user question
  const previousFlowState = interviewFlow;
  
  setInterviewFlow('processing');
  setIsAnalyzing(true);
  setCurrentUserQuestion('');
  setIsQuestionChatActive(true);

  try {
    // REAL ANALYSIS: Analyze behavioral and voice data for user question context
    let behavioralData: BehavioralAnalysis | undefined;
    let voiceData: VoiceAnalysis | undefined;

    // Analyze behavior from video if available
    if (mediaStream && isVideoEnabled && videoRef.current) {
      behavioralData = await analyzeBehaviorFromVideo(videoRef.current);
    }

    // Analyze voice from audio stream
    if (mediaStream && isMicEnabled) {
      const questionDuration = Math.max(5, userQuestion.split(/\s+/).length / 3);
      voiceData = analyzeVoiceFromAudio(mediaStream, userQuestion, questionDuration);
    }

    // FIXED: Call analyzeAnswerWithAI with ALL required parameters
    const analysis = await analyzeAnswerWithAI(
      currentQuestion,
      '', // Empty answer since user is asking, not answering
      interviewState,
      behavioralData,
      voiceData,
      userName || '',
      true, // isUserQuestion flag
      userQuestion,
      interviewState.currentFollowUpCount,
      mediaStream,  // ADD THIS
      isVideoEnabled  // ADD THIS
    );

    // Update interview state with the analysis of user's question behavior
    if (analysis.score > 0) {
      const newSkillProficiency = {
        ...interviewState.skillProficiency,
        ...analysis.skillAssessment
      };
      
      const updatedAnswers = [...answers];
      const totalScore = updatedAnswers.reduce((acc, ans) => acc + (ans.score || 0), 0);
      const avgScore = updatedAnswers.length > 0 ? Math.round(totalScore / updatedAnswers.length) : interviewState.performanceScore;

      setInterviewState(prev => ({
        ...prev,
        performanceScore: avgScore,
        skillProficiency: newSkillProficiency,
      }));
    }

    setUserQuestionResponse(analysis.interviewerResponse);
    setShowUserQuestionInput(false);
    
    // Set comprehensive feedback if available
    if (analysis.comprehensiveFeedback) {
      setComprehensiveFeedback(analysis.comprehensiveFeedback);
    }
    
    // Set the flow to user question response
    setInterviewFlow('user-question-response');
    
    // Speak the interviewer's response with real analysis context
    setTimeout(() => {
      speakInterviewerMessage(analysis.interviewerResponse);
    }, 1000);

  } catch (error) {
    console.error('Error processing user question:', error);
    setError('Error processing your question');
    // Restore previous flow state on error
    setInterviewFlow(previousFlowState === 'processing' ? 'waiting-for-answer' : previousFlowState);
  } finally {
    setIsAnalyzing(false);
  }
};
  // ENHANCED: Resume interview function
 // ENHANCED: Resume interview function
  const handleResumeInterview = () => {
    setIsQuestionChatActive(false);
    setUserQuestionResponse('');
    setShowUserQuestionInput(false);
    
    // Determine the correct question to resume with
    const currentQuestion = questions[currentQuestionIndex];
    
    // If there's a pending follow-up, resume with follow-up flow
    if (pendingFollowUpQuestion) {
      setInterviewFlow('asking-followup');
      setTimeout(() => {
        speakInterviewerMessage(`Let's continue. ${pendingFollowUpQuestion}`);
      }, 500);
    } 
    // Otherwise, resume with the current main question
    else if (currentQuestion) {
      setInterviewFlow('question-asked');
      setTimeout(() => {
        speakInterviewerMessage(`Let's continue with our interview. ${currentQuestion.question}`);
        // Transition to waiting for answer after speaking
        setTimeout(() => {
          setInterviewFlow('waiting-for-answer');
        }, 3000);
      }, 500);
    }
  };

  // Handle skip follow-up - FIXED: Proper flow transition
  const handleSkipFollowUp = () => {
  // Reset follow-up state
  setPendingFollowUpQuestion(null);
  setIsFollowUpRound(false);
  setCurrentAnswer('');
  setRecordedChunks([]);
  
  // Reset follow-up count for next question
  setInterviewState(prev => ({
    ...prev,
    currentFollowUpCount: 0,
    currentQuestionHasFollowUps: false,
    currentMainQuestionId: undefined
  }));

  // Automatically proceed to next question
  setInterviewFlow('proceeding-to-next');
  
  // Show the next question after a brief delay
  setTimeout(() => {
    handleProceedToNextQuestion();
  }, 1000);
};

  // Skip to next question without answering
  const handleSkipQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Create a skip answer
    const skipAnswer: Answer = {
      questionId: currentQuestion.id,
      answer: "[Skipped]",
      timestamp: new Date().toISOString(),
      score: 0,
      aiEvaluation: {
        strengths: ["Willing to proceed"],
        improvements: ["Consider providing answers to all questions for better assessment"],
        suggestions: ["Try to answer each question to demonstrate your knowledge and skills"],
        skillAssessment: {
          'Communication': 10,
          'Problem Solving': 10,
          'Technical Knowledge': 10,
          'Confidence': 20,
          'Professionalism': 30
        },
        detailedFeedback: "You chose to skip this question. In a real interview, it's better to attempt an answer even if you're unsure.",
        confidenceLevel: 20,
        interviewerResponse: "I understand you'd like to move on. Let's proceed to the next question.",
        correctedAnswer: "In the future, try to provide at least a basic answer showing your thought process.",
        expectedAnswer: "A good response would demonstrate your approach to unfamiliar questions.",
        followUpQuestion:""
      }
    };

    const updatedAnswers = [...answers, skipAnswer];
    setAnswers(updatedAnswers);

    // Reset follow-up count and proceed to next question
    setInterviewState(prev => ({
      ...prev,
      currentFollowUpCount: 0,
      currentQuestionHasFollowUps: false,
      currentMainQuestionId: undefined
    }));

    setInterviewFlow('proceeding-to-next');
    setIsUserAnswering(false);
    
    setTimeout(() => {
      handleProceedToNextQuestion();
    }, 1000);
  };

  // Initialize real-time analyzer
  useEffect(() => {
    const initializeAnalyzer = async () => {
      await realTimeAnalyzer.initialize();
    };

    initializeAnalyzer();

    return () => {
      realTimeAnalyzer.stopAnalysis();
    };
  }, []);

  // Start real-time analysis when media is available
  useEffect(() => {
    if (mediaStream && videoRef.current && interviewStarted) {
      const timer = setTimeout(() => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          realTimeAnalyzer.startRealTimeAnalysis(videoRef.current, mediaStream);
        }
      }, 1000);

      return () => {
        clearTimeout(timer);
        realTimeAnalyzer.stopAnalysis();
      };
    }

    return () => {
      realTimeAnalyzer.stopAnalysis();
    };
  }, [mediaStream, interviewStarted]);

  // Enhanced speech recognition to update voice metrics
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        let speechStartTime = Date.now();
        
        recognition.onstart = () => {
          speechStartTime = Date.now();
          realTimeAnalyzer.resetUserSpeech(); // Reset analysis when new speech starts
        };
        
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript;
            }
          }
          
          setCurrentAnswer(prev => prev + ' ' + transcript);
          
          const duration = (Date.now() - speechStartTime) / 1000;
          if (transcript.trim().length > 0) {
            realTimeAnalyzer.updateSpeechMetrics(transcript, duration);
          }
          
          if (!isUserAnswering && transcript.trim().length > 0) {
            setIsUserAnswering(true);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsSpeechRecognitionActive(false);
        };
        
        setSpeechRecognition(recognition);
        speechRecognitionRef.current = recognition;
      }
    }
  }, [isUserAnswering]);

  // Effect to detect when user starts typing
  useEffect(() => {
    if (!isUserAnswering && currentAnswer.trim().length > 0) {
      setIsUserAnswering(true);
    }
  }, [currentAnswer, isUserAnswering]);

  // Effect to reset answering state when question changes or AI starts speaking
  useEffect(() => {
    if (isInterviewerSpeaking) {
      setIsUserAnswering(false);
    }
    
    if (interviewFlow === 'waiting-for-answer' && currentQuestionIndex >= 0 && !isInterviewerSpeaking) {
      setIsUserAnswering(false);
    }
  }, [interviewFlow, currentQuestionIndex, isInterviewerSpeaking]);

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (isSpeechRecognitionActive) {
      speechRecognitionRef.current.stop();
      setIsSpeechRecognitionActive(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsSpeechRecognitionActive(true);
        setIsUserAnswering(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  // Load interview data from localStorage - FIXED: Proper question initialization
  useEffect(() => {
    setMounted(true);
    
    const loadInterviewData = () => {
      try {
        const activeInterview = localStorage.getItem('activeInterview');
        const interviewProfile = localStorage.getItem('interviewProfile');
        
        if (!activeInterview || !interviewProfile) {
          setError('No active interview found. Please create an interview first.');
          setLoading(false);
          return;
        }

        const interviewData: ActiveInterview = JSON.parse(activeInterview);
        const profileData: InterviewProfile = JSON.parse(interviewProfile);

        setProfile(profileData);
        
        // FIXED: Generate proper initial questions starting from question 1
        if (!interviewData.questions || interviewData.questions.length === 0) {
          const initialQuestions = generateInitialQuestions(profileData);
          setQuestions(initialQuestions);
          setCurrentQuestionIndex(0);
          setQuestionTimeLeft(initialQuestions[0]?.timeLimit || 180);
        } else {
          setQuestions(interviewData.questions);
          setCurrentQuestionIndex(interviewData.currentQuestionIndex || 0);
          setQuestionTimeLeft(interviewData.questions[interviewData.currentQuestionIndex || 0]?.timeLimit || 180);
        }
        
        setAnswers(interviewData.answers || []);
        setIsDynamicMode(true);
        setInterviewStarted(true);

        const initialSkills: { [key: string]: number } = {};
        
        (profileData.skills || []).forEach((skill: string) => {
          initialSkills[skill] = 0;
        });
        
        initialSkills['Communication'] = 0;
        initialSkills['Problem Solving'] = 0;
        initialSkills['Technical Knowledge'] = 0;
        initialSkills['Confidence'] = 0;
        initialSkills['Algorithms'] = 0;
        
        const existingAnswers = interviewData.answers || [];
        
        // FIXED: Count only main questions for progress
        const mainQuestionsAnswered = existingAnswers.filter(a => 
          !interviewData.questions.find(q => q.id === a.questionId)?.isFollowUp
        ).length;
        
        const actualPerformanceScore = existingAnswers.length > 0 ? 
          Math.round(existingAnswers.reduce((acc: number, ans: Answer) => acc + (ans.score || 0), 0) / existingAnswers.length) : 0;

        setInterviewState(prev => ({
          ...prev,
          skillProficiency: initialSkills,
          answeredQuestions: mainQuestionsAnswered,
          performanceScore: actualPerformanceScore,
          currentFollowUpCount: 0,
          currentQuestionHasFollowUps: false,
          currentMainQuestionId: undefined
        }));

      } catch (error) {
        console.error('Error loading interview data:', error);
        setError('Failed to load interview data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadInterviewData();
  }, []);




  // Interview flow initialization - FIXED: Proper welcome flow
 // FIXED: Improved welcome flow with proper timing
useEffect(() => {
  if (interviewStarted && questions.length > 0 && !hasWelcomed && !isInterviewerSpeaking) {
    const welcomeMessage = `Welcome to your Talkgenious AI assessment! I'll be presenting questions to evaluate your knowledge and problem-solving abilities. Let's begin with your first question.`;
    
    setHasWelcomed(true);
    speakInterviewerMessage(welcomeMessage);
    
    // FIXED: Proper timing for first question
    const welcomeDuration = Math.max(4000, (welcomeMessage.split(' ').length / 3) * 1000);
    
    setTimeout(() => {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        setHasAskedFirstQuestion(true);
        setInterviewFlow('question-asked');
        
        // Speak the first question
        speakInterviewerMessage(currentQuestion.question);
        
        // Set timeout to move to waiting for answer after question is spoken
        const questionDuration = Math.max(3000, (currentQuestion.question.split(' ').length / 3) * 1000);
        
        setTimeout(() => {
          setInterviewFlow('waiting-for-answer');
          setQuestionTimeLeft(currentQuestion.timeLimit || 180);
        }, questionDuration);
      }
    }, welcomeDuration);
  }
}, [interviewStarted, questions, currentQuestionIndex, hasWelcomed, isInterviewerSpeaking]);




  // ENHANCED: Improved interviewer speaking with better timing
  // ENHANCED: Improved speech function that speaks ALL content
// FIXED: Improved speech function with proper timing
// FIXED: Improved speech function with proper completion detection
// Improved immediate speech function
const speakInterviewerMessage = async (message: string): Promise<void> => {
  if (!isSpeakerEnabled) return;

  return new Promise((resolve) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any previous speech
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        setIsInterviewerSpeaking(false);
        resolve();
      };
      
      utterance.onerror = () => {
        setIsInterviewerSpeaking(false);
        resolve();
      };
      
      setIsInterviewerSpeaking(true);
      setCurrentInterviewerMessage(message);
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback: resolve immediately if no speech synthesis
      setIsInterviewerSpeaking(false);
      resolve();
    }
  });
};
  // Generate initial questions based on profile - FIXED: Start from proper question 1
  const generateInitialQuestions = (profileData: InterviewProfile): Question[] => {
    const introQuestions: Question[] = [
      {
        id: 'intro-1',
        question: `Hello and welcome! I'm Alex from the hiring team at ${profileData.companyName || 'our company'}. Thank you for taking the time to interview for the ${profileData.jobTitle} position. Could you please start by introducing yourself and telling me a bit about your background?`,
        type: 'introduction',
        difficulty: 'easy',
        category: 'Introduction',
        timeLimit: 180,
        fieldRelevant: true
      },
      {
        id: 'intro-2',
        question: `Nice to meet you. What interests you about this ${profileData.jobTitle} role, and why do you believe you would be a good fit for our team?`,
        type: 'introduction',
        difficulty: 'easy',
        category: 'Motivation',
        timeLimit: 120,
        fieldRelevant: true
      }
    ];

    const skillQuestions: Question[] = (profileData.skills || []).slice(0, 3).map((skill, index) => ({
      id: `skill-${index + 1}`,
      question: `I see you've listed ${skill} as one of your key skills. Could you tell me about your experience with this and provide a specific example of how you've used ${skill} in a professional setting?`,
        type: 'skill-assessment',
        difficulty: 'medium',
        category: skill,
        timeLimit: 180,
        fieldRelevant: true,
        skillFocus: [skill]
    }));

    // Add more diverse question types
    const problemSolvingQuestions: Question[] = [
      {
        id: 'problem-1',
        question: `Describe a challenging problem you faced in your previous role and walk me through how you approached solving it.`,
        type: 'problem-solving',
        difficulty: 'medium',
        category: 'Problem Solving',
        timeLimit: 180,
        fieldRelevant: true
      },
      {
        id: 'behavioral-1',
        question: `Tell me about a time you had to work with a difficult team member. How did you handle the situation and what was the outcome?`,
        type: 'behavioral',
        difficulty: 'medium',
        category: 'Teamwork',
        timeLimit: 150,
        fieldRelevant: true
      }
    ];

    return [...introQuestions, ...skillQuestions, ...problemSolvingQuestions].slice(0, 8); // Start with 8 questions
  };

  // Extract user name from introduction answer
  const extractUserName = (answer: string): string => {
    const patterns = [
      /my name is (\w+)/i,
      /i am (\w+)/i,
      /i'm (\w+)/i,
      /call me (\w+)/i,
      /^(\w+) here/i,
      /this is (\w+)/i
    ];
    
    for (const pattern of patterns) {
      const match = answer.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return '';
  };

  // Check if interview should end - FIXED: Proper end condition
  const shouldEndInterview = (currentMainQuestionsCount: number): boolean => {
    if (currentMainQuestionsCount >= MAX_MAIN_QUESTIONS) {
      return true;
    }
    
    if (currentMainQuestionsCount >= 8 && interviewState.performanceScore >= 80) {
      return true;
    }
    
    return false;
  };

  // Proceed to next question - FIXED: Proper question progression
// In handleProceedToNextQuestion, fix the question flow:
// FIXED: Improved next question flow with proper state reset
const handleProceedToNextQuestion = async () => {
  // Reset all answer-related states
  setCurrentAnswer('');
  setRecordedChunks([]);
  setCurrentFeedback('');
  setIsFollowUpRound(false);
  setPendingFollowUpQuestion(null);
  setIsUserAnswering(false);
  setComprehensiveFeedback(null);
  setShowCorrectedAnswer(false);
  setShowUserQuestionInput(false);
  setUserQuestionResponse('');
  setIsQuestionChatActive(false);
  
  // Count main questions for proper end condition
  const mainQuestionsAnswered = answers.filter(a => 
    !questions.find(q => q.id === a.questionId)?.isFollowUp
  ).length;
  
  if (shouldEndInterview(mainQuestionsAnswered)) {
    completeInterview(answers, interviewState.skillProficiency, interviewState.performanceScore, answers[answers.length - 1]?.aiEvaluation);
    return;
  }

  const shouldContinue = (currentQuestionIndex < questions.length - 1 || 
                       (isDynamicMode && mainQuestionsAnswered < MAX_MAIN_QUESTIONS)) &&
                       mainQuestionsAnswered < MAX_MAIN_QUESTIONS;

  if (shouldContinue && !interviewCompleted) {
    let nextQuestion: Question | null = null;
    
    // Use existing questions first, then generate dynamic ones
    if (currentQuestionIndex < questions.length - 1) {
      // Use next existing question
      setCurrentQuestionIndex(prev => prev + 1);
      const existingNextQuestion = questions[currentQuestionIndex + 1];
      if (existingNextQuestion) {
        setQuestionTimeLeft(existingNextQuestion.timeLimit || 180);
        
        // FIXED: Proper question flow with speaking
        setInterviewFlow('question-asked');
        setTimeout(() => {
          speakInterviewerMessage(existingNextQuestion.question);
          
          const questionDuration = Math.max(3000, (existingNextQuestion.question.split(' ').length / 3) * 1000);
          setTimeout(() => {
            setInterviewFlow('waiting-for-answer');
          }, questionDuration);
        }, 1000);
        return;
      }
    } else if (isDynamicMode) {
      // Generate only ONE dynamic question
      console.log('Generating single dynamic question...');
      nextQuestion = await generateDynamicNextQuestion();
    }
    
    if (nextQuestion) {
      const updatedQuestions = [...questions, nextQuestion];
      setQuestions(updatedQuestions);
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionTimeLeft(nextQuestion.timeLimit || 180);
      
      // FIXED: Proper question flow with speaking
      setInterviewFlow('question-asked');
      setTimeout(() => {
        speakInterviewerMessage(nextQuestion!.question);
        
        const questionDuration = Math.max(3000, (nextQuestion!.question.split(' ').length / 3) * 1000);
        setTimeout(() => {
          setInterviewFlow('waiting-for-answer');
        }, questionDuration);
      }, 1000);
    } else {
      // Fallback: use existing questions or complete
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        const nextQuestion = questions[currentQuestionIndex + 1];
        if (nextQuestion) {
          setQuestionTimeLeft(nextQuestion.timeLimit || 180);
          
          setInterviewFlow('question-asked');
          setTimeout(() => {
            speakInterviewerMessage(nextQuestion.question);
            
            const questionDuration = Math.max(3000, (nextQuestion.question.split(' ').length / 3) * 1000);
            setTimeout(() => {
              setInterviewFlow('waiting-for-answer');
            }, questionDuration);
          }, 1000);
        }
      } else {
        completeInterview(answers, interviewState.skillProficiency, interviewState.performanceScore, answers[answers.length - 1]?.aiEvaluation);
      }
    }
  } else {
    completeInterview(answers, interviewState.skillProficiency, interviewState.performanceScore, answers[answers.length - 1]?.aiEvaluation);
  }
};
  // Generate dynamic next question
  // REPLACE your generateDynamicNextQuestion function:
const generateDynamicNextQuestion = async (): Promise<Question | null> => {
  if (!isDynamicMode) return null;
  
  try {
    setIsGeneratingNext(true);
    
    const lastQuestion = questions[currentQuestionIndex];
    const lastAnswer = answers[answers.length - 1];
    
    // Add delay to prevent rapid question generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Generating dynamic question based on:', {
      lastQuestionType: lastQuestion?.type,
      lastAnswerScore: lastAnswer?.score,
      performanceScore: interviewState.performanceScore
    });

    const response = await fetch('/api/generate-next-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobTitle: profile?.jobTitle || '',
        fieldCategory: profile?.fieldCategory || '',
        experience: profile?.experience || '',
        skills: profile?.skills || [],
        currentQuestionIndex: currentQuestionIndex,
        lastQuestion: lastQuestion?.question || '',
        lastAnswer: lastAnswer?.answer || '',
        answerScore: lastAnswer?.score || 0,
        performanceScore: interviewState.performanceScore,
        difficultyLevel: interviewState.difficultyLevel,
        userName: userName || '',
        assessmentType: profile?.assessmentType || 'default',
        isFollowUp: false,
        // Add conversation context to maintain continuity
        conversationContext: interviewState.conversationContext.slice(-2)
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.warn('Dynamic question generation failed with status:', response.status);
      return null;
    }

    const result = await response.json();
    
    if (result.success && result.question) {
      console.log('✅ Successfully generated dynamic question');
      return {
        id: `dynamic-${Date.now()}`,
        question: result.question.question,
        type: result.question.type || 'technical',
        difficulty: result.question.difficulty || 'medium',
        category: result.question.category || 'Technical',
        timeLimit: result.question.timeLimit || 180,
        fieldRelevant: true,
        skillFocus: result.question.skillFocus || ['Problem Solving']
      };
    }
    
    console.warn('Dynamic question generation returned no question');
    return null;
  } catch (error) {
if (error instanceof Error && error.name === 'TimeoutError') {      console.warn('Dynamic question generation timed out');
    } else {
      console.warn('Dynamic question generation error:', error);
    }
    return null;
  } finally {
    setIsGeneratingNext(false);
  }
};

  // Generate fallback question
  const generateFallbackQuestion = (): Question => {
    const weakSkills = Object.entries(interviewState.skillProficiency)
      .filter(([_, score]) => score < 60)
      .map(([skill]) => skill);
    
    const followUpSkill = weakSkills.length > 0 ? weakSkills[0] : profile?.skills?.[0] || 'your skills';
    const userNamePrefix = userName ? `${userName}, ` : '';
    
    return {
      id: `fallback-${Date.now()}`,
      question: `${userNamePrefix}could you tell me more about your experience with ${followUpSkill}?`,
      type: 'skill-assessment',
      difficulty: 'medium',
      category: followUpSkill,
      timeLimit: 150,
      fieldRelevant: true,
      skillFocus: [followUpSkill]
    };
  };

  // Complete interview function
  const completeInterview = (
    updatedAnswers: Answer[], 
    newSkillProficiency: { [key: string]: number }, 
    avgScore: number, 
    analysis: any
  ) => {
    setInterviewCompleted(true);
    setInterviewFlow('waiting-for-answer');
    setShowCorrectedAnswer(false);
    
    const topSkills = Object.entries(newSkillProficiency)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([skill]) => skill);

    const assessmentName = 'Talkgenious AI Roleplay Assessment Platform';

    const completedInterview = {
      profile,
      questions,
      startTime: new Date().toISOString(),
      currentQuestionIndex: currentQuestionIndex + 1,
      answers: updatedAnswers,
      isActive: false,
      type: isDynamicMode ? 'dynamic-ai-interview' : 'smart-field-specific',
      endTime: new Date().toISOString(),
      totalScore: avgScore,
      duration: timeElapsed,
      summary: {
        strengths: analysis?.strengths || ['Good communication skills'],
        improvements: analysis?.improvements || ['Could use more specific examples'],
        overallFeedback: analysis?.detailedFeedback || 'Solid performance with room for improvement'
      }
    };
    
    localStorage.setItem('completedInterview', JSON.stringify(completedInterview));
    localStorage.removeItem('activeInterview');

    window.dispatchEvent(new Event('interviewCompleted'));
    localStorage.setItem('interviewUpdated', Date.now().toString());

    const finalMessage = analysis?.interviewerResponse || 
      `Thank you for completing the ${assessmentName} session${userName ? `, ${userName}` : ''}. Your overall performance score is ${avgScore} percent. ` +
      `Your strongest areas were ${topSkills.join(', ')}.`;
    
    speakInterviewerMessage(finalMessage);

    setTimeout(() => {
      alert(`${assessmentName} Complete!
      
Final Score: ${avgScore}%
Questions Answered: ${updatedAnswers.filter(a => !questions.find(q => q.id === a.questionId)?.isFollowUp).length}
Top Skills: ${topSkills.join(', ')}
Assessment Type: ${isDynamicMode ? 'AI-Powered Dynamic' : 'Standard'}

${avgScore >= 80 ? 'Outstanding performance!' : 
  avgScore >= 70 ? 'Strong performance with growth opportunities.' :
  'Consider practicing with more detailed examples and specific scenarios.'}

Thank you for participating!`);
    }, 3000);
  };

  // Fixed media initialization with better error handling
  const initializeMedia = async () => {
    try {
      setCameraError('');
      
      const constraints = {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (stream) {
        setMediaStream(stream);
        setHasMediaPermissions(true);
        setIsVideoEnabled(true);
        setIsMicEnabled(true);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(console.warn);
          };
        }
        
        return true;
      }
    } catch (error: any) {
      console.error('Media access error:', error);
      setHasMediaPermissions(false);
      
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera/microphone access denied. Please allow permissions in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found. Please check your camera connection.');
      } else {
        setCameraError('Unable to access camera/microphone. Please check your device permissions.');
      }
      
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaStream(audioStream);
        setIsMicEnabled(true);
        return true;
      } catch (audioError) {
        console.warn('Audio access also failed:', audioError);
        return false;
      }
    }
  };

  // Toggle camera on/off
  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  // Toggle microphone
  const toggleMicrophone = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicEnabled;
        setIsMicEnabled(!isMicEnabled);
      }
    }
  };

  // Recording functions
  const startRecording = async () => {
    if (!mediaStream || !isMicEnabled) {
      alert('Microphone not available');
      return;
    }

    try {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }

      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio tracks available');
      }

      const audioStream = new MediaStream();
      audioTracks.forEach(track => audioStream.addTrack(track));

      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;
      setRecordedChunks([]);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.start(500);
      setIsRecording(true);
      setIsUserAnswering(true);

    } catch (error) {
      console.error('Recording error:', error);
      alert('Unable to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!interviewStarted || interviewFlow !== 'waiting-for-answer') return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
      if (questionTimeLeft !== null && questionTimeLeft > 0) {
        setQuestionTimeLeft(prev => prev !== null ? prev - 1 : null);
      } else if (questionTimeLeft === 0) {
        if (currentAnswer.trim() || recordedChunks.length > 0) {
          if (pendingFollowUpQuestion) {
            handleFollowUpAnswer();
          } else {
            handleSubmitAnswer();
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewStarted, questionTimeLeft, currentAnswer, interviewFlow, pendingFollowUpQuestion]);

  // Initialize media when component mounts
  useEffect(() => {
    if (interviewStarted && profile) {
      initializeMedia();
    }
  }, [interviewStarted, profile]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current interview stage text
  const getInterviewStageText = () => {
    switch (interviewState.interviewStage) {
      case 'introduction': return 'Introduction';
      case 'skill-assessment': return 'Skill Assessment';
      case 'technical-evaluation': return 'Technical Evaluation';
      case 'behavioral-assessment': return 'Behavioral Assessment';
      case 'closing': return 'Closing';
      default: return 'Assessment in Progress';
    }
  };

  // Get assessment type display name
  const getAssessmentDisplayName = () => {
    return 'TalkGenius AI Roleplay Assessment Platform ';
  };

  // Get current action text based on flow state - FIXED: Added new flow states
  const getCurrentActionText = () => {
    switch (interviewFlow) {
      case 'welcome':
        return 'Welcome message...';
      case 'question-asked':
        return 'Interviewer is asking question...';
      case 'waiting-for-answer':
        return pendingFollowUpQuestion ? 'Answer the follow-up question' : 'Answer the question';
      case 'processing':
        return 'AI is analyzing your response...';
      case 'showing-feedback':
        return 'Reviewing feedback...';
      case 'showing-corrected-answers':
        return 'Review suggested improvements';
      case 'asking-followup':
        return 'Follow-up question';
      case 'proceeding-to-next':
        return 'Moving to next question...';
      case 'user-question':
        return 'Asking interviewer a question...';
      case 'user-question-response':
        return 'Interviewer is responding to your question...';
      case 'feedback-complete':
        return 'Ready for next question';
      default:
        return 'Ready for your response';
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (loading && !interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Talkgenious assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/dashboard/interview/create')}>
            Create New Assessment
          </Button>
        </div>
      </div>
    );
  }

  if (interviewCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Completed!</h2>
          <p className="text-gray-600 mb-6">
            Your {isDynamicMode ? 'AI-powered dynamic' : 'smart'} Talkgenious session has been completed successfully.
          </p>
          <div className="space-y-3">
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => router.push('/dashboard/interview/create')}
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              Create New Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Brain className="h-8 w-8 text-blue-600" />
                {getAssessmentDisplayName()}
                <span className="text-sm bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1 rounded-full ml-2">
                  {profile?.fieldCategory || 'Professional'}
                </span>
                {isDynamicMode && (
                  <span className="text-xs bg-gradient-to-r from-green-100 to-teal-100 text-green-800 px-2 py-1 rounded-full ml-1 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    AI DYNAMIC
                  </span>
                )}
              </h1>
              {profile && (
                <p className="text-gray-600 mt-1">
                  {profile.jobTitle || getAssessmentDisplayName()} • {profile.experience}
                  {userName && ` • Participant: ${userName}`}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {getInterviewStageText()}
                </div>
                <div className="text-xs text-gray-500">
                  {/* FIXED: Show proper question count */}
                  Main Question {interviewState.answeredQuestions + 1} of {MAX_MAIN_QUESTIONS}
                  {interviewState.currentFollowUpCount > 0 && ` • Follow-up ${interviewState.currentFollowUpCount} of ${MAX_FOLLOW_UPS_PER_QUESTION}`}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  interviewFlow === 'welcome' ? 'bg-blue-100 text-blue-800' :
                  interviewFlow === 'question-asked' ? 'bg-purple-100 text-purple-800' :
                  interviewFlow === 'waiting-for-answer' ? 'bg-green-100 text-green-800' :
                  interviewFlow === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  interviewFlow === 'showing-feedback' ? 'bg-blue-100 text-blue-800' :
                  interviewFlow === 'showing-corrected-answers' ? 'bg-purple-100 text-purple-800' :
                  interviewFlow === 'asking-followup' ? 'bg-orange-100 text-orange-800' :
                  interviewFlow === 'user-question' ? 'bg-purple-100 text-purple-800' :
                  interviewFlow === 'user-question-response' ? 'bg-purple-100 text-purple-800' :
                  interviewFlow === 'feedback-complete' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getCurrentActionText()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  interviewState.performanceScore >= 80 ? 'text-green-600' :
                  interviewState.performanceScore >= 70 ? 'text-blue-600' : 
                  interviewState.performanceScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(interviewState.performanceScore)}%
                </div>
                <div className="text-sm text-gray-500">Performance</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-mono text-gray-700">
                  {formatTime(timeElapsed)}
                </div>
                <div className="text-sm text-gray-500">Duration</div>
              </div>

              {questionTimeLeft !== null && interviewFlow === 'waiting-for-answer' && (
                <div className="text-center">
                  <div className={`text-xl font-mono ${
                    questionTimeLeft < 30 ? 'text-red-600' : 
                    questionTimeLeft < 60 ? 'text-yellow-600' : 'text-gray-700'
                  }`}>
                    {formatTime(questionTimeLeft)}
                  </div>
                  <div className="text-sm text-gray-500">Time Left</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <h4 className="text-red-800 font-medium">System Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Assessment Panel - Larger */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Enhanced Video Section with Real Interviewer */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Camera View */}
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                    {isVideoEnabled && hasMediaPermissions && !cameraError ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white">
                        {cameraError ? (
                          <div className="text-center p-2">
                            <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">{cameraError}</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <User className="h-8 w-8 mx-auto mb-1" />
                            <p className="text-xs">You</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* User Camera Controls */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button
                        onClick={toggleVideo}
                        className={`p-2 rounded-full ${isVideoEnabled && !cameraError ? 'bg-blue-600' : 'bg-red-600'}`}
                      >
                        {isVideoEnabled && !cameraError ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        onClick={toggleMicrophone}
                        className={`p-2 rounded-full ${isMicEnabled ? 'bg-blue-600' : 'bg-red-600'}`}
                      >
                        {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Enhanced Video Interviewer View */}
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                    <VideoInterviewer
                      isSpeaking={isInterviewerSpeaking}
                      currentQuestion={currentInterviewerMessage}
                      onVideoEnd={() => {}}
                      isVideoEnabled={isVideoInterviewerEnabled}
                      shouldShowVideo={shouldShowVideo}
                      isUserAnswering={isUserAnswering}
                    />
                    
                    {/* Video Interviewer Controls */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button
                        onClick={() => setIsVideoInterviewerEnabled(!isVideoInterviewerEnabled)}
                        className={`p-2 rounded-full ${isVideoInterviewerEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                        title={isVideoInterviewerEnabled ? 'Hide video interviewer' : 'Show video interviewer'}
                      >
                        {isVideoInterviewerEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        onClick={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
                        className={`p-2 rounded-full ${isSpeakerEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                      >
                        {isSpeakerEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Additional Controls */}
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    onClick={initializeMedia}
                    className="p-2 bg-green-600 hover:bg-green-700"
                    title="Retry camera access"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>

                  {/* Speech Recognition Button */}
                  <Button
                    onClick={toggleSpeechRecognition}
                    className={`p-2 ${isSpeechRecognitionActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                  >
                    {isSpeechRecognitionActive ? (
                      <div className="flex items-center">
                        <Square className="h-3 w-3 mr-1" />
                        <span className="text-xs">Stop</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Mic className="h-3 w-3 mr-1" />
                        <span className="text-xs">Speak</span>
                      </div>
                    )}
                  </Button>

                  {/* Ask Question Button */}
                  <Button
                    onClick={() => setShowUserQuestionInput(!showUserQuestionInput)}
                    className="p-2 bg-purple-600 hover:bg-purple-700"
                    title="Ask interviewer a question"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* ENHANCED: User Question Input with Resume Functionality */}
              <UserQuestionInput
                isVisible={showUserQuestionInput}
                onAskQuestion={handleUserQuestion}
                currentUserQuestion={currentUserQuestion}
                setCurrentUserQuestion={setCurrentUserQuestion}
                isMicEnabled={isMicEnabled}
                hasMediaPermissions={hasMediaPermissions}
                onResumeInterview={handleResumeInterview}
                isQuestionChatActive={isQuestionChatActive}
              />

              {/* ENHANCED: Interviewer Response Display with Resume Button */}
              <InterviewerResponseDisplay
                response={userQuestionResponse}
                isVisible={interviewFlow === 'user-question-response'}
                onResumeInterview={handleResumeInterview}
              />

              {/* Follow-up Question Display */}
              <FollowUpQuestionDisplay
                followUpQuestion={pendingFollowUpQuestion || ''}
                followUpCount={interviewState.currentFollowUpCount}
                maxFollowUps={MAX_FOLLOW_UPS_PER_QUESTION}
                isVisible={interviewFlow === 'asking-followup'}
                onAnswer={handleFollowUpAnswer}
                onSkip={handleSkipFollowUp}
                currentAnswer={currentAnswer}
                setCurrentAnswer={setCurrentAnswer}
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                recordedChunks={recordedChunks}
                hasMediaPermissions={hasMediaPermissions}
                isMicEnabled={isMicEnabled}
                isSpeechRecognitionActive={isSpeechRecognitionActive}
                loading={loading}
                isGeneratingNext={isGeneratingNext}
              />

              {/* Next Question Prompt - FIXED: Show only when feedback is complete */}
              <NextQuestionPrompt
                isVisible={interviewFlow === 'feedback-complete'}
                onProceed={handleProceedToNextQuestion}
              />

              {/* Welcome Message Display */}
              {interviewFlow === 'welcome' && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-6 mb-6 rounded-lg">
                  <div className="flex items-center">
                    <Sparkles className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800 mb-2">Welcome to Talkgenious AI Assessment</h3>
                      <p className="text-blue-700">
                        The AI interviewer is introducing the session. Please wait for the first question...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Question Asked Display */}
              {interviewFlow === 'question-asked' && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-400 p-6 mb-6 rounded-lg">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <h3 className="text-xl font-semibold text-purple-800 mb-2">Question Asked</h3>
                      <p className="text-purple-700">
                        The interviewer is asking the question. Please listen carefully...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Question Generation Indicator */}
              {isGeneratingNext && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-400 p-4 mb-6 rounded">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="h-6 w-6 text-purple-600 animate-pulse" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                    <div className="ml-3">
                      <span className="text-purple-800 font-medium">
                        AI generating next question based on your response...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Analysis Indicator */}
              {isAnalyzing && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                    <div className="ml-3">
                      <span className="text-blue-800 font-medium">
                        AI analyzing response and preparing personalized feedback...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Feedback Display */}
              {currentFeedback && (interviewFlow === 'showing-feedback' || interviewFlow === 'showing-corrected-answers') && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 p-4 mb-6 rounded">
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-green-800 font-medium mb-2">Assessment Feedback</h4>
                      <p className="text-green-700">{currentFeedback}</p>
                      {currentQuestionScore > 0 && (
                        <div className="mt-2 text-sm text-green-600">
                          <strong>Score for this question:</strong> {currentQuestionScore}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Comprehensive Feedback Display */}
              {comprehensiveFeedback && (
                <ComprehensiveFeedbackDisplay 
                  feedback={comprehensiveFeedback}
                  isVisible={true}
                  onClose={() => setComprehensiveFeedback(null)}
                />
              )}

              {/* Corrected Answer Display */}
              <CorrectedAnswerDisplay 
                correctedAnswer={currentCorrectedAnswer}
                expectedAnswer={currentExpectedAnswer}
                isVisible={showCorrectedAnswer}
                onClose={() => setShowCorrectedAnswer(false)}
              />

              {/* Answer Input Section for Regular Questions */}
              {(interviewFlow === 'waiting-for-answer' && !pendingFollowUpQuestion && !isQuestionChatActive && !showUserQuestionInput) && (  // ← ADDED: !showUserQuestionInput
               <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Your Response:
                      </span>
                      {isRecording && (
                        <div className="flex items-center gap-2 text-red-600 animate-pulse">
                          <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                          <span className="text-sm font-medium">Recording in progress...</span>
                        </div>
                      )}
                      {isSpeechRecognitionActive && (
                        <div className="flex items-center gap-2 text-green-600 animate-pulse">
                          <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                          <span className="text-sm font-medium">Listening...</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentAnswer.trim().split(/\s+/).length} words • Target: 50-150 words
                    </div>
                  </div>
                  
                  <Textarea
                    placeholder="Share your detailed response here... Include specific examples, your thought process, and outcomes where relevant. You can also use the microphone button to speak your response."
                    value={currentAnswer}
                    onChange={(e: any) => setCurrentAnswer(e.target.value)}
                    className="mb-4 min-h-32"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {hasMediaPermissions && (
                        <>
                          <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`p-3 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            disabled={!isMicEnabled}
                          >
                            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                          </Button>
                          
                          {recordedChunks.length > 0 && (
                            <Button
                              onClick={() => {
                                const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                                const audioUrl = URL.createObjectURL(audioBlob);
                                const audio = new Audio(audioUrl);
                                audio.play().catch(console.error);
                              }}
                              className="p-3 bg-green-600 hover:bg-green-700"
                              title="Play recorded response"
                              >
                              <Play className="h-5 w-5" />
                            </Button>
                          )}
                        </>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
                        <span>Response quality:</span>
                        <div className={`px-2 py-1 rounded text-xs ${
                          currentAnswer.trim().split(/\s+/).length > 80 ? 'bg-green-100 text-green-700' :
                          currentAnswer.trim().split(/\s+/).length > 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {currentAnswer.trim().split(/\s+/).length > 80 ? 'Detailed' :
                           currentAnswer.trim().split(/\s+/).length > 40 ? 'Good' : 'Brief'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSkipQuestion}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700"
                      >
                        <ArrowRight className="h-5 w-5" />
                        <span>Skip Question</span>
                      </Button>
                      
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={(!currentAnswer.trim() && recordedChunks.length === 0) || loading || isGeneratingNext}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700"
                      >
                        {loading || isGeneratingNext ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            <span>{isGeneratingNext ? 'Generating...' : 'Processing...'}</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Answer</span>
                            <ArrowRight className="h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Question Display */}
              {/* Current Question Display */}
{currentQuestion && (interviewFlow === 'waiting-for-answer' || interviewFlow === 'question-asked') && !showUserQuestionInput && (
  <div className="bg-gray-50 border-l-4 border-blue-400 p-4 rounded">
    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
      <MessageSquare className="h-5 w-5 text-blue-600" />
      Current Question
    </h3>
    <p className="text-gray-700">
      {pendingFollowUpQuestion || currentQuestion.question}
    </p>
    <div className="flex gap-2 mt-2">
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
        {pendingFollowUpQuestion ? 'follow-up' : currentQuestion.type}
      </span>
      <span className={`px-2 py-1 text-xs rounded-full ${
        currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
        currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {currentQuestion.difficulty}
      </span>
    </div>
  </div>
)}
            </div>
          </div>

          {/* Sidebar - Smaller */}
          <div className="space-y-6">
            {/* Real-time Performance */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Overall Score</span>
                    <span>{Math.round(interviewState.performanceScore)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        interviewState.performanceScore >= 80 ? 'bg-green-500' :
                        interviewState.performanceScore >= 70 ? 'bg-blue-500' :
                        interviewState.performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${interviewState.performanceScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    {/* FIXED: Show main questions count */}
                    <div className="text-2xl font-bold text-blue-700">{interviewState.answeredQuestions}</div>
                    <div className="text-xs text-blue-600">Main Questions</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {answers.length > 0 ? Math.round(answers.reduce((acc, ans) => acc + (ans.score || 0), 0) / answers.length) : 0}%
                    </div>
                    <div className="text-xs text-green-600">Avg Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Assessment */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Skill Assessment
              </h3>
              
              <div className="space-y-3">
                {Object.entries(interviewState.skillProficiency)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([skill, score]) => (
                    <div key={skill}>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{skill}</span>
                        <span>{Math.round(score as number)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            (score as number) >= 80 ? 'bg-green-500' :
                            (score as number) >= 60 ? 'bg-blue-500' :
                            (score as number) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Interview Flow Status */}
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg shadow-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Assessment Status
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700">Current Phase:</span>
                  <span className="font-medium text-purple-800">{getInterviewStageText()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Flow State:</span>
                  <span className="font-medium text-purple-800">
                    {interviewFlow === 'welcome' ? 'Welcome' :
                     interviewFlow === 'question-asked' ? 'Asking Question' :
                     interviewFlow === 'waiting-for-answer' ? 'Answering' :
                     interviewFlow === 'processing' ? 'Analyzing' :
                     interviewFlow === 'showing-feedback' ? 'Feedback' :
                     interviewFlow === 'showing-corrected-answers' ? 'Reviewing' :
                     interviewFlow === 'asking-followup' ? 'Follow-up' : 
                     interviewFlow === 'user-question' ? 'User Question' :
                     interviewFlow === 'user-question-response' ? 'Interviewer Response' :
                     interviewFlow === 'proceeding-to-next' ? 'Transitioning' : 
                     interviewFlow === 'feedback-complete' ? 'Ready for Next' : 'Ready'}
                  </span>
                </div>
                {/* FIXED: Show proper question counts */}
                <div className="flex justify-between">
                  <span className="text-purple-700">Main Questions:</span>
                  <span className="font-medium text-purple-800">{interviewState.answeredQuestions} of {MAX_MAIN_QUESTIONS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Follow-ups:</span>
                  <span className="font-medium text-purple-800">{interviewState.currentFollowUpCount} of {MAX_FOLLOW_UPS_PER_QUESTION}</span>
                </div>
                {isDynamicMode && (
                  <div className="mt-3 p-2 bg-purple-50 rounded text-xs text-purple-600">
                    AI adapts questions based on your performance
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Controls</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gray-600 hover:bg-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Exit to Dashboard
                </Button>
                <Button
                  onClick={() => {
                    const currentInterview = {
                      profile,
                      questions,
                      startTime: new Date().toISOString(),
                      currentQuestionIndex,
                      answers,
                      isActive: true,
                      type: 'dynamic-ai-interview',
                      isDynamic: true
                    };
                    localStorage.setItem('activeInterview', JSON.stringify(currentInterview));
                    router.push('/dashboard');
                  }}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save & Exit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}