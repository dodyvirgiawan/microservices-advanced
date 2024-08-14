import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  
  constructor(public errors: ValidationError[]) { // private = assign the variable errors to the overall class
    super('Invalid request paramaters'); // call the Error and inherit all the properties to this custom class

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  // to serialize into { errors: { message: string, field?: string }[] }
  serializeErrors() {
    return this.errors.map(error => {
      if (error.type === 'field') {
        return { message: error.msg, field: error.path };
      }

      return { message: error.msg }
    })
  }
}