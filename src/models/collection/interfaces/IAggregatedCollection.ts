import ICollection from './iCollection';
import ICollectionWord from './ICollectionWord';
import { Types } from 'mongoose';

interface IAggregatedCollection extends Pick<ICollection, 'name' | 'isPrivate'> {
  liked?: boolean;
  user?: {
    _id: Types.ObjectId;
    picture: string;
    name: string;
  };
  wordsCount: number;
  words?: ICollectionWord[];
}

export default IAggregatedCollection;
