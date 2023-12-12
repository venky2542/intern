const express = require('express');
const mongoose = require('mongoose');

// Set up Express
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Create a schema for your data
const dataSchema = new mongoose.Schema({
  key: String,
  value: String,
});

// Create a model based on the schema
const Data = mongoose.model('users', dataSchema);

// Route to handle the POST request
app.post('/saveData', async (req, res) => {
  try {
    const { key, value } = req.body; // Assuming the POST request contains 'key' and 'value' fields

    // Create a new data instance
    const newData = new Data({ key, value });

    // Save data to MongoDB
    await newData.save();

    res.status(201).json({ message: 'Data saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
