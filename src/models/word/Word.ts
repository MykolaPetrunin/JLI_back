import mongoose from 'mongoose';
import IWord from './interfaces/iWord';

const wordSchema = new mongoose.Schema<IWord>({
  word: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
  image: String,
});

export default mongoose.model<IWord>('Word', wordSchema);
