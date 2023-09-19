import {IUser} from './user';
import mongoose, {Document, Schema} from 'mongoose';

export interface IThread extends Document {
  body: string;
  timestamp: Date;
  user: IUser;
}

const threadSchema = new Schema({
  user: [{type: Schema.Types.ObjectId, ref: 'User'}],
  body: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Thread = mongoose.model<IThread>('Thread', threadSchema);

export default Thread;
