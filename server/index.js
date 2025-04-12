const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');           // <- Added
const socketIo = require('socket.io');  // <- Added

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// SOCKET.IO SERVER SETUP
const server = http.createServer(app);            // <- Replace app.listen with this
const io = socketIo(server, {
  cors: {
    origin: "*",  // Replace with your frontend URL in production
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected');

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

// Example function to emit notifications
function sendReminder(taskId, userId) {
  io.emit('task-reminder', { taskId, userId });
}

// Make it available in other files if needed
module.exports = { io, sendReminder };

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
