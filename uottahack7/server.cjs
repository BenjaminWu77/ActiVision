import { OpenAI } from 'openai';
import express from 'express';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// MongoDB Client Configuration
const uri = process.env.MONGO_URI || '';
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
if (user.topPushupsAllTime + user.topSitupsAllTime < 50){
  level = "beginner";
}else if (user.topPushupsAllTime + user.topSitupsAllTime < 200){
  level = "intermediate";
}else if (user.topPushupsAllTime + user.topSitupsAllTime < 500){
  level = "advanced";
}else{
  level = "expert";
}

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

  const prompt = `Recommend five at home gym equipment under $100 CAD for a ${level} fitness enthusiast.`;

  try{
    const analysis = await callOpenAI(prompt);
    res.json({ analysis });
  }catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }

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

  async function callOpenAI(prompt) {
  try {
    const response = await openai.createChatCompletion({
      model: 'ft:gpt-3.5-turbo-0125:personal::A7oftNTz',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ]
    });

    return response.data.choices[0]?.message?.content || 'No response';
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    throw new Error('Failed to communicate with OpenAI');
  }
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});