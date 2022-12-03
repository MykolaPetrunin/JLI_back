import { Request, Response } from 'express';
import User from '../../models/user/User';
import ErrorRes from '../../interfaces/errorRes';
import Res from '../../interfaces/res';
import { validationResult } from 'express-validator';
import IUser from '../../models/user/interfaces/iUser';
import { getUserImageFromAWS } from '../../services/s3';
import { Types } from 'mongoose';

const SECONDS_IN_DAY = 86400;
const SECONDS_IN_WEEK = 604800;
const SECONDS_IN_MONTH = 2592000;
const SECONDS_IN_3MONTH = 7776000;
const SECONDS_IN_6MONTH = 15552000;

const getCurrentUser = async (
  req: Request<unknown, unknown, unknown, { userId: string }>,
  res: Response<Res<IUser> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const userId = req.header('CurrentUserId');

    const aggregation = await User.aggregate<IUser & { wordsBaggage: number }>([
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          picture: 1,
          email: 1,
          collections: 1,
          settings: 1,
          wordsBaggage: { $size: '$words' },
          wordsToKnow: 1,
          wordsWordTranslation: 1,
          wordsTranslationWord: 1,
          wordsSpell: 1,
          wordsHeap: {
            $slice: [
              {
                $concatArrays: [
                  '$wordsRepeat',
                  '$wordsRepeatWeek',
                  '$wordsRepeatWeek',
                  '$wordsRepeatMonth',
                  '$wordsRepeat3Month',
                  '$wordsRepeat6Month',
                  '$words',
                ],
              },
              0,
              20,
            ],
          },
          wordsRepeat: {
            $filter: {
              input: '$wordsRepeat',
              as: 'wordsRepeat',
              cond: {
                $gt: [
                  { $subtract: [Date.now() / 1000, '$$wordsRepeat.lastRepeated'] },
                  SECONDS_IN_DAY,
                ],
              },
            },
          },
          wordsRepeatWeek: {
            $filter: {
              input: '$wordsRepeatWeek',
              as: 'wordsRepeatWeek',
              cond: {
                $gt: [
                  { $subtract: [Date.now() / 1000, '$$wordsRepeatWeek.lastRepeated'] },
                  SECONDS_IN_WEEK,
                ],
              },
            },
          },
          wordsRepeatMonth: {
            $filter: {
              input: '$wordsRepeatMonth',
              as: 'wordsRepeatMonth',
              cond: {
                $gt: [
                  { $subtract: [Date.now() / 1000, '$$wordsRepeatMonth.lastRepeated'] },
                  SECONDS_IN_MONTH,
                ],
              },
            },
          },
          wordsRepeat3Month: {
            $filter: {
              input: '$wordsRepeat3Month',
              as: 'wordsRepeat3Month',
              cond: {
                $gt: [
                  { $subtract: [Date.now() / 1000, '$$wordsRepeat3Month.lastRepeated'] },
                  SECONDS_IN_3MONTH,
                ],
              },
            },
          },
          wordsRepeat6Month: {
            $filter: {
              input: '$wordsRepeat6Month',
              as: 'wordsRepeat6Month',
              cond: {
                $gt: [
                  { $subtract: [Date.now() / 1000, '$$wordsRepeat6Month.lastRepeated'] },
                  SECONDS_IN_6MONTH,
                ],
              },
            },
          },
        },
      },
    ]);

    if (!aggregation[0]) {
      res.status(500).json({ error: 'Tere is no user with such id' });
      return;
    }

    const user = await getUserImageFromAWS(aggregation[0]);

    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default getCurrentUser;
