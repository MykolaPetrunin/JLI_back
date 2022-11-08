import mongoose, { Schema } from 'mongoose';
import ICollection from './interfaces/iCollection';

const collectionSchema = new mongoose.Schema<ICollection>({
  isPrivate: {
    type: Boolean,
    default: false,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  user: Schema.Types.ObjectId,
  words: {
    type: [Schema.Types.ObjectId],
    default: [],
    required: true,
  },
  like: {
    type: Number,
    default: 0,
    required: true,
  },
  disLike: {
    type: Number,
    default: 0,
    required: true,
  },
});

export default mongoose.model<ICollection>('Collection', collectionSchema);
