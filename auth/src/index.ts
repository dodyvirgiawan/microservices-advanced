import mongoose from 'mongoose'; // mongoDB ORM
import { app } from './app';

// File to start the dev server
const start = async () => {
  // Check if our ENV variable is defined
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  // Next, connect to mongoose
  try {
    const dbName = 'auth'
    await mongoose.connect(`mongodb://auth-mongo-srv:27017/${dbName}`); // mongodb clusterIP kubernetes service url

    console.log('Connected to mongodb!')
  } catch (err) {
    console.log('Failed connecting to mongodb!');
    console.log(err);
  }

  // If success, run express
  app.listen(3000, () => {
    console.log('Listening on port 3000!!');
  });
}

start();