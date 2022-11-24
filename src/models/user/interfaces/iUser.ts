import IUserWord from './iUserWord';
import IUserSettings from './iUserSettings';
import { Types } from 'mongoose';

interface IUser {
  email: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
  words?: IUserWord[];
  collections: Types.ObjectId[];
  settings: IUserSettings;
}
export default IUser;
