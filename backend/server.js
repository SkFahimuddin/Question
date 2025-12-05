const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const paperRoutes = require('./routes/paperRoutes');
const individualPaperRoutes = require('./routes/individualPaperRoutes');
const formatRoutes = require('./routes/formatRoutes');
const aiQuestionRoutes = require('./routes/aiQuestionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/paper', paperRoutes);
app.use('/api/individual-paper', individualPaperRoutes);
app.use('/api/formats', formatRoutes);
app.use('/api/ai-questions', aiQuestionRoutes);

const PORT = process.env.PORT || 5000;

// Use MongoDB Atlas from .env
const MONGO_URI = process.env.MONGO_URI;

console.log('Connecting to MongoDB...');

mongoose.connect(MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});

// Connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
