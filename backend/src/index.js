const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for local development
    methods: ['GET', 'POST']
  }
});

app.set('io', io); // Store io to be accessed in routes

io.on('connection', (socket) => {
  console.log('Dashboard connected for real-time updates:', socket.id);
  socket.on('disconnect', () => {
    console.log('Dashboard disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ingest', require('./routes/ingest'));
app.use('/api/segments', require('./routes/segments'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/webhooks', require('./routes/webhooks'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xeno_crm')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`CRM Backend & Real-time Socket Server running on port ${PORT}`);
});
