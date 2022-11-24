import { Request, Response } from 'express';
import User from '../../models/user/User';
import ErrorRes from '../../interfaces/errorRes';
import Res from '../../interfaces/res';
import { validationResult } from 'express-validator';
import IUser from '../../models/user/interfaces/iUser';
import { getUserImageFromAWS } from '../../services/s3';

const getCurrentUser = async (
  req: Request<unknown, unknown, unknown, { userId: string }>,
  res: Response<Res<IUser> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const userId = req.header('CurrentUserId');

  User.findById(userId)
    .select('firstName lastName picture email collections')
    .then((user) => {
      if (!user) {
        res.status(500).json({ error: 'Tere is no user with such id' });
        return;
      }
      return user;
    })
    .then(getUserImageFromAWS)
    .then((user) => {
      res.status(200).json({ data: user });
      return;
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      return;
    });
};

export default getCurrentUser;
