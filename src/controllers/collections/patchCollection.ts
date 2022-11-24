import { Request, Response } from 'express';
import Res from '../../interfaces/res';
import ErrorRes from '../../interfaces/errorRes';
import { validationResult } from 'express-validator';
import ICollection from '../../models/collection/interfaces/iCollection';
import { CollectionModel } from '../../models/collection/Collection';
import Word from '../../models/word/Word';

interface PatchCollectionBody {
  name?: string;
  words?: Array<{ id?: string; word: string; translation: string; image: string }>;
  isPrivate?: boolean;
}

const patchCollection = async (
  req: Request<{ collectionId: string }, unknown, PatchCollectionBody, unknown>,
  res: Response<Res<ICollection> | ErrorRes>,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { words, isPrivate, name } = req.body;
    const { collectionId } = req.params;

    const collection = await CollectionModel.findById(collectionId);

    if (collection.user.toString() !== req.header('CurrentUserId')) {
      res.status(403).json({ error: 'This is not your collection' });
    }

    if (isPrivate !== undefined) collection.isPrivate = isPrivate;
    if (name) collection.name = name;

    if (words) {
      await Word.updateMany({ _id: { $in: collection.words } }, { $set: { hasCollection: false } });

      const wordsRes = await Word.insertMany(
        words.map((item) => ({
          word: item.word,
          image: item.image,
          translation: item.translation,
        })),
      );

      collection.words = wordsRes.map(({ _id }) => _id);
    }

    collection.likes = [];

    await collection.save();

    res.status(200).json({ data: collection });
  } catch (err) {
    res.status(400).json({ error: err.message });
    return;
  }
};

export default patchCollection;
