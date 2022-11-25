import { Request, Response } from 'express';
import ErrorRes from '../../interfaces/errorRes';
import {
  CollectionAggregateDocument,
  ShortCollectionModel,
} from '../../models/collection/Collection';
import { validationResult } from 'express-validator';
import IAggregatedCollection from '../../models/collection/interfaces/IAggregatedCollection';
import mongoose from 'mongoose';
import Res from '../../interfaces/res';

const getCollection = async (
  req: Request<{ collectionId: string }, unknown, unknown, unknown>,
  res: Response<Res<IAggregatedCollection> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { collectionId } = req.params;

    const myUserId = req.header('CurrentUserId');

    await ShortCollectionModel.aggregate<CollectionAggregateDocument>([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(collectionId),
        },
      },
      {
        $project: {
          name: 1,
          isPrivate: 1,
          user: 1,
          words: 1,
          liked: { $in: [req.header('CurrentUserId'), '$likes'] },
          wordsCount: { $size: '$words' },
        },
      },
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
                      $substrCP: ['$firstName', 1, { $subtract: [{ $strLenCP: '$firstName' }, 1] }],
                    },
                    ' ',
                    { $toUpper: { $substrCP: ['$lastName', 0, 1] } },
                    {
                      $substrCP: ['$lastName', 1, { $subtract: [{ $strLenCP: '$lastName' }, 1] }],
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
    ]).then((result) => {
      const collection = result[0];
      if (!collection) {
        res.status(404).json({ error: 'There is no collection with such id' });
        return;
      }
      if (collection.isPrivate && collection.user?._id.toString() !== myUserId) {
        res.status(403).json({ error: 'You have no permission to view this collection' });
        return;
      }

      res.status(200).json({
        data: result[0],
      });
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export default getCollection;
