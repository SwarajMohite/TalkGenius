import { qs, getParams } from './utils.js';

const { roomId, name } = getParams();
const askBtn = qs('askAi');
const out = qs('aiOut');
const sttStatus = qs('sttStatus');
const micBtn = qs('micToAI');
const voiceToggle = qs('avaVoiceToggle');

// ---- Collect meeting context from DOM chat ----
function collectRecentChat() {
  const lines = [...document.querySelectorAll('#chatLog .msg')].slice(-40);
  return lines.map(el => {
    const text = el.textContent;
    const m = text.match(/^\[(.*?)\]\s(.+?):\s([\s\S]*)$/);
    return m ? { ts: Date.now(), name: m[2], message: m[3] } : { ts: Date.now(), name: 'unknown', message: text };
  });
}
function approxSpeakerHistogram(recent) {
  return recent.reduce((acc, m) => {
    acc[m.name] = (acc[m.name] || 0) + 1;
    return acc;
  }, {});
}

// ---- TTS (browser-native) ----
let selectedVoice = null;
function pickVoice() {
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => /en/i.test(v.lang) && /(female|woman|Google US English|Samantha|Victoria|Jenny)/i.test(v.name))
                 || voices.find(v => /en/i.test(v.lang))
                 || voices[0] || null;
  selectedVoice = preferred;
}
if ('speechSynthesis' in window) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

function speakAva(text) {
  if (!voiceToggle.checked) return;
  if (!('speechSynthesis' in window)) return;

  const avaTile = document.getElementById('avaTile');
  avaTile.classList.add('speaking');

  const u = new SpeechSynthesisUtterance(text);
  if (selectedVoice) u.voice = selectedVoice;
  u.rate = 1.02;
  u.pitch = 1.0;
  u.volume = 1.0;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);

  u.onend = () => {
    avaTile.classList.remove('speaking');
  };
}

// ---- Ask Ava (existing flow + TTS) ----
askBtn.onclick = async () => {
  const prompt = qs('aiPrompt').value.trim();
  if (!prompt) return alert('Type a question for the AI.');

  out.textContent = 'Ava is thinking…';
  const recentChat = collectRecentChat();
  const speakers = approxSpeakerHistogram(recentChat);

  try {
    const r = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, prompt, recentChat, speakers })
    });
    const data = await r.json();
    if (data.error) throw new Error(data.error);
    out.textContent = data.text;
    speakAva(data.text);
  } catch (e) {
    out.textContent = 'AI error: ' + e.message;
  }
};

// ---- Speech-to-Text (browser-native) ----
let RecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null;

if (RecognitionCtor) {
  recognizer = new RecognitionCtor();
  recognizer.lang = 'en-US';
  recognizer.continuous = false;
  recognizer.interimResults = true;

  recognizer.onstart = () => {
    sttStatus.textContent = '🎙️ Listening… speak your question to Ava.';
  };
  recognizer.onend = () => {
    if (sttStatus.textContent.includes('Listening')) {
      sttStatus.textContent = '⏹️ Stopped listening.';
      setTimeout(()=> sttStatus.textContent = '', 1200);
    }
  };
  recognizer.onerror = (e) => {
    sttStatus.textContent = 'STT error: ' + (e.error || 'unknown');
    setTimeout(()=> sttStatus.textContent = '', 2000);
  };
  recognizer.onresult = (event) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalTranscript += t;
    }
    if (finalTranscript) {
      qs('aiPrompt').value = finalTranscript.trim();
      askBtn.click();
    } else {
      const interim = event.results[event.resultIndex][0].transcript;
      qs('aiPrompt').value = interim;
    }
  };

  micBtn.onclick = () => {
    try {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      recognizer.abort();
      recognizer.start();
    } catch (e) {
      sttStatus.textContent = 'Could not start mic: ' + e.message;
      setTimeout(()=> sttStatus.textContent = '', 2000);
    }
  };
} else {
  micBtn.disabled = true;
  micBtn.title = 'Speech recognition not supported in this browser.';
  sttStatus.textContent = 'Tip: Use Chrome/Edge/Safari for voice input.';
}
