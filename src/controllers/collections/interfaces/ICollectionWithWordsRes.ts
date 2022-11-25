import ICollection from '../../../models/collection/interfaces/iCollection';
import ICollectionWord from '../../../models/collection/interfaces/ICollectionWord';

interface ICollectionWithWordsRes extends Omit<ICollection, 'words'> {
  words: ICollectionWord;
}

export default ICollectionWithWordsRes;
