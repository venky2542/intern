const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

// Connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = 'your-database-name';

// Endpoint to fetch data
app.get('/getData', async (req, res) => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db(dbName);

    // Your collection name
    const collection = db.collection('users');

    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Close connection
    client.close();

    res.json(data); // Send the fetched data as a JSON response
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
