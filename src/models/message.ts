import mongoose, {Document, Schema} from 'mongoose';
import {IUser} from './user';
import {IThread} from './thread';

export interface IMessage extends Document {
  body: string;
  createdAt: Date;
  user: IUser;
  isDeleted: boolean;
  modification?: {
    isModified: boolean;
    modifiedAt?: Date;
  };
  thread?: IThread;
}

const messageSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},

  thread: [{type: Schema.Types.ObjectId, ref: 'Thread'}],

  body: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  modification: {
    isModified: {
      type: Boolean,
      default: false,
    },
    modifiedAt: {
      type: Date,
      default: null,
    },
  },
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
