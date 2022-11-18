import { Request, Response } from 'express';
import ErrorRes from '../../interfaces/errorRes';
import ICollection from '../../models/collection/interfaces/iCollection';
import Collection from '../../models/collection/Collection';
import { validationResult } from 'express-validator';
import ResWithPagination from '../../interfaces/resWithPagination';

interface GetCollectionsQuery {
  userId?: string;
  search?: string;
  limit?: number;
  page?: number;
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

  const { userId, search, limit = 10, page = 1 } = req.query;

  console.log(req.header('CurrentUserId'));

  Collection.paginate(
    {
      ...(search ? { $text: { $search: search } } : {}),
      $project: {
        test: limit,
      },
      ...(userId ? { user: req.header('CurrentUserId') } : {}),
    },
    {
      sort: { rate: -1 },
      page: page,
      limit: limit,
      projection: {
        test: 1,
      },
      populate: {
        path: 'user',
        select: 'picture firstName lastName',
      },
      select: 'name isPrivate likes ',
    },
  ).then((result) => {
    res.status(200).json({
      data: result.docs,
      pagination: {
        limit: result.limit,
        page: result.page,
        totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.nextPage,
        pagingCounter: result.pagingCounter,
        prevPage: result.prevPage,
        totalPages: result.totalPages,
      },
    });
  });
};

export default getCollections;
