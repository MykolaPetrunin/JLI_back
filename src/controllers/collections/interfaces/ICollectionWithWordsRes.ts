import ICollection from '../../../models/collection/interfaces/iCollection';
import IUserWord from '../../../models/user/interfaces/iUserWord';

interface ICollectionWithWordsRes extends Omit<ICollection, 'words'> {
  words: IUserWord;
}

export default ICollectionWithWordsRes;
