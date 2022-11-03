import mongoose from 'mongoose';
import IUser from './interfaces/iUser';

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  picture: String,
  firstName: String,
  lastName: String,
  words: {
    type: [
      {
        wordId: {
          type: String,
          unique: true,
          required: true,
        },
        isKnown: {
          type: Boolean,
          required: true,
        },
        isWordTranslation: {
          type: Boolean,
          required: true,
        },
        isTranslationWord: {
          type: Boolean,
          required: true,
        },
        isTyped: {
          type: Boolean,
          required: true,
        },
        repeatCount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  settings: {
    type: {
      isWordTranslation: {
        type: Boolean,
        required: true,
      },
      isTranslationWord: {
        type: Boolean,
        required: true,
      },
      isTyped: {
        type: Boolean,
        required: true,
      },
      repeatCount: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
});

export default mongoose.model<IUser>('User', userSchema);
