import express from 'express';
import storage from 'node-persist';
import { Greeting } from './types';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

storage.init();

const greetingsKey = 'greetings';

function createGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

app.get('/greetings', async (_req, res) => {
  const greetings = await storage.getItem(greetingsKey) ?? [];
  res.send(greetings);
});

app.delete('/greetings/:greetingId', async (_req, res) => {
  const greetingId = _req.params.greetingId;
  const greetings = (await storage.getItem(greetingsKey) ?? []) as Greeting[];
  const newGreetings = greetings.filter(g => g.id !== greetingId)
  await storage.setItem(greetingsKey, newGreetings);
  res.send(newGreetings);
});

app.post('/greetings', async (_req, res) => {
  const greeting = _req.body as Greeting;
  greeting.likes = 0;
  greeting.id = createGuid();
  const greetings = await storage.getItem(greetingsKey) ?? [];
  greetings.unshift(greeting);
  await storage.setItem(greetingsKey, greetings);
  res.send(greetings);
});

app.put('/greetings/:greetingId', async (_req, res) => {
  const greetings = (await storage.getItem(greetingsKey) ?? []) as Greeting[];
  const greetingId = _req.params.greetingId;
  const greetingEdit = greetings.find(g => g.id === greetingId);
  if (greetingEdit) {
    greetingEdit.likes += 1
    const newGreetings = greetings.filter(g => g.id !== greetingId)
    newGreetings.push(greetingEdit)
    await storage.setItem(greetingsKey, greetings);
  }

  res.send(greetings);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
