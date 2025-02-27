// import app from './app.js';

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import startupRoutes from './routes/startupRoutes.js';
import investorRoutes from './routes/investorRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import pitchRoutes from './routes/pitchRoutes.js';
import businessPlanRoutes from './routes/businessPlanRoutes.js';
import InvestmentRequestRoutes from './routes/investmentRequestRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust this to match the frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/startups', protect, startupRoutes);
app.use('/api/investors', protect, investorRoutes);
app.use('/api/matches', protect, matchRoutes);
app.use('/api/pitch-evaluation', protect, pitchRoutes);
app.use('/api/business-plans', protect, businessPlanRoutes);
app.use('/api/investment-request', protect, InvestmentRequestRoutes);

// WebSocket (Socket.io) Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('chatMessage', ({ roomId, message, sender }) => {
    // Broadcast message to all users in the room
    io.to(roomId).emit('message', { sender, message, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the merged server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
