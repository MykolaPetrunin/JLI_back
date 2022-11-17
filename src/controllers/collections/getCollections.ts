import { Request, Response } from 'express';
import ErrorRes from '../../interfaces/errorRes';
import ICollection from '../../models/collection/interfaces/iCollection';
import Collection from '../../models/collection/Collection';
import { validationResult } from 'express-validator';
import ResWithPagination from '../../interfaces/resWithPagination';

interface GetCollectionsQuery {
  userId?: string;
  search?: string;
  limit: number;
  skip: number;
}

const getCollections = async (
  req: Request<unknown, unknown, unknown, GetCollectionsQuery>,
  res: Response<ResWithPagination<ICollection[]> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { userId, search, limit, skip } = req.query;

  Collection.find({
    ...(search ? { $text: { $search: search } } : {}),
    ...(userId ? { user: userId } : {}),
  })
    .sort({ rate: -1, score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit)
    .then((collections) => {
      res.status(200).json({
        data: collections,
        pagination: { skipped: skip, perPage: limit, totalCount: collections },
      });
    });
};

export default getCollections;
