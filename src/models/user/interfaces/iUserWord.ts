interface IUserWord {
  wordId: string;
  isKnown: boolean;
  isWordTranslation: boolean;
  isTranslationWord: boolean;
  isTyped: boolean;
  repeatCount: number;
}

export default IUserWord;
