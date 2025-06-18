import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server as socketIO } from 'socket.io';
import { createClient } from 'redis';
import { Resend } from 'resend';
import './config/firebaseAdmin.js'; // Initialize Firebase Admin SDK

// Load environment variables
dotenv.config();

// Firebase Admin Environment Check
if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
  console.warn('⚠️ Firebase Admin SDK not initialized properly. Missing environment variables.');
}

const app = express();
const server = http.createServer(app);

// Redis Setup
const redisClient = createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
redisClient.connect().catch(err => console.error('❌ Redis connection error:', err));

// Resend Setup
if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY is missing. Email functionality may not work.');
}
const resend = new Resend(process.env.RESEND_API_KEY);

// Socket.IO Setup
const io = new socketIO(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Attach global instances
app.set('io', io);
app.set('redis', redisClient);
app.set('resend', resend);

// Routes
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todos.js';

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

// Health check route
app.get('/api/health', (_, res) => {
  res.status(200).json({ status: 'Server is running 🚀' });
});

// Redis test route
app.get('/api/test-redis', async (req, res) => {
  try {
    await redisClient.setEx('test:key', 300, JSON.stringify({ message: 'Hello Redis!' }));
    const value = await redisClient.get('test:key');
    res.json({ value });
  } catch (err) {
    console.error('Redis test error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Socket Test Notification
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

// MongoDB & Server Init
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// Socket.IO Events
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

// Start the server
startServer();
