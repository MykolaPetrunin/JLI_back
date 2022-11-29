import IUserWord from './iUserWord';
import IUserSettings from './iUserSettings';
import { Types } from 'mongoose';

interface IUser {
  email: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
  words?: IUserWord[];
  wordsToKnow?: IUserWord[];
  wordsWordTranslation?: IUserWord[];
  wordsTranslationWord?: IUserWord[];
  wordsSpell?: IUserWord[];
  wordsRepeat?: IUserWord[];
  wordsRepeatWeek?: IUserWord[];
  wordsRepeatMonth?: IUserWord[];
  wordsRepeat3Month?: IUserWord[];
  wordsRepeat6Month?: IUserWord[];
  collections: Types.ObjectId[];
  settings: IUserSettings;
}
export default IUser;
