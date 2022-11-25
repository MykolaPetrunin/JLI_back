interface IUserWord {
  word: string;
  translation: string;
  image?: string;
  isKnown: boolean;
  isWordTranslation: boolean;
  isTranslationWord: boolean;
  isTyped: boolean;
  repeatCount: number;
}

export default IUserWord;
