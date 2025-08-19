import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAiAdvice } from './gemini.js';
import { Rooms } from './rooms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, methods: ['GET','POST'] }
});

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const rooms = new Rooms();

/** --- AI endpoint (server-side; hides your Gemini key) --- */
app.post('/api/ai', async (req, res) => {
  try {
    const { roomId, prompt, recentChat, speakers } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const advice = await getAiAdvice({
      prompt,
      context: {
        roomId,
        recentChat,
        speakers
      }
    });
    res.json({ text: advice });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'AI error' });
  }
});

/** --- Socket.IO signaling --- */
io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, name }) => {
    rooms.addUser(roomId, socket.id, name);
    socket.join(roomId);

    // Notify others of the new user
    socket.to(roomId).emit('user-joined', { socketId: socket.id, name });

    // Send current peers to the newly joined user
    const peers = rooms.getPeers(roomId).filter(p => p.socketId !== socket.id);
    io.to(socket.id).emit('peers', peers);
  });

  // Forward WebRTC SDP offers/answers and ICE candidates
  socket.on('webrtc-offer', ({ to, description, fromName }) => {
    io.to(to).emit('webrtc-offer', { from: socket.id, description, fromName });
  });

  socket.on('webrtc-answer', ({ to, description }) => {
    io.to(to).emit('webrtc-answer', { from: socket.id, description });
  });

  socket.on('webrtc-ice-candidate', ({ to, candidate }) => {
    io.to(to).emit('webrtc-ice-candidate', { from: socket.id, candidate });
  });

  // Chat relay (used also as context for AI)
  socket.on('chat', ({ roomId, name, message }) => {
    io.to(roomId).emit('chat', { name, message, ts: Date.now() });
    rooms.appendChat(roomId, { name, message, ts: Date.now() });
  });

  socket.on('disconnect', () => {
    const { roomId, name } = rooms.removeUser(socket.id) || {};
    if (roomId) {
      socket.to(roomId).emit('user-left', { socketId: socket.id, name });
    }
  });
});

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
