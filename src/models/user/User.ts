import mongoose, { Model, Types } from 'mongoose';
import IUser from './interfaces/iUser';
import IWordSteps from './interfaces/setpTypes';
import getNextStep from './utils/getNextStep';
import IUserWord from './interfaces/iUserWord';
import wordSteps from './config/wordSteps';
import { sampleSize } from 'lodash';

interface IUserMethods {
  nextStep(
    wordId: string,
    currentStep: IWordSteps,
  ): Promise<{ data: { words: IUserWord[]; step: IWordSteps }[] }>;
  setKnown(
    wordId: string,
    currentStep: IWordSteps,
    isKnown: boolean,
  ): Promise<{ data: { words: IUserWord[]; step: IWordSteps }[] }>;
  getRandomHeap(limit: number): IUserWord[];
}

type UserModel = Model<IUser, unknown, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
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
      },
    ],
    default: [],
  },
  wordsToKnow: {
    type: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
        image: String,
      },
    ],
    default: [],
  },
  wordsTranslationWord: {
    type: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
        image: String,
      },
    ],
    default: [],
  },
  wordsWordTranslation: {
    type: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
        image: String,
      },
    ],
    default: [],
  },
  wordsSpell: {
    type: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
        image: String,
      },
    ],
    default: [],
  },
  wordsRepeat: {
    type: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
        image: String,
        lastRepeated: Number,
      },
    ],
    default: [],
  },
  wordsRepeatWeek: {
    type: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
        image: String,
        lastRepeated: Number,
      },
    ],
    default: [],
  },
  wordsRepeatMonth: {
    type: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
        image: String,
        lastRepeated: Number,
      },
    ],
    default: [],
  },
  wordsRepeat3Month: {
    type: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
        image: String,
        lastRepeated: Number,
      },
    ],
    default: [],
  },
  wordsRepeat6Month: {
    type: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
        image: String,
        lastRepeated: Number,
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

userSchema.methods.getRandomHeap = function (limit: number) {
  return sampleSize<IUserWord>(this.words, limit);
};

userSchema.methods.nextStep = async function (
  wordId: string,
  currentStep: IWordSteps,
): Promise<{ data: { words: IUserWord[]; step: IWordSteps }[] }> {
  const nextStep = getNextStep(currentStep, this.settings);
  const word = this[currentStep].find(({ _id }: IUserWord) => _id.toString() === wordId);
  this[currentStep] = this[currentStep].filter(({ _id }: IUserWord) => _id.toString() !== wordId);

  const isRepeat =
    nextStep === 'wordsRepeat' ||
    nextStep === 'wordsRepeatMonth' ||
    nextStep === 'wordsRepeat3Month' ||
    nextStep === 'wordsRepeat6Month' ||
    nextStep === 'wordsRepeatWeek';

  this[nextStep] = [
    ...this[nextStep],
    { ...word, ...(isRepeat ? { lastRepeated: Date.now() / 1000 } : {}) },
  ];

  await this.save();

  return {
    data: [
      {
        words: this[currentStep],
        step: currentStep,
      },
      {
        words: this[nextStep],
        step: nextStep,
      },
    ],
  };
};

userSchema.methods.setKnown = async function (
  wordId: string,
  currentStep: IWordSteps,
  isKnown: boolean,
): Promise<{ data: { words: IUserWord[]; step: IWordSteps }[] }> {
  const word = this[currentStep].find(({ _id }: IUserWord) => _id.toString() === wordId);
  this[currentStep] = this[currentStep].filter(({ _id }: IUserWord) => _id.toString() !== wordId);

  const nextStep: IWordSteps = isKnown ? wordSteps[wordSteps.length - 1] : wordSteps[1];
  this[nextStep] = [
    ...this[nextStep],
    { _id: word._id, word: word.word, translation: word.translation, image: word.image },
  ];

  await this.save();

  const isRepeat =
    nextStep === 'wordsRepeat' ||
    nextStep === 'wordsRepeatMonth' ||
    nextStep === 'wordsRepeat3Month' ||
    nextStep === 'wordsRepeat6Month' ||
    nextStep === 'wordsRepeatWeek';

  return {
    data: [
      ...(currentStep === 'words'
        ? []
        : [
            {
              words: this[currentStep],
              step: currentStep,
            },
          ]),
      ...(isRepeat
        ? []
        : [
            {
              words: this[nextStep],
              step: nextStep,
            },
          ]),
    ],
  };
};

export default mongoose.model<IUser, UserModel>('User', userSchema);
