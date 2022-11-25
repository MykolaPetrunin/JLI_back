import mongoose, { Types } from 'mongoose';
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
  collections: {
    type: [Types.ObjectId],
    ref: 'Collection',
    default: [],
  },
  words: {
    type: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
        image: String,
        isKnown: {
          type: Boolean,
          required: true,
          default: false,
        },
        isWordTranslation: {
          type: Boolean,
          required: true,
          default: false,
        },
        isTranslationWord: {
          type: Boolean,
          required: true,
          default: false,
        },
        isTyped: {
          type: Boolean,
          required: true,
          default: false,
        },
        repeatCount: {
          type: Number,
          required: true,
          default: 0,
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
