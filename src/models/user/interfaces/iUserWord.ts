interface IUserWord {
  _id?: string;
  word: string;
  translation: string;
  image?: string;
  lastRepeated?: number;
}

export default IUserWord;
