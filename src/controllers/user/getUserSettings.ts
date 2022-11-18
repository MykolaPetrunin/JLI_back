import { Request, Response } from 'express';
import User from '../../models/user/User';
import ErrorRes from '../../interfaces/errorRes';
import Res from '../../interfaces/res';
import { validationResult } from 'express-validator';
import IUserSettings from '../../models/user/interfaces/iUserSettings';

const getUserSettings = async (
  req: Request<unknown, unknown, unknown, { userId: string }>,
  res: Response<Res<IUserSettings> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { userId } = req.query;

  User.findById(userId)
    .select('settings -_id')
    .then((user) => {
      if (!user) {
        res.status(500).json({ error: 'Tere is no user with such id' });
        return;
      }
      res.status(200).json({ data: user.settings });
      return;
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      return;
    });
};

export default getUserSettings;
