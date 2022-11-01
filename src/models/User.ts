import mongoose from "mongoose";

export interface IUser {
  email: string;
  words: {
    wordId: string;
    isKnown: boolean;
    isWordTranslation: boolean;
    isTranslationWord: boolean;
    isTyped: boolean;
    repeatCount: number;
  }[];
  settings: {
    isWordTranslation: boolean;
    isTranslationWord: boolean;
    isTyped: boolean;
    repeatCount: 3;
  }
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  words: [{
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
    }
  }],
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
      }
    },
    required: true,
  }
});

export default mongoose.model<IUser>('User', userSchema);
