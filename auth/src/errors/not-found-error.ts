import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() { // private = assign the variable errors to the overall class
    super('Route not found'); // call the Error and inherit all the properties to this custom class

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  // to serialize into { errors: { message: string, field?: string }[] }
  serializeErrors() {
    return [
      { message: 'Route not found' }
    ]
  }
}