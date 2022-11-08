import { Request, Response } from 'express';
import Res from '../../interfaces/res';
import ErrorRes from '../../interfaces/errorRes';
import ICollection from '../../models/collection/interfaces/iCollection';
import Collection from '../../models/collection/Collection';
import { validationResult } from 'express-validator';

const getCollections = async (
  req: Request<unknown, unknown, unknown, { userId: string }>,
  res: Response<Res<ICollection[]> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  Collection.find().then((collections) => {
    res.status(200).json({ data: collections });
  });
};

export default getCollections;
