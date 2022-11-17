import { Schema } from 'mongoose';

interface ICollection {
  name: string;
  words: Schema.Types.ObjectId[];
  user?: Schema.Types.ObjectId;
  isPrivate: boolean;
  like: number;
  disLike: number;
  rate: number;
}

export default ICollection;
