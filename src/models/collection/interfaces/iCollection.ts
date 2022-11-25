import { Types } from 'mongoose';
import ICollectionWord from './ICollectionWord';

interface ICollection {
  name: string;
  words: ICollectionWord[];
  user: Types.ObjectId;
  isPrivate: boolean;
  likes: Types.ObjectId[];
}

export default ICollection;
