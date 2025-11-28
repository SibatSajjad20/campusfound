import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user) {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
      
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      newSocket.on('connect', () => {
        if (import.meta.env.DEV) console.log('Connected to server');
        setSocket(newSocket);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
      });

      newSocket.on('disconnect', () => {
        if (import.meta.env.DEV) console.log('Disconnected from server');
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [user, token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};