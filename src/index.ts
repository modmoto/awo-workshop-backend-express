import express from 'express';
import storage from 'node-persist';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

storage.init();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get('/greetings', async (_req, res) => {
  res.send("hallo da draußen");
});