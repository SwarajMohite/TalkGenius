from flask import Flask, request, jsonify, render_template
import whisper
import librosa
import numpy as np
import soundfile as sf
import os
import tempfile

app = Flask(__name__)

# Load whisper model once
model = whisper.load_model("base")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    file = request.files['audio']
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        file.save(tmp.name)
        audio_path = tmp.name

    # Transcription
    result = model.transcribe(audio_path)
    transcript = result["text"]

    # Analysis
    duration = librosa.get_duration(path=audio_path)
    words = transcript.split()
    wpm = len(words) / (duration / 60)

    filler_words = ["um", "uh", "like", "you know", "so"]
    filler_count = sum(transcript.lower().count(f) for f in filler_words)

    y, sr = librosa.load(audio_path)
    intervals = librosa.effects.split(y, top_db=25)
    num_pauses = len(intervals) - 1

    os.remove(audio_path)

    # Suggestions
    suggestions = []
    if wpm < 100:
        suggestions.append("Try to speak a little faster.")
    elif wpm > 160:
        suggestions.append("Slow down your pace.")
    if filler_count > 3:
        suggestions.append("Reduce filler words.")
    if num_pauses > 5:
        suggestions.append("Practice smoother transitions.")
    if not suggestions:
        suggestions.append("Excellent clarity and pace!")

    return jsonify({
        "transcript": transcript,
        "wpm": round(wpm, 1),
        "filler_count": filler_count,
        "pauses": num_pauses,
        "suggestions": suggestions
    })

if __name__ == "__main__":
    app.run(debug=True)
