const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketIo(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Store io instance globally for use in API routes
  global.io = io;

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join conversation room
    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.id} left conversation ${conversationId}`);
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      socket.to(data.conversationId).emit('user-typing', {
        userId: data.userId,
        userName: data.userName
      });
    });

    socket.on('typing-stop', (data) => {
      socket.to(data.conversationId).emit('user-stop-typing', {
        userId: data.userId
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});