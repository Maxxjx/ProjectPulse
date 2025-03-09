import { Server } from 'socket.io';

let io;

export function initSocket(server) {
  if (process.env.ENABLE_REALTIME === 'true') {
    io = new Server(server, {
      cors: { origin: "*" }
    });

    io.on('connection', (socket) => {
      console.log('New client connected', socket.id);
      socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
      });
    });
  }
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized.');
  }
  return io;
}
