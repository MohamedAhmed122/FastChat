import { IUser } from './user';
import mongoose, { Document, Schema } from 'mongoose';

interface IThread extends Document {
  reply: string;
  timestamp: Date;
  user: IUser;
}

const threadSchema = new Schema({
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  reply: {
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
