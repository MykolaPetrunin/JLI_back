import ICollection from '../../../models/collection/interfaces/iCollection';
import IWord from '../../../models/word/interfaces/iWord';

interface ICollectionWithWordsRes extends Omit<ICollection, 'words'> {
  words: IWord;
}

export default ICollectionWithWordsRes;
