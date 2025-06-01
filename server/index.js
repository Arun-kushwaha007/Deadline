import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server as socketIO } from 'socket.io';
import { createClient } from 'redis';
import { Resend } from 'resend';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🔹 Redis setup
const redisClient = createClient();
redisClient.connect().catch((err) => console.error('❌ Redis connection error:', err));

// 🔹 Resend setup
const resend = new Resend(process.env.RESEND_API_KEY);

// 🔹 Socket.IO setup
const io = new socketIO(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// 🔹 Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// 🔹 Attach global instances to app
app.set('io', io);
app.set('redis', redisClient);
app.set('resend', resend); // 🔥 Now available in all route files via req.app.get('resend')

// 🔹 Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/organizations', organizationRoutes);

// 🔹 MongoDB Connection & Server Start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Atlas connected');

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// 🔹 Socket.IO Logic
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('register', async (userId) => {
    try {
      await redisClient.set(userId, socket.id);
      console.log(`✅ Registered user ${userId} with socket ${socket.id}`);
    } catch (err) {
      console.error('Redis register error:', err);
    }
  });

  socket.on('disconnect', async () => {
    try {
      const keys = await redisClient.keys('*');
      for (const key of keys) {
        const socketId = await redisClient.get(key);
        if (socketId === socket.id) {
          await redisClient.del(key);
          console.log(`🔴 User ${key} disconnected`);
          break;
        }
      }
    } catch (err) {
      console.error('Redis disconnect error:', err);
    }
  });
});

// 🔹 Test Notification Route
app.get('/api/test-notification/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const socketId = await redisClient.get(userId);

    if (socketId) {
      io.to(socketId).emit('taskAssigned', {
        message: `🎉 Hello User ${userId}, you have a new test task!`,
      });
      return res.status(200).json({ success: true, message: 'Notification sent!' });
    }

    return res.status(404).json({ success: false, message: 'User not connected' });
  } catch (err) {
    console.error('Test notification error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🔹 Start Everything
startServer();
