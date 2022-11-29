import ICollection from './iCollection';
import { Types } from 'mongoose';
import IUserWord from '../../user/interfaces/iUserWord';

interface IAggregatedCollection extends Pick<ICollection, 'name' | 'isPrivate'> {
  liked?: boolean;
  user?: {
    _id: Types.ObjectId;
    picture: string;
    name: string;
  };
  wordsCount: number;
  words?: IUserWord[];
}

export default IAggregatedCollection;
