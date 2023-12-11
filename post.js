const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a schema
const dataSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
});

const user = mongoose.model('users', dataSchema);

// Body parser middleware
app.use(bodyParser.json());

// POST route to store data
app.post('/store', async (req, res) => {
  try {
    const newData = new user(req.body);
    await newData.save();
    res.status(201).json({ message: 'Data saved successfully' });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
