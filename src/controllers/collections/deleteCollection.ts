import { Request, Response } from 'express';
import ErrorRes from '../../interfaces/errorRes';
import { CollectionModel } from '../../models/collection/Collection';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import Res from '../../interfaces/res';

const deleteCollection = async (
  req: Request<{ collectionId: string }>,
  res: Response<Res<string> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { collectionId } = req.params;

    const myUserId = req.header('CurrentUserId');

    await CollectionModel.findOneAndRemove({
      _id: new Types.ObjectId(collectionId),
      user: new Types.ObjectId(myUserId),
    });

    res.status(200).json({
      data: collectionId,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export default deleteCollection;
