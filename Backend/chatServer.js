// // server/chatServer.js
// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173",      // adjust this to match the frontend url
//     methods: ["GET", "POST"]
//    } 
// });

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('joinRoom', (roomId) => {
//     socket.join(roomId);
//     console.log(`Socket ${socket.id} joined room ${roomId}`);
//   });

//   socket.on('chatMessage', ({ roomId, message, sender }) => {
//     // Broadcast message to all users in the room
//     io.to(roomId).emit('message', { sender, message, timestamp: new Date() });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// server.listen(5000, () => {
//   console.log('Chat server running on port 5000');
// });
