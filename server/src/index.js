const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { requireAuth } = require('./middleware/clerkAuth');
const projectsRouter = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AR Platform API is running!' });
});

app.use('/api/projects', requireAuth, projectsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});