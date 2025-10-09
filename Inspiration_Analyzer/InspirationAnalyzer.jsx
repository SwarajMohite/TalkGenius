import React, { useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";

// CSS styles with soft blue-to-purple gradient theme
const styles = `
:root {
  /* Main gradient: Soft Blue to Purple */
  --color-primary-dark: #6b8dd6;
  --color-primary-light: #7c6bc4;
  
  --color-text: #ffffff;
  --color-card-bg: #ffffff;
  --color-card-border: rgba(124, 128, 232, 0.1);
  --color-card-hover: #f8f9ff;
  
  /* Purple/Blue accent for buttons */
  --color-green-start: #7c80e8;
  --color-green-end: #6366f1;
  
  /* Lighter blue for secondary actions */
  --color-yellow-start: #60a5fa;
  --color-yellow-end: #3b82f6;
  
  /* Soft pink/purple for alerts */
  --color-red-start: #c084fc;
  --color-red-end: #a855f7;
  --color-red-dark-start: #9333ea;
  --color-red-dark-end: #7e22ce;
  
  /* Cyan accent */
  --color-indigo-start: #60a5fa;
  --color-purple-end: #6366f1;
  
  --color-gray-bg: #8b9dc3;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  min-height: 100vh;
  color: var(--color-text);
  font-family: sans-serif;
  padding: 2rem;
  padding-bottom: 4rem;
  background: linear-gradient(135deg, #6b8dd6 0%, #7c6bc4 100%);
}

.max-w-6xl {
  max-width: 72rem;
  margin-left: auto;
  margin-right: auto;
}

.text-center {
  text-align: center;
}

.mb-12 {
  margin-bottom: 3rem;
}

.header-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background-image: linear-gradient(to right, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
}

.grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .grid-md-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.card {
  background-color: var(--color-card-bg);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid var(--color-card-border);
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card:hover {
  background-color: var(--color-card-hover);
  transform: translateY(-8px);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.tab-nav {
  display: flex;
  margin-bottom: 1.5rem;
  background-color: #f3f4f6;
  border-radius: 1.5rem;
  padding: 4px;
}

.tab-button {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background-color: transparent;
  color: #4b5563;
  cursor: pointer;
}

.tab-button.active {
  background: linear-gradient(to right, var(--color-green-start), var(--color-green-end));
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  color: white;
}

.tab-button:not(.active):hover {
  background-color: #e5e7eb;
}

.drop-zone {
  border: 2px dashed rgba(124, 128, 232, 0.4);
  border-radius: 1.5rem;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9fafb;
}

.drop-zone:hover {
  border-color: rgba(99, 102, 241, 0.6);
  background-color: #f3f4f6;
}

.drop-zone-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
  color: #6b7280;
}

.drop-zone-button {
  background: linear-gradient(to right, var(--color-yellow-start), var(--color-yellow-end));
  color: #ffffff;
  padding: 0.75rem 2rem;
  border-radius: 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.drop-zone-button:hover {
  transform: translateY(-4px);
}

.input-text {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 9999px;
  background-color: #ffffff;
  color: #1f2937;
  outline: none;
  transition: all 0.3s ease;
}

.input-text:focus {
  border-color: #7c80e8;
  background-color: #ffffff;
}

.input-text::placeholder {
  color: #9ca3af;
}

.flex-gap-2 {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.youtube-search-button {
  background: linear-gradient(to right, var(--color-red-start), var(--color-red-end));
  padding: 0.75rem 1.5rem;
  border-radius: 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  color: white;
  cursor: pointer;
}

.youtube-search-button:hover {
  transform: translateY(-4px);
}

.loading-text {
  text-align: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
  opacity: 0.8;
}

.search-results {
  max-height: 24rem;
  overflow-y: auto;
}

.video-result {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f9fafb;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-result:hover {
  background-color: #f3f4f6;
  transform: translateX(8px);
}

.video-result-thumbnail {
  width: 7.5rem;
  height: 5rem;
  border-radius: 0.75rem;
  object-fit: cover;
  background-color: rgba(255, 255, 255, 0.1);
}

.video-result-details {
  flex: 1;
}

.video-result-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: normal;
  color: #1f2937;
}

.video-result-channel {
  font-size: 0.875rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
  color: #6b7280;
}

.video-result-duration {
  font-size: 0.75rem;
  opacity: 0.75;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

.video-preview {
  background-color: #ffffff;
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(124, 128, 232, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.video-preview-grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 768px) {
  .video-preview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


.video-preview-player {
  width: 100%;
  max-height: 18rem;
  border-radius: 1rem;
  background-color: black;
  border: 3px solid rgba(124, 128, 232, 0.6);
  box-shadow: 0 0 20px rgba(124, 128, 232, 0.3);
}

.video-preview-title {
  text-align: center;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.camera-preview-container {
  position: relative;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 1.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
  min-height: 12rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-preview {
  width: 100%;
  height: 12rem;
  object-fit: cover;
  border-radius: 1.5rem;
}

.camera-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
}

.camera-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.camera-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
  .camera-controls {
    flex-direction: row;
  }
}

.button-base {
  padding: 0.75rem 1.5rem;
  border-radius: 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  color: white;
}

.button-base:hover {
  transform: scale(1.05);
}

.button-start {
  background: linear-gradient(to right, var(--color-green-start), var(--color-green-end));
}

.button-stop {
  background: linear-gradient(to right, var(--color-red-start), var(--color-red-end));
}

.button-record {
  background: linear-gradient(to right, var(--color-red-start), var(--color-red-end));
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button-record.recording {
  background: linear-gradient(to right, var(--color-red-dark-start), var(--color-red-dark-end));
  animation: pulse 1s infinite;
}

.record-icon {
  font-size: 1.125rem;
}

.record-timer {
  font-size: 1.25rem;
  font-weight: bold;
  color: #e9d5ff;
  font-family: monospace;
}

.analyze-button {
  background: linear-gradient(to right, #7c80e8, #6366f1);
  color: white;
  font-size: 1.2rem;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  margin-top: 2rem;
  margin-bottom: 4rem;
}

.analyze-button.enabled:hover {
  background: linear-gradient(to right, #6366f1, #4f46e5);
}
.analyze-button.disabled {
  background: rgba(148, 163, 184, 0.6);
  cursor: not-allowed;
}

.results-grid {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

@media (min-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.result-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  border: 2px solid rgba(124, 128, 232, 0.2);
  box-shadow: 0 8px 25px rgba(107, 141, 214, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
  .result-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, var(--color-green-start), var(--color-green-end));
}
  
.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(107, 141, 214, 0.25);
  border-color: rgba(124, 128, 232, 0.4);
}

.result-card-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: #332639ff;
  background: linear-gradient(to right, var(--color-primary-dark), var(--color-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.result-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
  font-weight: 500;
}

.result-list {
  padding-left: 1.5rem;
}

.result-list li {
  margin-bottom: 0.5rem;
}

.status-message {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #4b5563;
}

.status-warning {
  background-color: rgba(84, 28, 111, 0.25);
  color: #f5f5f4ff;
}

.status-info {
  background-color: rgba(165, 180, 252, 0.25);
  color: #e0e7ff;
}
`;
const ResultsCard = ({ title, content }) => (
  <div className="result-card">
    <h3 className="result-card-title">{title}</h3>
    <div className="result-content">{content}</div>
  </div>
);

const InspirationAnalyzer = () => {
  // State variables
  const [roleModelTab, setRoleModelTab] = useState('upload');
  const [userTab, setUserTab] = useState('userUpload');
  const [roleModelVideo, setRoleModelVideo] = useState(null);
  const [userVideo, setUserVideo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [recordTimer, setRecordTimer] = useState('00:00');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const roleModelInputRef = useRef(null);
  const userInputRef = useRef(null);
  const previewVideoRef = useRef(null);
  const rolePreviewRef = useRef(null);
  const userPreviewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
  // Initialize socket connection
  const initializeSocket = () => {
    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    // Create new connection with explicit configuration
    const socket = io("http://localhost:5000", {
      transports: ['websocket', 'polling'],
      upgrade: true,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });

    socketRef.current = socket;

    // Socket connection handlers
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
      setSocketConnected(true);
      setConnectionError("");
      setReconnectAttempts(0);
    });
    
    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
      setSocketConnected(false);
      
      if (reason === "io server disconnect") {
        // The server has forcefully disconnected the socket
        setConnectionError("Server disconnected. Please try again later.");
      } else {
        // Other disconnect reasons (like network issues)
        setConnectionError("Connection lost. Attempting to reconnect...");
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setSocketConnected(false);
      setConnectionError(`Connection failed: ${error.message}`);
      
      // Increment reconnect attempts
      setReconnectAttempts(prev => prev + 1);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
      setConnectionError(`Attempting to reconnect... (${attempt}/10)`);
    });

    socket.on("reconnect", (attempt) => {
      console.log(`Reconnected after ${attempt} attempts`);
      setSocketConnected(true);
      setConnectionError("");
      setReconnectAttempts(0);
    });

    socket.on("reconnect_failed", () => {
      setConnectionError("Failed to reconnect to server. Please refresh the page.");
    });

    socket.on("analysis_result", (data) => {
      console.log("📩 Analysis Result:", data);
      setAnalysisResult(data);
      setIsAnalyzing(false);
    });
    
    socket.on("analysis_error", (error) => {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
      setConnectionError("Analysis failed. Please try again.");
    });

    // Manually connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    return socket;
  };

  const socket = initializeSocket();

  // Cleanup on unmount
  return () => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    stopCamera();
    stopTimer();
    
    if (roleModelVideo?.url && !roleModelVideo.isUrl) {
      URL.revokeObjectURL(roleModelVideo.url);
    }
    if (userVideo?.url) {
      URL.revokeObjectURL(userVideo.url);
    }
  };
}, [roleModelVideo, userVideo]);
  // Attempt to reconnect when reconnectAttempts changes
  useEffect(() => {
    if (reconnectAttempts > 0 && reconnectAttempts < 5 && !socketConnected) {
      const timer = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.connect();
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [reconnectAttempts, socketConnected]);

   const handleUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    handleVideoFile(file, type);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleVideoFile(file, type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleVideoFile = (file, type) => {
    const url = URL.createObjectURL(file);
    
    if (type === 'roleModel') {
      setRoleModelVideo({ file, url });
      if (rolePreviewRef.current) {
        rolePreviewRef.current.src = url;
      }
    } else if (type === 'user') {
      setUserVideo({ file, url });
      if (userPreviewRef.current) {
        userPreviewRef.current.src = url;
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setCameraStream(stream);
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = null;
      }
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      if (!cameraStream) {
        alert('Please start camera first');
        return;
      }

      try {
        const mediaRecorder = new MediaRecorder(cameraStream);
        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setUserVideo({ file: blob, url });
          if (userPreviewRef.current) {
            userPreviewRef.current.src = url;
          }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        startTimer();
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        stopTimer();
      }
    }
  };

  const startTimer = () => {
    let seconds = 0;
    recordingTimerRef.current = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setRecordTimer(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
  };

  const stopTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      setRecordTimer('00:00');
    }
  };

  const API_KEY = "AIzaSyB5Ls3LMJDATLgBAC-Mcv7pmyJYaS7P8jg"; //your youtube api key here

  const searchYouTube = async () => {
    const searchInput = document.getElementById("youtubeSearchInput");
    const query = searchInput?.value;

    if (!query) return;

    setIsSearching(true);

    try {
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(
          query
        )}&key=${API_KEY}`
      );

      const searchData = await searchResponse.json();

      if (!searchData.items || searchData.items.length === 0) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      const videoIds = searchData.items.map((item) => item.id.videoId).filter(Boolean);

      let durationMap = {};
      if (videoIds.length > 0) {
        const detailsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(
            ","
          )}&key=${API_KEY}`
        );
        const detailsData = await detailsResponse.json();

        detailsData.items.forEach((item) => {
          durationMap[item.id] = formatDuration(item.contentDetails.duration);
        });
      }
const results = searchData.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        duration: durationMap[item.id.videoId] || "Unavailable",
      }));

      setSearchResults(results);
    } catch (error) {
      console.error("YouTube API Error:", error);
      setSearchResults([]);
    }

    setIsSearching(false);
  };

  function formatDuration(isoDuration) {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  const selectVideo = (video) => {
    setRoleModelVideo({ 
      url: `https://www.youtube.com/embed/${video.id}`, 
      isYoutube: true,
      title: video.title 
    });
  };
  const startAnalysis = () => {
    if (!roleModelVideo && !userVideo) {
      alert("Please upload at least one video before starting analysis");
      return;
    }
    
    if (!socketConnected) {
      alert("Not connected to server. Please check your connection.");
      return;
    }
    
    setIsAnalyzing(true);

    const readFileAsArrayBuffer = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });

    const sendVideos = async () => {
      try {
        const userData = userVideo?.file ? await readFileAsArrayBuffer(userVideo.file) : null;
        const roleData = roleModelVideo?.file ? await readFileAsArrayBuffer(roleModelVideo.file) : null;

        socketRef.current.emit("start_analysis", { user: userData, roleModel: roleData });
      } catch (error) {
        console.error("Error processing videos:", error);
        setIsAnalyzing(false);
        setConnectionError("Error processing videos. Please try again.");
      }
    };

    sendVideos();
  };

  const canAnalyze = (roleModelVideo || userVideo) && socketConnected;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="container animate-fade-in-up">
        <div className="max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="header-title">
              TalkGenius - Inspiration Analyzer
            </h1>
            <p className="header-subtitle">
              Upload your role model's video/your video/both to get personalized recommendations on how you can be like your role model!
            </p>
            <div style={{ 
              marginTop: '1rem', 
              color: socketConnected ? '#28a466ff' : '#ef4444',
              fontWeight: 'bold'
            }}>
              
            </div>
            
            {connectionError && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                borderRadius: '0.5rem',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                {connectionError}
                {reconnectAttempts > 0 && !socketConnected && (
                  <div>Attempting to reconnect... ({reconnectAttempts}/5)</div>
                )}
                {reconnectAttempts >= 5 && (
                  <button 
                    onClick={() => window.location.reload()}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#c0a5f5ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    Refresh Page
                  </button>
                )}
              </div>
            )}
          </div>

         {/* Upload Section */}
          <div className="grid grid-md-2">
            {/* Role Model Video */}
            <div className="card">
              <h3 className="card-title">Your Role Model's Video</h3>
              
              {/* Tab Navigation */}
              <div className="tab-nav">
                {['upload', 'url', 'youtube'].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-button ${roleModelTab === tab ? 'active' : ''}`}
                    onClick={() => setRoleModelTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {roleModelTab === 'upload' && (
                <div 
                  className="drop-zone"
                  onDrop={(e) => handleDrop(e, 'roleModel')}
                  onDragOver={handleDragOver}
                >
                  <div className="drop-zone-icon">📁</div>
                  <p style={{ marginBottom: '0.5rem' }}>Drag & drop your role model's video here</p>
                  <p style={{ marginBottom: '1rem', opacity: '0.7' }}>or</p>
                  <input
                    ref={roleModelInputRef}
                    type="file"
                    accept="video"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoFile(file, 'roleModel');
                    }}
                    style={{ display: 'none' }}
                  />
                  <button 
                    className="drop-zone-button"
                    onClick={() => roleModelInputRef.current?.click()}
                  >
                    Choose File
                  </button>
                </div>
              )}

              {roleModelTab === 'url' && (
                <div>
                  <div className="flex-gap-2">
                    <input
                      id="videoUrlInput"
                      type="url"
                      placeholder="Paste video URL here"
                      className="input-text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (!videoUrl) return;

                        if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
                          let videoId = "";
                          if (videoUrl.includes("v=")) {
                            videoId = new URL(videoUrl).searchParams.get("v");
                          } else if (videoUrl.includes("youtu.be/")) {
                            videoId = videoUrl.split("youtu.be/")[1];
                          }

                          setRoleModelVideo({
                            url: `https://www.youtube.com/embed/${videoId}`,
                            isYoutube: true,
                            title: "YouTube Video"
                          });
                        } else {
                          setRoleModelVideo({
                            url: videoUrl,
                            isYoutube: false,
                            title: "Custom Video"
                          });
                        }
                      }}
                      className="youtube-search-button"
                    >
                      Load
                    </button>
                  </div>
                </div>
              )}

              {roleModelTab === 'youtube' && (
                <div>
                  <div className="flex-gap-2">
                    <input
                      id="youtubeSearchInput"
                      type="search"
                      placeholder="Search YouTube"
                      className="input-text"
                    />
                    <button
                      onClick={searchYouTube}
                      className="youtube-search-button"
                    >
                      Search
                    </button>
                  </div>
                  
                  {isSearching && (
                    <div className="loading-text">
                      ⏳ Searching...
                    </div>
                  )}
                  
                  <div className="search-results">
                    {searchResults.map((video) => (
                      <div
                        key={video.id}
                        className="video-result"
                        onClick={() => selectVideo(video)}
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="video-result-thumbnail"
                        />
                        <div className="video-result-details">
                          <h4 className="video-result-title">{video.title}</h4>
                          <p className="video-result-channel">{video.channel}</p>
                          <span className="video-result-duration">{video.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Video */}
            <div className="card">
              <h3 className="card-title">Your Video</h3>
              
              {/* Tab Navigation */}
              <div className="tab-nav">
                {['userUpload', 'userRecord'].map((tab, index) => (
                  <button
                    key={tab}
                    className={`tab-button ${userTab === tab ? 'active' : ''}`}
                    onClick={() => setUserTab(tab)}
                  >
                    {index === 0 ? 'Upload' : 'Record'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {userTab === 'userUpload' && (
                <div 
                  className="drop-zone"
                  onDrop={(e) => handleDrop(e, 'user')}
                  onDragOver={handleDragOver}
                >
                  <div className="drop-zone-icon">📹</div>
                  <p style={{ marginBottom: '0.5rem' }}>Drag & drop your video here</p>
                  <p style={{ marginBottom: '1rem', opacity: '0.7' }}>or</p>
                  <input
                    ref={userInputRef}
                    type="file"
                    accept="video"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoFile(file, 'user');
                    }}
                    style={{ display: 'none' }}
                  />
                  <button 
                    className="drop-zone-button"
                    onClick={() => userInputRef.current?.click()}
                  >
                    Choose File
                  </button>
                </div>
              )}

              {userTab === 'userRecord' && (
                <div>
                  <div className="camera-preview-container">
                    <video
                      ref={previewVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="camera-preview"
                    />
                    {!cameraStream && (
                      <div className="camera-placeholder">
                        <div className="camera-icon">📷</div>
                        <p>Camera Preview</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="camera-controls">
                    <button
                      onClick={startCamera}
                      className="button-base button-start"
                    >
                      Start Camera
                    </button>
                    
                    <button
                      onClick={stopCamera}
                      className="button-base button-stop"
                    >
                      Stop Camera
                    </button>

                    <button
                      onClick={toggleRecording}
                      className={`button-base button-record ${isRecording ? 'recording' : ''}`}
                    >
                      <span className="record-icon">⚫</span>
                      {isRecording ? 'Stop' : 'Record'}
                    </button>
                    
                    <span className="record-timer">
                      {recordTimer}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Preview Section */}
          <div className="video-preview">
            <h3 className="card-title">Video Previews</h3>
            <div className="video-preview-grid">
              
              {/* Role Model Preview */}
              <div>
                <h4 className="video-preview-title">Role Model</h4>

                {roleModelVideo ? (
                  roleModelVideo.isYoutube ? (
                    <iframe
                      src={roleModelVideo.url}
                      className="video-preview-player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      ref={rolePreviewRef}
                      src={roleModelVideo.url}
                      controls
                      className="video-preview-player"
                    />
                  )
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "18rem",
                      border: "3px solid rgba(124, 128, 232, 0.6)",
                      borderRadius: "1rem",
                      boxShadow: "0 0 20px rgba(124, 128, 232, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.5)"
                    }}
                  >
                    Uploaded Video Appears Here
                  </div>
                )}

                {roleModelVideo?.title && (
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                      opacity: "0.7"
                    }}
                  >
                    {roleModelVideo.title}
                  </p>
                )}
              </div>

              {/* User Preview */}
              <div>
                <h4 className="video-preview-title">Your Video</h4>
                {userVideo ? (
                  <video
                    ref={userPreviewRef}
                    controls
                    className="video-preview-player"
                    src={userVideo.url}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "18rem",
                      border: "3px solid rgba(124, 128, 232, 0.6)",
                      borderRadius: "1rem",
                      boxShadow: "0 0 20px rgba(124, 128, 232, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.5)"
                    }}
                  >
                    Uploaded Video Appears Here
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {!roleModelVideo && !userVideo && (
            <div className="status-message status-warning">
              Upload at least one video to start analysis
            </div>
          )}
          {roleModelVideo && !userVideo && (
            <div className="status-message status-info">
              Only Role Model video uploaded. Analysis results will be for Role Model.
            </div>
          )}
          {!roleModelVideo && userVideo && (
            <div className="status-message status-info">
              Only Your video uploaded. Analysis results will be for You.
            </div>
          )}
          {!socketConnected && (
            <div className="status-message status-warning">
              Not connected to server. Analysis unavailable.
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="results-grid">
              {/* User Audio Analysis */}
              <ResultsCard
                title="Your Audio Analysis"
                content={
                  <>
                    WPM: {analysisResult.user_audio?.wpm || 0} <br />
                    Fillers: {analysisResult.user_audio?.fillers?.join(", ") || "None"} <br />
                    Grammar Mistakes: {analysisResult.user_audio?.grammar_mistakes || 0} <br />
                    Pause Count: {analysisResult.user_audio?.pause_count || 0} <br />
                    Transcript: {analysisResult.user_audio?.transcript || "N/A"}
                  </>
                }
              />

                            {/* Role Model Audio Analysis */}
              {analysisResult.role_audio && (
                <ResultsCard
                  title="Role Model Audio Analysis"
                  content={
                    <>
                      WPM: {analysisResult.role_audio?.wpm || 0} <br />
                      Fillers: {analysisResult.role_audio?.fillers?.join(", ") || "None"} <br />
                      Grammar Mistakes: {analysisResult.role_audio?.grammar_mistakes || 0} <br />
                      Pause Count: {analysisResult.role_audio?.pause_count || 0} <br />
                      Transcript: {analysisResult.role_audio?.transcript || "N/A"}
                    </>
                  }
                />
              )}

              {/* User Body Language Analysis */}
              <ResultsCard
                title="Your Body Language Analysis"
                content={
                  <>
                    Confidence Score: {analysisResult.user_body?.confidence_score || 0}/10 <br />
                    Posture: {analysisResult.user_body?.posture || "N/A"} <br />
                    Gestures: {analysisResult.user_body?.gestures?.join(", ") || "None"} <br />
                    Eye Contact: {analysisResult.user_body?.eye_contact || "N/A"} <br />
                    Facial Expressions: {analysisResult.user_body?.facial_expressions?.join(", ") || "None"}
                  </>
                }
              />

              {/* Role Model Body Language Analysis */}
              {analysisResult.role_body && (
                <ResultsCard
                  title="Role Model Body Language Analysis"
                  content={
                    <>
                      Confidence Score: {analysisResult.role_body?.confidence_score || 0}/10 <br />
                      Posture: {analysisResult.role_body?.posture || "N/A"} <br />
                      Gestures: {analysisResult.role_body?.gestures?.join(", ") || "None"} <br />
                      Eye Contact: {analysisResult.role_body?.eye_contact || "N/A"} <br />
                      Facial Expressions: {analysisResult.role_body?.facial_expressions?.join(", ") || "None"}
                  </>
                  }
                />
              )}

              {/* Comparison & Recommendations */}
              {(analysisResult.user_audio && analysisResult.role_audio) && (
                <ResultsCard
                  title="Speech Comparison & Recommendations"
                  content={
                    <ul className="result-list">
                      {analysisResult.recommendations?.speech?.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      )) || "No specific recommendations available"}
                    </ul>
                  }
                />
              )}

              {/* Body Language Recommendations */}
              {(analysisResult.user_body && analysisResult.role_body) && (
                <ResultsCard
                  title="Body Language Recommendations"
                  content={
                    <ul className="result-list">
                      {analysisResult.recommendations?.body_language?.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      )) || "No specific recommendations available"}
                    </ul>
                  }
                />
              )}

              {/* Overall Assessment */}
              <ResultsCard
                title="Overall Assessment"
                content={
                  analysisResult.overall_assessment || 
                  "Complete analysis of both videos required for comprehensive assessment"
                }
              />

              {/* Action Plan */}
              {analysisResult.action_plan && (
                <ResultsCard
                  title="30-Day Action Plan"
                  content={
                    <ul className="result-list">
                      {analysisResult.action_plan?.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  }
                />
              )}
            </div>
          )}

          {/* Analyze Button */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={startAnalysis}
              disabled={!canAnalyze || isAnalyzing}
              className={`analyze-button ${canAnalyze ? 'enabled' : 'disabled'}`}
            >
              {isAnalyzing ? '🔍 Analyzing...' : '🚀 Start Analysis'}
            </button>
          </div>

          {/* Analysis Loading State */}
          {isAnalyzing && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#e5e7eb' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <h3>Analyzing Videos...</h3>
              <p>This may take a few minutes depending on video length</p>
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '2px',
                marginTop: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to right, var(--color-indigo-start), var(--color-purple-end))',
                  animation: 'pulse 2s infinite'
                }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

      
export default InspirationAnalyzer;