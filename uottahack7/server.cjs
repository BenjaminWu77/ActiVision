
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5001;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('join-exercise-session', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined exercise session`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Database connection
mongoose.connect('MONGO DB HERE', { useNewUrlParser: true, useUnifiedTopology: true })
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
  todaysPushups: { type: Number, default: 0 },
  todaysSitups: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, '9^aY$D1@wF3kLz!7pX#6Tg2%mN8uRq&S*VJb0Z5hC+QeOjK', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid or expired' });
    }
    req.userId = user.id;
    next();
  });
};

// Generate Access Token
function generateAccessToken(user) {
  return jwt.sign({ id: user._id }, '9^aY$D1@wF3kLz!7pX#6Tg2%mN8uRq&S*VJb0Z5hC+QeOjK', { expiresIn: '10m' });
}

// Generate Refresh Token
function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTczNzI2MDU5OSwiaWF0IjoxNzM3MjYwNTk5fQ.oZAdN5GNAvWHZXmExJkxCErUa4WszqYxr9LPFPIGg_c', { expiresIn: '7d' });
}

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
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ accessToken, refreshToken, user: { email: user.email } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Endpoint to refresh token
app.post('/api/refresh-token', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: 'Refresh token is required' });
  }

  jwt.verify(token, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTczNzI2MDU5OSwiaWF0IjoxNzM3MjYwNTk5fQ.oZAdN5GNAvWHZXmExJkxCErUa4WszqYxr9LPFPIGg_c', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
});

// Endpoint to update user data
app.post('/api/user-data', authenticateToken, async (req, res) => {
  const { screenTime, topPushupsAllTime, topSitupsAllTime, todaysPushups, todaysSitups } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.screenTime = screenTime || user.screenTime;
    user.topPushupsAllTime = topPushupsAllTime || user.topPushupsAllTime;
    user.topSitupsAllTime = topSitupsAllTime || user.topSitupsAllTime;
    user.todaysPushups = todaysPushups || user.todaysPushups;
    user.todaysSitups = todaysSitups || user.todaysSitups;

    // Increment streak if either pushups or situps are performed
    if (todaysPushups || todaysSitups) {
      user.pushupDayStreak = (user.pushupDayStreak || 7) + 1;
    }

    await user.save();
    res.status(200).json({ message: 'User data updated successfully' });
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

    res.status(200).json({
      screenTime: user.screenTime,
      topPushupsAllTime: user.topPushupsAllTime,
      topSitupsAllTime: user.topSitupsAllTime,
      pushupDayStreak: user.pushupDayStreak || 7,
      todaysPushups: user.todaysPushups,
      todaysSitups: user.todaysSitups,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Endpoint to get today's stats
app.get('/api/todays-stats', authenticateToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const todaysStats = {
      pushups: user.todaysPushups,
      situps: user.todaysSitups,
      screenTime: user.screenTime,
    };

    res.status(200).json(todaysStats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todays stats' });
  }
});

app.get('/api/previous-stats', authenticateToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const previousStats = {
      sep: { pushups: 400, situps: 240 },
      oct: { pushups: 300, situps: 139 },
      nov: { pushups: 200, situps: 980 },
      dec: { pushups: 278, situps: 390 },
      jan: { pushups: user.todaysPushups, situps: user.todaysSitups }
    };

    res.status(200).json(previousStats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch previous stats' });
  }
});

// Endpoint to launch exercise session
app.post('/api/launch-exercise', authenticateToken, async (req, res) => {
  const { exerciseType, duration } = req.body;
  const userId = req.userId;
  const token = req.headers.authorization?.split(' ')[1];

  const command = `/Users/marcvidal/Documents/Code/Uottahack/ActivAI/pushup/myenv/bin/python /Users/marcvidal/Documents/Code/Uottahack/ActivAI/pushup/main.py ${exerciseType} ${duration} ${token}`;
  
  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: 'Failed to start exercise session' });
    }
    
    if (stderr) {
      console.log(`Stderr (warnings/info): ${stderr}`);
    }

    try {
      const lines = stdout.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const results = JSON.parse(lastLine);
      console.log(`Results: ${JSON.stringify(results)}`);

      try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Update user stats
        if (results.exercise_type === 'Push-ups') {
          if (results.count > user.topPushupsAllTime) {
            user.topPushupsAllTime = results.count;
          }
          user.pushupDayStreak += 1;
          user.todaysPushups += results.count;
          user.screenTime += results.count * 2; // 2 minutes of screen time per push-up
        } else if (results.exercise_type === 'Sit-ups') {
          if (results.count > user.topSitupsAllTime) {
            user.topSitupsAllTime = results.count;
          }
          user.todaysSitups += results.count;
          user.screenTime += results.count; // 1 minute of screen time per sit-up
        }
        
        // Save the updated user data
        const updatedUser = await user.save();
        
        // Emit the updated user data to all connected clients
        io.emit('updateLeaderboard', {
          name: updatedUser.email,
          workouts: updatedUser.todaysPushups + updatedUser.todaysSitups
        });

        // Emit the updated today's stats to the specific user
        io.to(`user-${userId}`).emit('updateTodaysStats', {
          pushups: updatedUser.todaysPushups,
          situps: updatedUser.todaysSitups,
          screenTime: updatedUser.screenTime
        });

        res.status(200).json({ 
          message: 'Exercise session completed successfully', 
          results, 
          user: {
            name: updatedUser.email,
            workouts: updatedUser.todaysPushups + updatedUser.todaysSitups
          }
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ error: 'Database operation failed' });
      }
    } catch (parseError) {
      console.error(`Failed to parse JSON: ${parseError.message}`);
      return res.status(500).json({ error: 'Failed to parse exercise session results' });
    }
  });
});

// Start server with WebSocket support
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});