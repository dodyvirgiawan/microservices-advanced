import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to database';

  constructor() { // private = assign the variable errors to the overall class
    super('Error connecting to database'); // call the Error and inherit all the properties to this custom class

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  // to serialize into { errors: { message: string, field?: string }[] }
  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}