
const { OpenAI } = require('openai');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { exec } = require('child_process');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend's origin
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Client Configuration
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  screenTime: { type: Number, default: 0 },
  topPushupsAllTime: { type: Number, default: 0 },
  topSitupsAllTime: { type: Number, default: 0 },
  pushupDayStreak: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid or expired' });
    }
    req.userId = user.id;
    next();
  });
};

// Endpoint for user registration
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Endpoint for user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    res.json({ accessToken, user: { email: user.email } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Endpoint to update user data
app.post('/api/user-data', authenticateToken, async (req, res) => {
  const { screenTime, topPushupsAllTime, topSitupsAllTime, pushupDayStreak } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.screenTime = screenTime !== undefined ? screenTime : user.screenTime;
    user.topPushupsAllTime = topPushupsAllTime !== undefined ? topPushupsAllTime : user.topPushupsAllTime;
    user.topSitupsAllTime = topSitupsAllTime !== undefined ? topSitupsAllTime : user.topSitupsAllTime;
    user.pushupDayStreak = pushupDayStreak !== undefined ? pushupDayStreak : user.pushupDayStreak;

    await user.save();
    res.status(200).json({ message: 'User data updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user data' });
  }
});

// Endpoint to get user data
app.get('/api/user-data', authenticateToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Endpoint to launch exercise session
app.post('/api/launch-exercise', (req, res) => {
  const { exerciseType, duration } = req.body;

  const command = `/Users/marcvidal/Documents/Code/Uottahack/ActivAI/pushup/myenv/bin/python /Users/marcvidal/Documents/Code/Uottahack/ActivAI/pushup/main.py ${exerciseType} ${duration}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: 'Failed to start exercise session' });
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).json({ error: 'Failed to start exercise session' });
    }
    console.log(`Stdout: ${stdout}`);
    res.status(200).json({ message: 'Exercise session started successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});