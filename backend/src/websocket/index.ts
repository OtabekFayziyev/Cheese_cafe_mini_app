import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { CONFIG } from '../config/env.js';

export function setupWebSocket(server: HTTPServer) {
  const io = new SocketServer(server, {
    cors: { origin: CONFIG.CORS_ORIGIN, credentials: true },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} joined order:${orderId}`);
    });

    socket.on('leave-order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log(`Socket ${socket.id} left order:${orderId}`);
    });

    socket.on('join-courier', (courierId: string) => {
      socket.join(`courier:${courierId}`);
      console.log(`Socket ${socket.id} joined courier:${courierId}`);
    });

    socket.on('leave-courier', (courierId: string) => {
      socket.leave(`courier:${courierId}`);
      console.log(`Socket ${socket.id} left courier:${courierId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function emitOrderUpdate(io: SocketServer, orderId: string, data: any) {
  io.to(`order:${orderId}`).emit('order-update', data);
}

export function emitCourierLocation(io: SocketServer, orderId: string, location: { lat: number; lng: number }) {
  io.to(`order:${orderId}`).emit('courier-location', location);
}
