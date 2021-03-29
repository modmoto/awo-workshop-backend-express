import express from 'express';
import storage from 'node-persist';
import { Greeting } from './types';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

storage.init();

const greetingsKey = 'greetings';

app.get('/greetings', async (_req, res) => {
  const greetings = await storage.getItem(greetingsKey) ?? [];
  res.send(greetings);
});

app.delete('/greetings', async (_req, res) => {
  await storage.removeItem(greetingsKey);
  res.send();
});

app.post('/greetings', async (_req, res) => {
  const greeting = _req.body as Greeting;
  const greetings = await storage.getItem(greetingsKey) ?? [];
  greetings.push(greeting);
  await storage.setItem(greetingsKey, greetings);
  res.send(greetings);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
