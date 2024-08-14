import { Request, Response, NextFunction } from "express"
import { CustomError } from "../errors/custom-error";

// Will reach this part of code if we "throw" inside the business logic of each endpoint
// Output: { errors: { message: string, field?: string }[] }
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(err instanceof CustomError) {
    console.log(err)
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    message: [
      { message: 'Something went wrong' }
    ]
  });
}