// ==========================
// 📦 Import các module cần thiết
// ==========================
require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // ✅ import app có routes (productRoutes, orderRoutes...)

// ==========================
// 🌐 Cấu hình Socket.IO
// ==========================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Cho phép dùng Socket.IO trong các controller
app.set('io', io);

// ==========================
// ⚡ Sự kiện kết nối Socket.IO
// ==========================
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// ==========================
// 🗄️ Kết nối MongoDB Atlas
// ==========================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    // ==========================
    // 🚀 Khởi động server
    // ==========================
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () =>
      console.log(`🚀 Server đang chạy ở cổng ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ==========================
// 🧩 Route kiểm tra (chung)
// ==========================
app.get('/', (req, res) => {
  res.send('✅ Server và MongoDB Atlas đã kết nối thành công!');
});
