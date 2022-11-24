import { Types } from 'mongoose';

interface IUserWord {
  wordId: Types.ObjectId[];
  isKnown: boolean;
  isWordTranslation: boolean;
  isTranslationWord: boolean;
  isTyped: boolean;
  repeatCount: number;
}

export default IUserWord;
