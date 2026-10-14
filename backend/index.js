import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import cors from 'cors';

import connection from './database/db.js';
import useRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import noteroute from './routes/notes.js';
import commentroute from './routes/comment.js';
import conversationroute from './routes/conversation.js';
import messageroute from './routes/message.js';
import uploadroute from './routes/upload.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const clientOrigin = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((s) => s.trim()) : '*';

connection(process.env.URL);

app.set('trust proxy', 1);
app.use(cors({
  origin: clientOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

const __dirname = path.resolve();
const staticOptions = {
  setHeaders: (res) => res.set('Cross-Origin-Resource-Policy', 'cross-origin'),
};
app.use('/images', express.static(path.join(__dirname, 'public/images'), staticOptions));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), staticOptions));

app.use('/api/users', useRoute);
app.use('/api/auth', authRoute);
app.use('/api/notes', noteroute);
app.use('/api/comments', commentroute);
app.use('/api/conversations', conversationroute);
app.use('/api/messages', messageroute);
app.use('/api/upload', uploadroute);

app.get('/', (req, res) => {
  res.send('welcome to home page');
});

// ---------- Chat (Socket.IO) on the same server ----------
const server = createServer(app);
const io = new Server(server, { cors: { origin: clientOrigin } });

let onlineUsers = [];
const addUser = (userId, socketId) => {
  onlineUsers = onlineUsers.filter((u) => u.userId !== userId);
  onlineUsers.push({ userId, socketId });
};
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
};
const getUser = (userId) => onlineUsers.find((u) => u.userId === userId);

io.on('connection', (socket) => {
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', onlineUsers);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const receiver = getUser(receiverId);
    // receiver offline: message is already saved via REST, they will see it on load
    if (receiver) io.to(receiver.socketId).emit('getMessage', { senderId, text });
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    io.emit('getUsers', onlineUsers);
  });
});

server.listen(port, () => console.log(`listening on port ${port}`));
