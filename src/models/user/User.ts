import mongoose, { Schema } from 'mongoose';
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
          type: Schema.Types.ObjectId,
          required: true,
          unique: true,
          ref: 'Word',
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
    default: [],
  },
  settings: {
    _id: false,
    default: {
      isWordTranslation: true,
      repeatCount: 5,
      wordsPerDay: 10,
      isTranslationWord: true,
      isTyped: true,
    },
    type: {
      isWordTranslation: {
        type: Boolean,
        default: true,
        required: true,
      },
      isTranslationWord: {
        type: Boolean,
        default: true,
        required: true,
      },
      isTyped: {
        type: Boolean,
        default: true,
        required: true,
      },
      repeatCount: {
        type: Number,
        required: true,
        default: 5,
        min: 0,
        max: 5,
      },
      wordsPerDay: {
        type: Number,
        required: true,
        default: 10,
        min: 0,
      },
    },
    required: true,
  },
});

export default mongoose.model<IUser>('User', userSchema);
