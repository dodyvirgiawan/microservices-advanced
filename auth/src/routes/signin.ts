import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials')
    }

    const isPasswordMatch = await Password.compare(existingUser.password, password);

    if (!isPasswordMatch) {
      throw new BadRequestError('Invalid Credentials')
    }

     // Generate JWT
     const payload = { id: existingUser.id, email: existingUser.email }
     const userJwt = jwt.sign(payload, process.env.JWT_KEY!); // we 100% sure this is defined
 
     // Store it into session object
     req.session = {
       jwt: userJwt
     }
 
     res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
