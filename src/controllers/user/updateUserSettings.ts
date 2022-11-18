import { Request, Response } from 'express';
import User from '../../models/user/User';
import ErrorRes from '../../interfaces/errorRes';
import Res from '../../interfaces/res';
import { validationResult } from 'express-validator';
import IUserSettings from '../../models/user/interfaces/iUserSettings';

const updateUserSettings = async (
  req: Request<{ userId: string }, unknown, IUserSettings, unknown>,
  res: Response<Res<IUserSettings> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const data = req.body;

  User.findById(req.params.userId)
    .select('settings')
    .then((user) => {
      if (!user) {
        res.status(500).json({ error: 'Tere is no user with such id' });
        return;
      }
      user.settings = data;
      user.save();
      return user.settings;
    })
    .then((settings) => {
      res.status(200).json({ data: settings });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      return;
    });
};

export default updateUserSettings;
