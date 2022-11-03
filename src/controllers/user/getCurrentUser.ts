import { Request, Response } from 'express';
import User from '../../models/user/User';
import ErrorRes from '../../interfaces/errorRes';
import Res from '../../interfaces/res';
import { validationResult } from 'express-validator';
import IUser from '../../models/user/interfaces/iUser';

const getCurrentUser = async (
  req: Request<unknown, unknown, unknown, { userId: string }>,
  res: Response<Res<IUser> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('errors', errors);
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { userId } = req.query;

  User.findById(userId, { settings: 1, firstName: 1, lastName: 1, picture: 1, email: 1 })
    .then((user) => {
      if (!user) {
        res.status(500).json({ error: 'Tere is no user with such id' });
        return;
      }
      res.status(200).json({ data: user });
      return;
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      return;
    });
};

export default getCurrentUser;
