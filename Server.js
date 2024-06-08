import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv"
const app = express();
const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(cors({
  origin:"https://upstepacademy.vercel.app/"
}
));

dotenv.config({
  path: './.env'
})

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
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

app.post('/api/submitFormData', async (req, res) => {
  try {
    const formData = req.body;
    const demoInstance = new DemoModel(formData);
    await demoInstance.save();

    res.status(201).json({ message:'Form data saved successfully' });
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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