const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

let io;

exports.initSocket = (server) => {
  io = new Server(server, { cors: { origin: process.env.CLIENT_URL, credentials: true } });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(id);
      if (!user) return next(new Error('auth'));
      socket.user = user;
      next();
    } catch { next(new Error('auth')); }
  });

  io.on('connection', async (socket) => {
    socket.join(`user:${socket.user._id}`);
    await User.findByIdAndUpdate(socket.user._id, { online: true });
    io.emit('presence', { userId: socket.user._id, online: true });

    socket.on('message:send', async ({ to, text, fileUrl }) => {
      let msg = await Message.create({ from: socket.user._id, to, text, fileUrl });
      msg = await Message.findById(msg._id).populate('from to', 'name avatar online');
      io.to(`user:${to}`).to(`user:${socket.user._id}`).emit('message:new', msg);
    });

    socket.on('typing', ({ to, typing }) => {
      io.to(`user:${to}`).emit('typing', { from: socket.user._id, typing });
    });

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.user._id, { online: false, lastSeen: new Date() });
      io.emit('presence', { userId: socket.user._id, online: false });
    });
  });
};

exports.getIO = () => io;
