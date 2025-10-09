import os
import cv2
import mediapipe as mp
import tempfile
import numpy as np
import librosa
import speech_recognition as sr
from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import logging
import traceback
import threading
from concurrent.futures import ThreadPoolExecutor
import json
import time

# Configure FFmpeg path for pydub (add before importing AudioSegment)
ffmpeg_path = r"C:\ffmpeg\bin"
if os.path.exists(ffmpeg_path):
    os.environ["PATH"] = ffmpeg_path + os.pathsep + os.environ.get("PATH", "")

from pydub import AudioSegment

# Set FFmpeg executables directly for pydub
if os.path.exists(ffmpeg_path):
    AudioSegment.converter = os.path.join(ffmpeg_path, "ffmpeg.exe")
    AudioSegment.ffprobe = os.path.join(ffmpeg_path, "ffprobe.exe")

# Configure logging with more detail
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('analysis.log')
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

# Enhanced CORS configuration
CORS(app, resources={r"/*": {"origins": "*"}})

# Enhanced SocketIO configuration
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode='threading',
    ping_timeout=60,
    ping_interval=25,
    max_http_buffer_size=100 * 1024 * 1024,  # 100MB
    logger=True,
    engineio_logger=True
)

# ===============================
# Mediapipe setup
# ===============================
mp_pose = mp.solutions.pose
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    enable_segmentation=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Thread pool for parallel processing
executor = ThreadPoolExecutor(max_workers=4)

# ===============================
# Enhanced Utility functions
# ===============================
def save_temp_file(file_bytes, suffix):
    """Save incoming video bytes to temporary file with validation"""
    try:
        logger.info(f"Attempting to save temp file with suffix: {suffix}")
        
        # Check file size
        file_size = len(file_bytes)
        logger.info(f"File size: {file_size} bytes ({file_size / 1024 / 1024:.2f} MB)")
        
        if file_size > 100 * 1024 * 1024:
            raise Exception("File too large. Maximum size is 100MB")
        
        if file_size == 0:
            raise Exception("Empty file data received")
        
        # Create temp file
        fd, path = tempfile.mkstemp(suffix=suffix)
        logger.info(f"Created temp file: {path}")
        
        # Write bytes to file
        with os.fdopen(fd, "wb") as f:
            bytes_written = f.write(file_bytes)
            logger.info(f"Wrote {bytes_written} bytes to file")
        
        # Verify file exists and has correct size
        if not os.path.exists(path):
            raise Exception("File was not created successfully")
        
        actual_size = os.path.getsize(path)
        logger.info(f"Verified file size on disk: {actual_size} bytes")
        
        if actual_size != file_size:
            raise Exception(f"File size mismatch: expected {file_size}, got {actual_size}")
        
        logger.info(f"Successfully saved temp file: {path}")
        return path
        
    except Exception as e:
        logger.error(f"Error saving temp file: {e}")
        logger.error(traceback.format_exc())
        raise

def extract_audio_from_video(video_path):
    """Extract audio from video file with enhanced format detection"""
    try:
        logger.info(f"Starting audio extraction from: {video_path}")
        
        if not os.path.exists(video_path):
            logger.error(f"Video file not found: {video_path}")
            return None
        
        file_size = os.path.getsize(video_path)
        logger.info(f"Video file size: {file_size} bytes")
        
        if file_size == 0:
            logger.error("Empty video file")
            return None
        
        audio_path = video_path + '.wav'
        logger.info(f"Target audio path: {audio_path}")
        
        # Try multiple formats
        formats_to_try = [None, "webm", "mp4", "avi", "mov", "mkv"]
        
        for fmt in formats_to_try:
            try:
                logger.info(f"Trying format: {fmt or 'auto-detect'}")
                
                if fmt:
                    audio = AudioSegment.from_file(video_path, format=fmt)
                else:
                    audio = AudioSegment.from_file(video_path)
                
                logger.info(f"Loaded audio: duration={len(audio)}ms, channels={audio.channels}, sample_width={audio.sample_width}")
                
                # Export as WAV
                audio.export(audio_path, format="wav")
                
                if os.path.exists(audio_path):
                    audio_size = os.path.getsize(audio_path)
                    logger.info(f"Exported audio file: {audio_size} bytes")
                    
                    if audio_size > 0:
                        logger.info(f"Successfully extracted audio using format: {fmt or 'auto'}")
                        return audio_path
                    else:
                        logger.warning("Exported audio file is empty")
                        os.unlink(audio_path)
                else:
                    logger.warning("Audio file was not created")
                
            except Exception as format_error:
                logger.debug(f"Format {fmt} failed: {format_error}")
                continue
        
        logger.error("All audio extraction attempts failed")
        return None
        
    except Exception as e:
        logger.error(f"Error extracting audio: {e}")
        logger.error(traceback.format_exc())
        return None

def transcribe_audio(audio_path):
    """Transcribe audio using speech recognition"""
    if not audio_path or not os.path.exists(audio_path):
        logger.error(f"Audio file not found: {audio_path}")
        return "Audio file not found"
    
    try:
        file_size = os.path.getsize(audio_path)
        logger.info(f"Transcribing audio file: {audio_path} ({file_size} bytes)")
        
        if file_size == 0:
            logger.error("Empty audio file")
            return "Empty audio file"
        
        r = sr.Recognizer()
        r.energy_threshold = 300
        r.dynamic_energy_threshold = True
        r.pause_threshold = 0.8
        
        with sr.AudioFile(audio_path) as source:
            logger.info("Adjusting for ambient noise...")
            r.adjust_for_ambient_noise(source, duration=0.5)
            
            logger.info("Reading audio data...")
            audio = r.record(source)
            
            if len(audio.frame_data) == 0:
                logger.warning("No audio data detected")
                return "No speech detected in audio"
            
            logger.info(f"Audio data size: {len(audio.frame_data)} bytes")
            logger.info("Starting speech recognition...")
            
            # Remove timeout parameter - not supported in older versions
            transcript = r.recognize_google(audio)
            logger.info(f"Transcription successful: '{transcript[:100]}...' ({len(transcript)} chars)")
            return transcript
            
    except sr.WaitTimeoutError:
        logger.warning("Speech recognition timeout")
        return "Audio too quiet or no speech detected"
    except sr.UnknownValueError:
        logger.warning("Could not understand audio")
        return "Could not transcribe audio (unclear speech)"
    except sr.RequestError as e:
        logger.error(f"Speech recognition service error: {e}")
        return "Speech recognition service unavailable"
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        logger.error(traceback.format_exc())
        return f"Transcription failed: {str(e)}"

def calculate_speaking_rate(transcript, duration):
    """Calculate words per minute"""
    if not transcript or duration <= 0:
        return 0
    
    error_keywords = ["could not transcribe", "unavailable", "failed", "no speech", "too quiet", "empty", "not found"]
    if any(keyword in transcript.lower() for keyword in error_keywords):
        return 0
    
    words = len(transcript.split())
    wpm = (words / duration) * 60
    logger.info(f"Speaking rate: {words} words in {duration:.2f}s = {wpm:.1f} WPM")
    return round(wpm)

def detect_filler_words(transcript):
    """Detect filler words in transcript"""
    if not transcript:
        return []
    
    error_keywords = ["could not transcribe", "unavailable", "failed", "no speech", "too quiet", "empty", "not found"]
    if any(keyword in transcript.lower() for keyword in error_keywords):
        return []
    
    filler_words = ['um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'well', 'actually', 'basically', 'literally', 'right']
    found_fillers = []
    
    transcript_lower = transcript.lower()
    for filler in filler_words:
        if filler in transcript_lower:
            count = transcript_lower.count(filler)
            found_fillers.extend([filler] * count)
    
    unique_fillers = list(set(found_fillers))
    logger.info(f"Found {len(found_fillers)} filler words: {unique_fillers}")
    return unique_fillers

def analyze_audio_features(audio_path):
    """Analyze audio features using librosa"""
    try:
        if not audio_path or not os.path.exists(audio_path):
            logger.error("Invalid audio path")
            return {'pause_count': 0, 'avg_pitch': 0, 'duration': 0}
        
        logger.info(f"Analyzing audio features: {audio_path}")
        y, sr_rate = librosa.load(audio_path, sr=None)
        
        if len(y) == 0:
            logger.warning("Empty audio data")
            return {'pause_count': 0, 'avg_pitch': 0, 'duration': 0}
        
        duration = len(y) / sr_rate
        logger.info(f"Audio: duration={duration:.2f}s, sample_rate={sr_rate}, samples={len(y)}")
        
        # Calculate pauses
        frame_length = 2048
        hop_length = 512
        
        rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]
        
        if len(rms) == 0:
            return {'pause_count': 0, 'avg_pitch': 0, 'duration': duration}
        
        silence_threshold = np.percentile(rms, 25)
        
        pause_frames = rms < silence_threshold
        pause_count = 0
        consecutive_silence = 0
        min_pause_frames = max(1, int(0.5 * sr_rate / hop_length))
        
        for is_silence in pause_frames:
            if is_silence:
                consecutive_silence += 1
            else:
                if consecutive_silence >= min_pause_frames:
                    pause_count += 1
                consecutive_silence = 0
        
        if consecutive_silence >= min_pause_frames:
            pause_count += 1
        
        # Calculate pitch
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr_rate, threshold=0.1)
        pitch_values = []
        
        for t in range(pitches.shape[1]):
            index = magnitudes[:, t].argmax()
            pitch = pitches[index, t]
            if 50 < pitch < 1000:
                pitch_values.append(pitch)
        
        avg_pitch = np.mean(pitch_values) if pitch_values else 0
        
        logger.info(f"Audio features: pauses={pause_count}, avg_pitch={avg_pitch:.2f}Hz")
        
        return {
            'pause_count': pause_count,
            'avg_pitch': float(avg_pitch),
            'duration': duration
        }
        
    except Exception as e:
        logger.error(f"Error analyzing audio features: {e}")
        logger.error(traceback.format_exc())
        return {'pause_count': 0, 'avg_pitch': 0, 'duration': 0}

def analyze_audio(video_path):
    """Enhanced audio analysis"""
    logger.info(f"=== Starting audio analysis: {video_path} ===")
    
    try:
        if not os.path.exists(video_path):
            logger.error("Video file not found")
            return get_fallback_audio_analysis("Video file not found")
        
        file_size = os.path.getsize(video_path)
        if file_size == 0:
            logger.error("Empty video file")
            return get_fallback_audio_analysis("Empty video file")
        
        logger.info(f"Video file validated: {file_size} bytes")
        
        # Extract audio
        audio_path = extract_audio_from_video(video_path)
        
        if not audio_path:
            logger.warning("Audio extraction failed")
            return get_fallback_audio_analysis("Audio extraction failed")
        
        logger.info("Audio extracted successfully")
        
        # Analyze features
        audio_features = analyze_audio_features(audio_path)
        logger.info(f"Audio features: {audio_features}")
        
        # Transcribe
        transcript = transcribe_audio(audio_path)
        logger.info(f"Transcript: {transcript[:100]}...")
        
        # Calculate metrics
        wpm = calculate_speaking_rate(transcript, audio_features['duration'])
        fillers = detect_filler_words(transcript)
        
        # Grammar check (simplified)
        grammar_mistakes = 0
        if transcript and not any(err in str(transcript).lower() for err in 
                                ["could not", "unavailable", "failed", "no speech", "empty", "not found"]):
            sentences = str(transcript).split('.')
            for sentence in sentences:
                words = sentence.strip().split()
                if words:
                    for i, word in enumerate(words):
                        if word.lower() == 'i' and i > 0:
                            grammar_mistakes += 1
        
        # Cleanup
        try:
            if audio_path and os.path.exists(audio_path):
                os.unlink(audio_path)
                logger.info("Cleaned up audio file")
        except Exception as e:
            logger.warning(f"Could not delete audio file: {e}")
        
        result = {
            "wpm": wpm,
            "fillers": fillers,
            "grammar_mistakes": grammar_mistakes,
            "pause_count": audio_features['pause_count'],
            "transcript": transcript or "Transcription unavailable",
            "avg_pitch": audio_features['avg_pitch'],
            "duration": audio_features['duration']
        }
        
        logger.info(f"Audio analysis complete: WPM={wpm}, Fillers={len(fillers)}, Grammar={grammar_mistakes}")
        return result
        
    except Exception as e:
        logger.error(f"Audio analysis error: {e}")
        logger.error(traceback.format_exc())
        return get_fallback_audio_analysis(str(e))

def get_fallback_audio_analysis(error_msg):
    """Fallback audio analysis"""
    return {
        "wpm": 0,
        "fillers": [],
        "grammar_mistakes": 0,
        "pause_count": 0,
        "transcript": f"Analysis failed: {error_msg}",
        "avg_pitch": 0,
        "duration": 0
    }

def analyze_posture(video_path):
    """Enhanced posture analysis"""
    logger.info(f"=== Starting posture analysis: {video_path} ===")
    
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        logger.error("Could not open video file")
        cap.release()
        return get_fallback_posture_analysis("Could not open video file")
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    logger.info(f"Video: {width}x{height}, {fps}fps, {total_frames} frames")
    
    if fps <= 0 or total_frames <= 0:
        logger.error("Invalid video properties")
        cap.release()
        return get_fallback_posture_analysis("Invalid video properties")
    
    frame_skip = max(1, int(fps / 3))
    logger.info(f"Processing every {frame_skip} frame(s)")
    
    eye_contact_low = 0
    slouch_frames = 0
    head_pose_issues = 0
    shoulder_alignment_issues = 0
    total_processed_frames = 0
    
    try:
        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % frame_skip != 0:
                frame_count += 1
                continue
            
            total_processed_frames += 1
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            pose_results = pose.process(rgb_frame)
            face_results = face_mesh.process(rgb_frame)
            
            if pose_results.pose_landmarks:
                landmarks = pose_results.pose_landmarks.landmark
                
                left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
                right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
                nose = landmarks[mp_pose.PoseLandmark.NOSE]
                left_ear = landmarks[mp_pose.PoseLandmark.LEFT_EAR]
                right_ear = landmarks[mp_pose.PoseLandmark.RIGHT_EAR]
                
                # Shoulder alignment
                shoulder_diff = abs(left_shoulder.y - right_shoulder.y)
                if shoulder_diff > 0.05:
                    slouch_frames += 1
                
                if abs(left_shoulder.x - right_shoulder.x) > 0.01:
                    shoulder_slope = abs((left_shoulder.y - right_shoulder.y) / 
                                       (left_shoulder.x - right_shoulder.x))
                    if shoulder_slope > 0.1:
                        shoulder_alignment_issues += 1
                
                # Head pose
                if left_ear.visibility > 0.5 and right_ear.visibility > 0.5:
                    ear_diff = abs(left_ear.y - right_ear.y)
                    if ear_diff > 0.03:
                        head_pose_issues += 1
                
                if nose.y > (left_shoulder.y + right_shoulder.y) / 2:
                    head_pose_issues += 1
            
            # Eye contact
            if face_results.multi_face_landmarks:
                for face_landmarks in face_results.multi_face_landmarks:
                    left_eye_indices = [33, 133, 157, 158, 159, 160, 161, 246]
                    right_eye_indices = [362, 263, 384, 385, 386, 387, 388, 466]
                    
                    left_eye_points = []
                    right_eye_points = []
                    
                    for idx in left_eye_indices:
                        if idx < len(face_landmarks.landmark):
                            left_eye_points.append([face_landmarks.landmark[idx].x, 
                                                   face_landmarks.landmark[idx].y])
                    
                    for idx in right_eye_indices:
                        if idx < len(face_landmarks.landmark):
                            right_eye_points.append([face_landmarks.landmark[idx].x, 
                                                   face_landmarks.landmark[idx].y])
                    
                    if left_eye_points and right_eye_points:
                        left_eye_center = np.mean(left_eye_points, axis=0)
                        right_eye_center = np.mean(right_eye_points, axis=0)
                        eye_center_x = (left_eye_center[0] + right_eye_center[0]) / 2
                        face_center_x = face_landmarks.landmark[1].x
                        
                        if abs(eye_center_x - face_center_x) > 0.05:
                            eye_contact_low += 1
            else:
                eye_contact_low += 1
            
            frame_count += 1
            
            if total_processed_frames % 20 == 0:
                logger.info(f"Processed {total_processed_frames} frames...")
    
    except Exception as e:
        logger.error(f"Error during posture analysis: {e}")
        logger.error(traceback.format_exc())
        cap.release()
        return get_fallback_posture_analysis(f"Analysis error: {str(e)}")
    
    finally:
        cap.release()
    
    logger.info(f"Posture analysis complete: {total_processed_frames} frames processed")
    
    # Calculate scores
    posture_score = calculate_posture_score(total_processed_frames, slouch_frames, 
                                           head_pose_issues, shoulder_alignment_issues)
    
    if posture_score >= 80:
        posture_quality = "Excellent"
    elif posture_score >= 60:
        posture_quality = "Good"
    elif posture_score >= 40:
        posture_quality = "Fair"
    else:
        posture_quality = "Poor"
    
    eye_contact_percentage = (eye_contact_low / total_processed_frames) * 100 if total_processed_frames > 0 else 100
    if eye_contact_percentage <= 20:
        eye_contact_quality = "Excellent"
    elif eye_contact_percentage <= 40:
        eye_contact_quality = "Good"
    elif eye_contact_percentage <= 60:
        eye_contact_quality = "Fair"
    else:
        eye_contact_quality = "Poor"
    
    gestures = []
    if total_processed_frames > 0:
        if slouch_frames / total_processed_frames < 0.3:
            gestures.append("Good shoulder posture")
        else:
            gestures.append("Needs posture correction")
        
        if eye_contact_quality in ["Excellent", "Good"]:
            gestures.append("Good eye contact")
        else:
            gestures.append("Limited eye contact")
    
    result = {
        "confidence_score": posture_score / 10,
        "posture": posture_quality,
        "gestures": gestures if gestures else ["Basic posture detected"],
        "eye_contact": eye_contact_quality,
        "facial_expressions": ["Engaged expression"] if total_processed_frames > 0 else ["No expressions detected"]
    }
    
    logger.info(f"Posture result: {result}")
    return result

def calculate_posture_score(total_frames, slouch_frames, head_pose_issues, shoulder_alignment_issues):
    """Calculate posture score"""
    if total_frames == 0:
        return 50
    
    slouch_penalty = (slouch_frames / total_frames) * 40
    head_pose_penalty = (head_pose_issues / total_frames) * 30
    shoulder_penalty = (shoulder_alignment_issues / total_frames) * 30
    
    score = max(0, 100 - slouch_penalty - head_pose_penalty - shoulder_penalty)
    return round(score, 1)

def get_fallback_posture_analysis(error_msg):
    """Fallback posture analysis"""
    return {
        "confidence_score": 5,
        "posture": "Analysis unavailable",
        "gestures": [f"Analysis failed: {error_msg}"],
        "eye_contact": "Analysis unavailable",
        "facial_expressions": ["Analysis failed"]
    }

def generate_recommendations(user_audio, role_audio, user_body, role_body):
    """Generate recommendations"""
    speech_recommendations = []
    body_recommendations = []
    
    if user_audio and role_audio:
        user_wpm = user_audio.get("wpm", 0)
        role_wpm = role_audio.get("wpm", 0)
        
        if user_wpm > 0 and role_wpm > 0:
            pace_diff = user_wpm - role_wpm
            if pace_diff < -30:
                speech_recommendations.append("Increase your speaking pace - you're speaking significantly slower than your role model")
            elif pace_diff < -15:
                speech_recommendations.append("Try to speak a bit faster to match your role model's natural pace")
            elif pace_diff > 30:
                speech_recommendations.append("Slow down your speaking pace - you're speaking much faster than your role model")
            elif pace_diff > 15:
                speech_recommendations.append("Try to slow down slightly to match your role model's measured pace")
        
        user_filler_count = len(user_audio.get("fillers", []))
        role_filler_count = len(role_audio.get("fillers", []))
        
        if user_filler_count > role_filler_count + 2:
            user_fillers = user_audio.get("fillers", [])
            if user_fillers:
                speech_recommendations.append(f"Reduce filler words like '{', '.join(user_fillers[:3])}' - practice pausing instead")
    
    elif user_audio:
        user_wpm = user_audio.get("wpm", 0)
        if user_wpm > 0:
            if user_wpm < 100:
                speech_recommendations.append("Your speaking pace is quite slow - try to speak more confidently")
            elif user_wpm > 200:
                speech_recommendations.append("You're speaking very fast - slow down for clarity")
        
        if len(user_audio.get("fillers", [])) > 5:
            speech_recommendations.append("You use many filler words - practice speaking with intentional pauses")
    
    if user_body:
        user_confidence = user_body.get("confidence_score", 0)
        user_posture = user_body.get("posture", "Poor")
        user_eye_contact = user_body.get("eye_contact", "Poor")
        
        if user_confidence < 7:
            body_recommendations.append(f"Work on your confidence (current: {user_confidence}/10) - practice in front of a mirror")
        
        if user_posture in ["Poor", "Fair"]:
            body_recommendations.append(f"Improve your posture (current: {user_posture}) - sit up straight with shoulders back")
        
        if user_eye_contact in ["Poor", "Fair"]:
            body_recommendations.append(f"Improve eye contact (current: {user_eye_contact}) - look at the camera more")
    
    if not speech_recommendations:
        speech_recommendations.append("Your speech patterns are good! Maintain your current pace and clarity.")
    
    if not body_recommendations:
        body_recommendations.append("Your body language is effective! Continue maintaining good posture.")
    
    return {
        "speech": speech_recommendations[:3],
        "body_language": body_recommendations[:3]
    }

def generate_overall_assessment(user_audio, role_audio, user_body, role_body):
    """Generate overall assessment"""
    if not user_audio and not user_body:
        return "Please upload at least one video for analysis"
    
    aspects = []
    
    if user_audio:
        wpm = user_audio.get("wpm", 0)
        if wpm == 0:
            aspects.append("no detectable speech")
        elif wpm < 100:
            aspects.append("slow speaking pace")
        elif wpm > 200:
            aspects.append("fast speaking pace")
        else:
            aspects.append("good speaking pace")
    
    if user_body:
        confidence = user_body.get("confidence_score", 0)
        if confidence >= 8:
            aspects.append("high confidence")
        elif confidence >= 5:
            aspects.append("moderate confidence")
        else:
            aspects.append("low confidence")
    
    if aspects:
        return f"Overall, you demonstrate {', '.join(aspects)}. Focus on the recommendations below to improve."
    return "Analysis completed. Review the detailed results below."

def generate_action_plan(recommendations):
    """Generate action plan"""
    action_plan = []
    
    speech_recs = recommendations.get("speech", [])
    for i, rec in enumerate(speech_recs[:2]):
        action_plan.append(f"Week {i+1}: {rec} - Practice daily for 10 minutes")
    
    body_recs = recommendations.get("body_language", [])
    for i, rec in enumerate(body_recs[:2]):
        action_plan.append(f"Week {i+2}: {rec} - Record yourself and review")
    
    if len(action_plan) < 4:
        action_plan.extend([
            "Week 3: Practice speaking in front of a mirror for 15 minutes daily",
            "Week 4: Record a 5-minute speech and analyze your improvement"
        ])
    
    return action_plan[:4]

# ===============================
# SocketIO event handler
# ===============================
@socketio.on("start_analysis")
def handle_start_analysis(data):
    """Handle analysis request"""
    logger.info("=" * 80)
    logger.info("📩 RECEIVED START_ANALYSIS REQUEST")
    logger.info("=" * 80)
    
    try:
        emit("analysis_progress", {"status": "Starting analysis..."})
        
        logger.info(f"Data keys: {list(data.keys()) if data else 'No data'}")
        
        user_data = data.get("user")
        role_model_data = data.get("roleModel")
        
        if user_data:
            logger.info(f"User data: type={type(user_data)}, length={len(user_data)}")
        if role_model_data:
            logger.info(f"Role model data: type={type(role_model_data)}, length={len(role_model_data)}")
        
        if not user_data and not role_model_data:
            error_msg = "No video data provided"
            logger.error(error_msg)
            emit("analysis_error", {"error": error_msg})
            return
        
        result = {}
        start_time = time.time()
        
        # Analyze user video
        if user_data:
            logger.info("🔍 Analyzing user video...")
            emit("analysis_progress", {"status": "Analyzing your video..."})
            
            try:
                if isinstance(user_data, list):
                    user_bytes = bytes(user_data)
                else:
                    user_bytes = bytes(user_data)
                
                logger.info(f"User bytes size: {len(user_bytes)}")
                user_video_path = save_temp_file(user_bytes, "_user.webm")
                logger.info(f"Saved user video to: {user_video_path}")
                
                if not os.path.exists(user_video_path):
                    raise Exception("Failed to save user video file")
                
                emit("analysis_progress", {"status": "Analyzing your audio..."})
                user_audio = analyze_audio(user_video_path)
                
                emit("analysis_progress", {"status": "Analyzing your body language..."})
                user_posture = analyze_posture(user_video_path)
                
                result["user_audio"] = user_audio
                result["user_body"] = user_posture
                
                try:
                    if os.path.exists(user_video_path):
                        os.unlink(user_video_path)
                        logger.info("Cleaned up user temp file")
                except Exception as cleanup_error:
                    logger.warning(f"Could not clean up user file: {cleanup_error}")
                    
            except Exception as e:
                logger.error(f"Error analyzing user video: {e}")
                logger.error(traceback.format_exc())
                result["user_audio"] = get_fallback_audio_analysis(str(e))
                result["user_body"] = get_fallback_posture_analysis(str(e))
        
        # Analyze role model video
        if role_model_data:
            logger.info("🔍 Analyzing role model video...")
            emit("analysis_progress", {"status": "Analyzing role model video..."})
            
            try:
                if isinstance(role_model_data, list):
                    role_bytes = bytes(role_model_data)
                else:
                    role_bytes = bytes(role_model_data)
                
                logger.info(f"Role bytes size: {len(role_bytes)}")
                role_model_video_path = save_temp_file(role_bytes, "_role.webm")
                logger.info(f"Saved role model video to: {role_model_video_path}")
                
                if not os.path.exists(role_model_video_path):
                    raise Exception("Failed to save role model video file")
                
                emit("analysis_progress", {"status": "Analyzing role model audio..."})
                role_audio = analyze_audio(role_model_video_path)
                
                emit("analysis_progress", {"status": "Analyzing role model body language..."})
                role_posture = analyze_posture(role_model_video_path)
                
                result["role_audio"] = role_audio
                result["role_body"] = role_posture
                
                try:
                    if os.path.exists(role_model_video_path):
                        os.unlink(role_model_video_path)
                        logger.info("Cleaned up role model temp file")
                except Exception as cleanup_error:
                    logger.warning(f"Could not clean up role model file: {cleanup_error}")
                    
            except Exception as e:
                logger.error(f"Error analyzing role model video: {e}")
                logger.error(traceback.format_exc())
                result["role_audio"] = get_fallback_audio_analysis(str(e))
                result["role_body"] = get_fallback_posture_analysis(str(e))
        
        # Generate recommendations
        try:
            logger.info("💡 Generating recommendations...")
            emit("analysis_progress", {"status": "Generating recommendations..."})
            
            recommendations = generate_recommendations(
                result.get("user_audio"),
                result.get("role_audio"),
                result.get("user_body"),
                result.get("role_body")
            )
            
            result["recommendations"] = recommendations
            result["overall_assessment"] = generate_overall_assessment(
                result.get("user_audio"),
                result.get("role_audio"),
                result.get("user_body"),
                result.get("role_body")
            )
            result["action_plan"] = generate_action_plan(recommendations)
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            result["recommendations"] = {
                "speech": ["Focus on clear speech and confident delivery"],
                "body_language": ["Maintain good posture and eye contact"]
            }
            result["overall_assessment"] = "Analysis completed. Review results for specific insights."
            result["action_plan"] = [
                "Week 1: Practice speaking clearly for 10 minutes daily",
                "Week 2: Work on maintaining good posture during conversations",
                "Week 3: Record and review your speaking practice sessions",
                "Week 4: Focus on implementing all improvements together"
            ]
        
        analysis_time = time.time() - start_time
        logger.info(f"✅ Analysis complete in {analysis_time:.2f} seconds")
        logger.info(f"Results: User audio={bool(result.get('user_audio'))}, "
                   f"User body={bool(result.get('user_body'))}, "
                   f"Role audio={bool(result.get('role_audio'))}, "
                   f"Role body={bool(result.get('role_body'))}")
        
        logger.info("Emitting analysis_result...")
        emit("analysis_result", result)
        logger.info("Result emitted successfully")
        
    except Exception as e:
        logger.error(f"❌ CRITICAL ERROR: {e}")
        logger.error(traceback.format_exc())
        emit("analysis_error", {"error": f"Analysis failed: {str(e)}"})

# ===============================
# Connection handlers
# ===============================
@socketio.on('connect')
def handle_connect():
    logger.info('✅ Client connected')
    emit('connection_status', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    logger.info('❌ Client disconnected')

@socketio.on_error()
def error_handler(e):
    logger.error(f'SocketIO error: {e}')
    logger.error(traceback.format_exc())

# ===============================
# HTTP endpoints
# ===============================
@app.route('/health')
def health_check():
    return {
        "status": "healthy",
        "message": "Inspiration Analyzer API is running",
        "timestamp": time.time()
    }

@app.route('/')
def index():
    return {
        "message": "Inspiration Analyzer API",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "websocket": "socket.io connection"
        }
    }

@app.errorhandler(404)
def not_found(e):
    return {"error": "Endpoint not found"}, 404

@app.errorhandler(500)
def internal_error(e):
    logger.error(f"Server error: {e}")
    return {"error": "Internal server error"}, 500

# ===============================
# Main
# ===============================
if __name__ == "__main__":
    logger.info("=" * 80)
    logger.info("🚀 STARTING INSPIRATION ANALYZER SERVER")
    logger.info("=" * 80)
    logger.info("Available endpoints:")
    logger.info("   - HTTP: http://localhost:5000/")
    logger.info("   - Health: http://localhost:5000/health")
    logger.info("   - WebSocket: ws://localhost:5000/socket.io/")
    logger.info("=" * 80)
    
    try:
        socketio.run(
            app,
            host="0.0.0.0",
            port=5000,
            debug=True,
            allow_unsafe_werkzeug=True,
            log_output=True
        )
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        logger.error(traceback.format_exc())
    except KeyboardInterrupt:
        logger.info("Shutting down server...")
        executor.shutdown(wait=True)