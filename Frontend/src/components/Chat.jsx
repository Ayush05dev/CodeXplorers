// components/Chat.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams, useLocation } from 'react-router-dom';

const socket = io('http://localhost:3000', { transports: ['websocket'] }); // Change URL as needed

export default function Chat() {

    const { roomId } = useParams();
    const location = useLocation();
    // Optionally retrieve additional state if needed (investor, startup, etc.)
    const { investor, startup } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Join the specified room
    socket.emit('joinRoom', roomId);

    socket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Clean up the listener on unmount
    return () => {
      socket.off('message');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('chatMessage', { roomId, message: input, sender: investor ? investor.name : startup.name });
      setInput('');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Chat Room: {roomId}</h2>
      <div className="border p-2 h-64 overflow-y-scroll mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.sender}: </strong>
            <span>{msg.message}</span>
            <em className="text-xs ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</em>
          </div>
        ))}
      </div>
      <div className="flex">
        <input 
          className="flex-grow border p-2 rounded-l" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="px-4 bg-green-600 text-white rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
