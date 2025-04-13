// index.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server as socketIO } from 'socket.io';  // Import socket.io correctly

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new socketIO(server, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Store connected users
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    const userId = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    );
    if (userId) delete connectedUsers[userId];
    console.log(`User ${socket.id} disconnected`);
  });
});

app.set('io', io); // Make io accessible in routes

// ✅ Test route to trigger notification manually
app.get('/api/test-notification/:userId', (req, res) => {
  const userId = req.params.userId;
  const socketId = connectedUsers[userId];

  if (socketId) {
    io.to(socketId).emit('taskAssigned', {
      message: `🎉 Hello User ${userId}, you have a new test task!`
    });
    return res.status(200).json({ success: true, message: 'Notification sent!' });
  } else {
    return res.status(404).json({ success: false, message: 'User not connected' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
