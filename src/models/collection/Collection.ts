import mongoose, { Schema } from 'mongoose';
import ICollection from './interfaces/iCollection';
import paginate from 'mongoose-paginate-v2';

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
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  words: {
    type: [Schema.Types.ObjectId],
    ref: 'Word',
    default: [],
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
    required: true,
  },
});

collectionSchema.methods.onLike = function (userId: string) {
  const newUserId = new Schema.Types.ObjectId(userId);

  this.likes = this.likes.includes(userId)
    ? this.likes.filter((id: Schema.Types.ObjectId) => newUserId !== id)
    : [...this.likes, newUserId];

  this.save();
};

collectionSchema.plugin(paginate);

export interface CollectionDocument extends mongoose.Document, ICollection {}

export default mongoose.model<CollectionDocument, mongoose.PaginateModel<CollectionDocument>>(
  'Collection',
  collectionSchema,
  'collections',
);
