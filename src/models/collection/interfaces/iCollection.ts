import { Types } from 'mongoose';
import IUserWord from '../../user/interfaces/iUserWord';

interface ICollection {
  name: string;
  words: IUserWord[];
  user: Types.ObjectId;
  isPrivate: boolean;
  likes: Types.ObjectId[];
}

export default ICollection;
