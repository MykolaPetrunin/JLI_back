import { Request, Response } from 'express';
import Res from '../../interfaces/res';
import ErrorRes from '../../interfaces/errorRes';
import { validationResult } from 'express-validator';
import { CollectionModel } from '../../models/collection/Collection';
import User from '../../models/user/User';
import { Types } from 'mongoose';
import IUserWord from '../../models/user/interfaces/iUserWord';
import IUser from '../../models/user/interfaces/iUser';

const postStudyCollection = async (
  req: Request<unknown, unknown, { collectionId: string }>,
  res: Response<Res<Omit<IUser, 'settings'> & { _id: Types.ObjectId }> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  try {
    const collection = await CollectionModel.findById(req.body.collectionId).select('words');
    const user = await User.findById(req.header('CurrentUserId')).select(
      'firstName lastName picture email collections words',
    );
    if (user.collections.includes(collection._id)) {
      res.status(500).json({ error: 'This collection was added later' });
      return;
    }

    const words: IUserWord[] = collection.words.map((word) => ({
      ...word,
      isKnown: false,
      isWordTranslation: false,
      isTranslationWord: false,
      isTyped: false,
      repeatCount: 0,
    }));
    user.collections.push(collection._id);
    user.words = user.words.concat(words);

    await user.save();

    res.status(200).json({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        email: user.email,
        collections: user.collections,
        _id: user._id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default postStudyCollection;
