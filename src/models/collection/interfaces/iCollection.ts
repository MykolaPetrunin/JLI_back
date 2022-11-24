import { Types } from 'mongoose';

interface ICollection {
  name: string;
  words: Types.ObjectId[];
  user: Types.ObjectId;
  isPrivate: boolean;
  likes: Types.ObjectId[];
}

export default ICollection;
