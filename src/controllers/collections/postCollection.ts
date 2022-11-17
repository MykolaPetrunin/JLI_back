import { Request, Response } from 'express';
import Res from '../../interfaces/res';
import ErrorRes from '../../interfaces/errorRes';
import Word from '../../models/word/Word';
import { validationResult } from 'express-validator';
import Collection from '../../models/collection/Collection';
import mongoose from 'mongoose';
import ICollection from '../../models/collection/interfaces/iCollection';

interface PostCollectionBody {
  userId: string;
  name: string;
  words: Array<{ word: string; translation: string; image: string }>;
  isPrivate: boolean;
}

const postCollection = async (
  req: Request<unknown, unknown, PostCollectionBody, unknown>,
  res: Response<Res<ICollection> | ErrorRes>,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { words, name, isPrivate, userId } = req.body;

  try {
    const wordsRes = await Word.insertMany(words);
    const collection = await Collection.create({
      name,
      user: new mongoose.Types.ObjectId(userId),
      isPrivate,
      words: wordsRes.map(({ _id }) => _id),
    });
    res.status(200).json({ data: collection });
  } catch (err) {
    res.status(400).json({ error: err.message });
    return;
  }
};

export default postCollection;
