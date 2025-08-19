import { qs, getParams, getIceServers } from './utils.js';

const { roomId, name } = getParams();
qs('roomLabel').textContent = `Room: ${roomId} — You: ${name}`;

const socket = io(); // same-origin

// video grid
const videosEl = qs('videos');

let localStream;
const peers = new Map(); // socketId -> { pc, stream, name }

const media = { cam: true, mic: true };

async function initMedia() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  addVideoTile('You', localStream, true);
}
initMedia().catch(err => alert('Failed to get camera/mic: ' + err.message));

socket.emit('join-room', { roomId, name });

socket.on('peers', (list) => {
  // create offers to each existing peer
  list.forEach(p => createPeerConnection(p.socketId, p.name, true));
});

socket.on('user-joined', ({ socketId, name: peerName }) => {
  // new peer arrived; wait for their offer; but prepare pc
  createPeerConnection(socketId, peerName, false);
});

socket.on('user-left', ({ socketId }) => {
  removePeer(socketId);
});

socket.on('webrtc-offer', async ({ from, description, fromName }) => {
  const p = peers.get(from) || createPeerConnection(from, fromName, false);
  await p.pc.setRemoteDescription(description);
  const answer = await p.pc.createAnswer();
  await p.pc.setLocalDescription(answer);
  socket.emit('webrtc-answer', { to: from, description: p.pc.localDescription });
});

socket.on('webrtc-answer', async ({ from, description }) => {
  const p = peers.get(from);
  if (p) await p.pc.setRemoteDescription(description);
});

socket.on('webrtc-ice-candidate', async ({ from, candidate }) => {
  const p = peers.get(from);
  if (p && candidate) {
    try { await p.pc.addIceCandidate(candidate); } catch {}
  }
});

// Chat
const chatLog = qs('chatLog');
const chatInput = qs('chatInput');
const sendChatBtn = qs('sendChat');

function appendChat({ name, message, ts }) {
  const d = new Date(ts);
  const div = document.createElement('div');
  div.className = 'msg';
  div.textContent = `[${d.toLocaleTimeString()}] ${name}: ${message}`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}
sendChatBtn.onclick = () => {
  const message = chatInput.value.trim();
  if (!message) return;
  socket.emit('chat', { roomId, name, message });
  chatInput.value = '';
};
socket.on('chat', appendChat);

// UI controls
qs('toggleCam').onclick = () => {
  media.cam = !media.cam;
  localStream.getVideoTracks().forEach(t => t.enabled = media.cam);
};
qs('toggleMic').onclick = () => {
  media.mic = !media.mic;
  localStream.getAudioTracks().forEach(t => t.enabled = media.mic);
};
qs('leave').onclick = () => window.location.href = '/';

function addVideoTile(label, stream, isLocal=false, id=null) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  if (id) tile.dataset.peer = id;

  const v = document.createElement('video');
  v.playsInline = true;
  v.autoplay = true;
  if (isLocal) v.muted = true;
  v.srcObject = stream;

  const l = document.createElement('div');
  l.className = 'label';
  l.textContent = label;

  tile.appendChild(v);
  tile.appendChild(l);
  videosEl.appendChild(tile);
  return tile;
}

function removePeer(id) {
  const p = peers.get(id);
  if (!p) return;
  p.pc.close();
  peers.delete(id);
  [...videosEl.querySelectorAll('.tile')].forEach(t => {
    if (t.dataset.peer === id) t.remove();
  });
}

function createPeerConnection(id, peerName, isInitiator) {
  if (peers.has(id)) return peers.get(id);

  const pc = new RTCPeerConnection({ iceServers: getIceServers() });
  // add our tracks
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  // remote stream
  const remoteStream = new MediaStream();
  const tile = addVideoTile(peerName, remoteStream, false, id);

  pc.ontrack = (e) => {
    e.streams[0].getTracks().forEach(t => remoteStream.addTrack(t));
  };

  pc.onicecandidate = (e) => {
    if (e.candidate) socket.emit('webrtc-ice-candidate', { to: id, candidate: e.candidate });
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
      removePeer(id);
    }
  };

  const entry = { pc, stream: remoteStream, name: peerName, tile };
  peers.set(id, entry);

  if (isInitiator) {
    (async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('webrtc-offer', { to: id, description: pc.localDescription, fromName: name });
    })();
  }

  return entry;
}

// ===== Ava (local voice presence) helper =====
// We already add a static tile in HTML. Nothing else needed here.
// If later you want a live waveform, we can hook Web Audio API to mic/synth and draw on #avaTile.
