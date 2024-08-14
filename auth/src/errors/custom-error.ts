/**
 * 
 * We use abstract class so that it can be used to instanceof checks inside JS (because abstract class will be defined in JS world)
 * When we are making sure that our newly created custom error later will implements this class
 * 
 * ABSTRACT CLASS = BLUEPRINT for CLASS
 * 
 * Technically we can use interface inside typescript, but this wont be transformed into JS, so that our error handling file will be bloated
 * 
 */
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): { message: string, field?: string }[];
}