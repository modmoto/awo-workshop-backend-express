import express from 'express';
import storage from 'node-persist';
import { Greeting } from './types';

const app = express();
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

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
