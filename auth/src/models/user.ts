import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the prorperties to create a new user
// For typescript Type Checking
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User Model has
// Model = related to mongoose
interface UserModel extends mongoose.Model<UserDoc> {
  //We tell typescript that there is a custom build function that we will define below
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
// Document = the singular data inside the mongodb
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;

  // IF the user document has extra properties that we want to use inside the project, define here
  // createdAt: string
  // ...etc
}

const userSchema = new mongoose.Schema({
  email: {
    type: String, // will not feed into typescript, just for mongoose. pass the actual constructor of string -> String
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

// Add pre save hook to hash password first
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    // we only want to hash if the password has been modified
    // this is because when we create a user for the first time, mongoose will consider to be modified (i know, its weird)
    // TLDR; we dont want to hash an already hashed password, so therefore we do this check to make sure only to run on the first time when we creat a user
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  // tell mongoose its done
  done();
})

// Trick to create a User that will do type checking with Typescript
// ... instead of new User({}) directly -> because no typechecking!
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };