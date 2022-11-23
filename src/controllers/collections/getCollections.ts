import { Request, Response } from 'express';
import ErrorRes from '../../interfaces/errorRes';
import { ShortCollectionModel } from '../../models/collection/Collection';
import { validationResult } from 'express-validator';
import ResWithPagination from '../../interfaces/resWithPagination';
import IAggregatedCollection from '../../models/collection/interfaces/IAggregatedCollection';
import mongoose from 'mongoose';

interface GetCollectionsQuery {
  isMy?: boolean;
  search?: string;
  limit?: number;
  page?: number;
}

const getCollections = async (
  req: Request<unknown, unknown, unknown, GetCollectionsQuery>,
  res: Response<ResWithPagination<IAggregatedCollection[]> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { isMy = false, search, limit = 10, page = 1 } = req.query;

  const myUserId = new mongoose.Types.ObjectId(req.header('CurrentUserId'));

  const collectionsAggregate = ShortCollectionModel.aggregate([
    {
      $match: {
        ...(search ? { $text: { $search: search } } : {}),
        ...(isMy ? { user: myUserId } : {}),
        ...(!isMy ? { isPrivate: false } : {}),
      },
    },
    {
      $project: {
        name: 1,
        isPrivate: 1,
        wordsCount: { $size: '$words' },
        ...(isMy ? {} : { user: 1 }),
        ...(isMy ? {} : { liked: { $in: [req.header('CurrentUserId'), '$likes'] } }),
      },
    },
    { $sort: { rate: -1 } },
    ...(isMy
      ? []
      : [
          {
            $lookup: {
              from: 'users',
              let: {
                user: '$user',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', '$$user'],
                    },
                  },
                },
                {
                  $project: {
                    picture: 1,
                    name: {
                      $concat: [
                        { $toUpper: { $substrCP: ['$firstName', 0, 1] } },
                        {
                          $substrCP: [
                            '$firstName',
                            1,
                            { $subtract: [{ $strLenCP: '$firstName' }, 1] },
                          ],
                        },
                        ' ',
                        { $toUpper: { $substrCP: ['$lastName', 0, 1] } },
                        {
                          $substrCP: [
                            '$lastName',
                            1,
                            { $subtract: [{ $strLenCP: '$lastName' }, 1] },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'user',
            },
          },
          {
            $set: {
              user: {
                $arrayElemAt: ['$user', 0],
              },
            },
          },
        ]),
  ]);

  ShortCollectionModel.aggregatePaginate(collectionsAggregate, {
    page: page,
    limit: limit,
  }).then((result) => {
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
