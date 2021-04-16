import express from 'express';
import { Greeting } from './types';
import { MongoClient, ObjectID } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(express.json());
// app.use(cors());

const url = 'mongodb://157.90.1.251:3513/';
const dbName = 'awo-test';

async function getUserCollection(userName: string) {
  const client = await MongoClient.connect(url)
  const db = client.db(dbName)
  const collection = db.collection(userName)
  return collection;
}

app.get('/greetings/:userName', async (_req, res) => {
  const userName = _req.params.userName;
  var collection = await getUserCollection(userName)
  const greetings = await collection.find({}).toArray() ?? [];
  res.send(greetings);
});

app.delete('/greetings/:userName/:greetingId', async (_req, res) => {
  const userName = _req.params.userName;
  const greetingId = _req.params.greetingId;
  var collection = await getUserCollection(userName)
  await collection.deleteOne({
    _id: new ObjectID(greetingId) 
  });
  const greetings = await collection.find({}).toArray() ?? [];
  res.send(greetings);
});

app.post('/greetings/:userName', async (_req, res) => {
  const userName = _req.params.userName;
  const greeting = _req.body as Greeting;
  greeting.likes = 0;
  
  var collection = await getUserCollection(userName)
  await collection.insertOne(greeting);
  const greetings = await collection.find({}).toArray() ?? [];
  res.send(greetings);
});

app.put('/greetings/:userName/:greetingId', async (_req, res) => {
  const userName = _req.params.userName;
  const greetingId = _req.params.greetingId;
  var collection = await getUserCollection(userName)
  const greeting = await collection.findOne({
    _id: new ObjectID(greetingId)
  });

  if (greeting) {
    greeting.likes += 1
    await collection.replaceOne({
      _id: new ObjectID(greetingId)
    }, greeting);
  }

  const greetings = await collection.find({}).toArray() ?? [];
  res.send(greetings);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
