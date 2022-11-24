import mongoose, { Schema, Types } from 'mongoose';
import ICollection from './interfaces/iCollection';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import IAggregatedCollection from './interfaces/IAggregatedCollection';

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
    type: [Types.ObjectId],
    ref: 'Word',
    default: [],
    required: true,
  },
  likes: {
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
    required: true,
  },
});

collectionSchema.methods.onLike = function (userId: string) {
  const newUserId = new Types.ObjectId(userId);

  this.likes = this.likes.includes(userId)
    ? this.likes.filter((id: Types.ObjectId) => newUserId !== id)
    : [...this.likes, newUserId];

  this.save();
};

collectionSchema.plugin(paginate);
collectionSchema.plugin(aggregatePaginate);

export interface CollectionDocument extends mongoose.Document, ICollection {}
export interface CollectionAggregateDocument extends mongoose.Document, IAggregatedCollection {}

export const CollectionModel = mongoose.model<
  CollectionDocument,
  mongoose.PaginateModel<CollectionDocument>
>('Collection', collectionSchema, 'collections');

export const ShortCollectionModel = mongoose.model<
  CollectionDocument,
  mongoose.AggregatePaginateModel<CollectionAggregateDocument>
>('Collection', collectionSchema, 'collections');
