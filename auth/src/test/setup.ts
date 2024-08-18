import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any

// Run once, before all tests
// Purpose: define .env connect to mongoDB memory DB
beforeAll(async () => {
  process.env.JWT_KEY = 'for_test_purposes'

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
})

// Run before each test
// Purpose: reset the database
beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();

  if (!collections) return;

  for(let collection of collections) {
    await collection.deleteMany({});
  }
})

// Run once, after all tests
// Purpose: kill connection to mongo, close mongoose.
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
})

// Define reusable function in global test namespace to sign in
global.signin = async () => {
  const email = 'test@test.com'
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie')!;

  return cookie;
}