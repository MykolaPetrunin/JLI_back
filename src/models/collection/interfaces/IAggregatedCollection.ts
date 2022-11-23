import ICollection from './iCollection';
import IWord from '../../word/interfaces/iWord';
import { Schema } from 'mongoose';

interface IAggregatedCollection extends Pick<ICollection, 'name' | 'isPrivate'> {
  liked?: boolean;
  user?: {
    _id: Schema.Types.ObjectId;
    picture: string;
    name: string;
  };
  wordsCount: number;
  words?: IWord[];
}

export default IAggregatedCollection;
