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

    // Handle messages read notification
    socket.on('messages-read', (data) => {
      socket.to(data.conversationId).emit('messages-marked-read', {
        conversationId: data.conversationId,
        userId: data.userId
      });
    });

    // Voice Call Events
    socket.on('initiate-call', (data) => {
      // Notify other users in conversation about incoming call
      socket.to(data.conversationId).emit('incoming-call', {
        callerId: data.callerId,
        callerName: data.callerName
      });
      console.log(`User ${data.callerId} initiated call in conversation ${data.conversationId}`);
    });

    socket.on('accept-call', (data) => {
      // Notify caller that call was accepted
      socket.to(data.conversationId).emit('call-accepted', {
        userId: data.userId
      });
      console.log(`User ${data.userId} accepted call in conversation ${data.conversationId}`);
    });

    socket.on('reject-call', (data) => {
      // Notify caller that call was rejected
      socket.to(data.conversationId).emit('call-rejected', {
        userId: data.userId
      });
      console.log(`User ${data.userId} rejected call in conversation ${data.conversationId}`);
    });

    socket.on('end-call', (data) => {
      // Notify other users that call ended
      socket.to(data.conversationId).emit('call-ended', {
        userId: data.userId
      });
      console.log(`User ${data.userId} ended call in conversation ${data.conversationId}`);
    });

    socket.on('call-signal', (data) => {
      // Forward WebRTC signaling data to other peers
      socket.to(data.conversationId).emit('call-signal', {
        userId: data.userId,
        signal: data.signal
      });
    });

    // Video Call Events (separate from voice call)
    socket.on('initiate-video-call', (data) => {
      socket.to(data.conversationId).emit('incoming-video-call', {
        callerId: data.callerId,
        callerName: data.callerName
      });
      console.log(`User ${data.callerId} initiated VIDEO call in conversation ${data.conversationId}`);
    });

    socket.on('accept-video-call', (data) => {
      socket.to(data.conversationId).emit('video-call-accepted', {
        userId: data.userId
      });
      console.log(`User ${data.userId} accepted VIDEO call in conversation ${data.conversationId}`);
    });

    socket.on('reject-video-call', (data) => {
      socket.to(data.conversationId).emit('video-call-rejected', {
        userId: data.userId
      });
      console.log(`User ${data.userId} rejected VIDEO call in conversation ${data.conversationId}`);
    });

    socket.on('end-video-call', (data) => {
      socket.to(data.conversationId).emit('video-call-ended', {
        userId: data.userId
      });
      console.log(`User ${data.userId} ended VIDEO call in conversation ${data.conversationId}`);
    });

    socket.on('video-call-signal', (data) => {
      socket.to(data.conversationId).emit('video-call-signal', {
        userId: data.userId,
        signal: data.signal
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