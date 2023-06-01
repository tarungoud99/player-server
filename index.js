const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://saitarun:8e5i4A4HTabvtj5q@cluster0.ralyv0x.mongodb.net/players?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Failed to connect to MongoDB:', error));

// Create a schema for the player model
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  nationality: { type: String, required: true },
  battingStyle: { type: String },
  bowlingStyle: { type: String },
});

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

// Create a player model based on the schema
const Player = mongoose.model('Player', playerSchema, 'cricket');

// Create the Express app
const app = express();
app.use(express.json());
app.use(cors(corsOptions));


// Define the routes

// Get all players
app.get('/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Get a specific player by ID
app.get('/players/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      res.status(404).json({ error: 'Player not found' });
    } else {
      res.json(player);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

// Create a new player
app.post('/players', async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create player' });
  }
});

// Update a player
app.put('/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) {
      res.status(404).json({ error: 'Player not found' });
    } else {
      res.json(player);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update player' });
  }
});

// Delete a player
app.delete('/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      res.status(404).json({ error: 'Player not found' });
    } else {
      res.json({ message: 'Player deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
