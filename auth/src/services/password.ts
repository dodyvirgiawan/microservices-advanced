import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util'

const scryptASync = promisify(scrypt);

// Define reusable password class to hash and compare hash
// Define reusable methods as static function so we dont need to instantiate it.
export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await scryptASync(password, salt, 64)) as Buffer;

    return `${buffer.toString('hex')}.${salt}` // we concatenate salt in order to check when we compare it below
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.') //get hash and salt
   
    const suppliedBuffer = (await scryptASync(suppliedPassword, salt, 64)) as Buffer;

    return suppliedBuffer.toString('hex') === hashedPassword;
  }
}