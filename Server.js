import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env'
});

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "https://upstepacademy.vercel.app"
}));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Mongoose Schemas and Models
const demoSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
});

const DemoModel = mongoose.model('Demo', demoSchema);

const gameResultSchema = new mongoose.Schema({
  playerNames: {
    white: String,
    black: String,
  },
  winner: String,
});

const GameResultModel = mongoose.model('GameResult', gameResultSchema);

// Routes
app.get('/', (req, res) => {
  res.send("Welcome to the world of chess");
});

app.post('/api/submitFormData', async (req, res) => {
  try {
    const formData = req.body;
    const demoInstance = new DemoModel(formData);
    await demoInstance.save();

    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/saveGameResult', async (req, res) => {
  try {
    const { playerNames, winner } = req.body;
    const gameResultInstance = new GameResultModel({ playerNames, winner });
    await gameResultInstance.save();

    res.status(201).json({ message: 'Game result saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/getLeaderboard', async (req, res) => {
  try {
    const leaderboardData = await GameResultModel.find().exec();
    res.status(200).json(leaderboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

