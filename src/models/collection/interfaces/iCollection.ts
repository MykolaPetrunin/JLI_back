import { Schema } from 'mongoose';

interface ICollection {
  name: string;
  words: Schema.Types.ObjectId[];
  user: Schema.Types.ObjectId;
  isPrivate: boolean;
  likes: Schema.Types.ObjectId[];
}

export default ICollection;
