const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Replace 'your-secret-key' with a secure secret key for JWT
const secretKey = '1334';

// MongoDB connection setup
mongoose.connect('mongodb+srv://abhishekprasad:abhiprasad@cluster0.ygncry8.mongodb.net/examdb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Mongoose schema for User
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('admin', userSchema);

// Mongoose schema for Exam
const examSchema = new mongoose.Schema({
  subject: String,
  location:String,
  // Add other fields as needed
});

const Exam = mongoose.model('Exam', examSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.use(bodyParser.json());

// API route to register a new user
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Create a new user in MongoDB
    const newUser = await User.create({ username, password });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API route to login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are valid (you may want to use a more secure authentication method in production)
  const user = await User.findOne({ username, password });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate a JWT token for the user
  const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

  res.json({ token });
});

// API route to create exam details
app.post('/exams', authenticateToken, async (req, res) => {
  try {
    const newExamData = req.body;

    // Create a new exam in MongoDB
    const newExam = await Exam.create(newExamData);

    res.status(201).json(newExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
