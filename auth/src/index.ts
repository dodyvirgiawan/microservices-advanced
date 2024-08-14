import express from 'express';
import 'express-async-errors' // by default we tell express to handle sync midldleware's error by using throw, and async middleware's error by using next(err). we just want that process to be abstracted away
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// For any other routes not available
app.all('*', async (req, res, next) => {
  throw new NotFoundError();
})

app.use(errorHandler)

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
