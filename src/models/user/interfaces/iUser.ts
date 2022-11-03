import IUserWord from './iUserWord';
import IUserSettings from './iUserSettings';

interface IUser {
  email: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
  words?: IUserWord[];
  settings: IUserSettings;
}

export default IUser;
