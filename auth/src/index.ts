import express from 'express';
import 'express-async-errors' // by default we tell express to handle sync midldleware's error by using throw, and async middleware's error by using next(err). we just want that process to be abstracted away
import { json } from 'body-parser';
import mongoose from 'mongoose'; // mongoDB ORM
import cookieSession from 'cookie-session'; // store JWT in cookie, for nextJS SSR ease

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

app.set('trust proxy', true); // because our traffic is proxied to ingress nginx inside kubernetes, tell express to trust proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, // dont use encryption, because JWT already encrypted
    secure: true // only in HTTPS
  })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// For any other routes not available
app.all('*', async (req, res, next) => {
  throw new NotFoundError();
})

app.use(errorHandler)

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