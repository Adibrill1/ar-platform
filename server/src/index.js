const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { requireAuth } = require('./middleware/clerkAuth');
const projectsRouter = require('./routes/projects');
const arRouter = require('./routes/ar');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AR Platform API is running!' });
});

app.use('/api/projects', requireAuth, projectsRouter);
app.use('/api/ar', arRouter);

// Global error handler – catches any unhandled errors and returns JSON
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
