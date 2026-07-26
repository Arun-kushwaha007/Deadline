import dotenv from 'dotenv';
dotenv.config(); 

// console.log('[ENV CHECK]', {
//   FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
//   FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
//   FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.slice(0, 30) + '...',
// });

import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server as socketIO } from 'socket.io';
import { createClient } from 'redis';
import { Resend } from 'resend';
import './config/firebaseAdmin.js'; 
// import initializeScheduler from './services/schedulerService.js'; 
import initializeScheduler from './services/schedulerService.js';
// Firebase Admin Environment Check
if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
  console.warn('⚠️ Firebase Admin SDK not initialized properly. Missing environment variables. correct it');
}

const app = express();
const server = http.createServer(app);

// Redis Setup
const redisUrl = process.env.REDIS_URL || 
  (process.env.REDIS_HOST ? `redis://default:${process.env.REDIS_PASSWORD || ''}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}` : 'redis://localhost:6379');

const redisClient = createClient({
  url: redisUrl.startsWith('redis://') || redisUrl.startsWith('rediss://') ? redisUrl : `redis://${redisUrl}`,
});
redisClient.connect().catch(err => console.error('❌ Redis connection error:', err));

// Resend Setup
if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY is missing. Email functionality may not work.');
}
const resend = new Resend(process.env.RESEND_API_KEY);

// Socket.IO Setup
const allowedOrigins = [
  'http://localhost:5173', // Local development frontend
  'http://localhost:3000',
  'https://deadline-pobb.onrender.com',
  'https://collabnest-iota.vercel.app',
  'https://collab-nest-home.vercel.app'
];

if (process.env.CLIENT_ORIGIN) {
  const origins = process.env.CLIENT_ORIGIN.split(',').map(o => o.trim());
  origins.forEach(origin => {
    if (origin && !allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  });
}

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

const io = new socketIO(server, {
  cors: corsOptions, // Use the dynamic corsOptions for Socket.IO
});

// Initialize Scheduler Service (after io and redisClient are available)
initializeScheduler(io, redisClient);

// Middleware
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // You might also consider CORP if COOP alone isn't enough,
  // but start with COOP.
  // res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); 
  next();
});
app.use(cors(corsOptions)); // Use the dynamic corsOptions for Express
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
import feedbackRoutes from './routes/feedbackRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/feedback', feedbackRoutes);

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
      // console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// Socket.IO Events
io.on('connection', async (socket) => {
  // console.log('🟢 User connected:', socket.id);

  socket.on('register', async (userId) => {
    if (!userId) {
      console.warn(`[Socket Register] Attempt to register with undefined userId for socket ${socket.id}`);
      return;
    }
    socket.userId = userId; 
    await redisClient.set(`socket:${userId}`, socket.id);
    // console.log(`✅ Registered user ${userId} with socket ${socket.id}`);

    // Join organization rooms
    try {
      const User = mongoose.model('User'); 
      const Organization = mongoose.model('Organization'); 

      const user = await User.findOne({ userId: userId });
      if (user) {
        const organizations = await Organization.find({ 'members.userId': userId });
        organizations.forEach(org => {
          const roomName = `org:${org._id}`;
          socket.join(roomName);
          // console.log(`[Socket Register] User ${userId} (${socket.id}) joined room ${roomName}`);
        });
      } else {
        console.warn(`[Socket Register] User with userId ${userId} not found in database.`);
      }
    } catch (error) {
      console.error(`[Socket Register] Error joining organization rooms for user ${userId}:`, error);
    }
  });

  socket.on('disconnect', async () => {
    // console.log(`🔴 User ${socket.userId || socket.id} disconnected`);
    if (socket.userId) {
      try {
        await redisClient.del(`socket:${socket.userId}`);
        // console.log(`[Socket Disconnect] Removed user ${socket.userId} from Redis.`);
     
      } catch (err) {
        console.error(`[Socket Disconnect] Redis DEL error for user ${socket.userId}:`, err);
      }
    } else {
     
      try {
        const keys = await redisClient.keys('socket:*'); 
        for (const key of keys) {
          const socketId = await redisClient.get(key);
          if (socketId === socket.id) {
            await redisClient.del(key);
            // console.log(`[Socket Disconnect Fallback] Removed key ${key} for socket ${socket.id}`);
            break;
          }
        }
      } catch (err) {
        console.error('[Socket Disconnect Fallback] Redis error:', err);
      }
    }
  });
});

startServer();
