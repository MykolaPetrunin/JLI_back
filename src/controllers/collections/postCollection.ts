import { Request, Response } from 'express';
import Res from '../../interfaces/res';
import ErrorRes from '../../interfaces/errorRes';
import { validationResult } from 'express-validator';
import { CollectionModel } from '../../models/collection/Collection';
import mongoose from 'mongoose';
import ICollection from '../../models/collection/interfaces/iCollection';

interface PostCollectionBody {
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
  const { words, name, isPrivate } = req.body;

  try {
    const collection = await CollectionModel.create({
      name,
      user: new mongoose.Types.ObjectId(req.header('CurrentUserId')),
      isPrivate,
      words: words,
    });
    res.status(200).json({ data: collection });
  } catch (err) {
    res.status(400).json({ error: err.message });
    return;
  }
};

export default postCollection;
