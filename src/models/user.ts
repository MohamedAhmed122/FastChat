import mongoose, {Document, Schema} from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName?: string;
  avatar: string;
}

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
