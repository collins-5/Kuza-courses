require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./lib/db');
const courseEndpoints = require('./routes/courses');
const authEndpoints = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Hello, World!'));

app.use('/api/auth', authEndpoints);
app.use('/api/courses', courseEndpoints);

const port = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
};

start();