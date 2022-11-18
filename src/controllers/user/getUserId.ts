import { Request, Response } from 'express';
import User from '../../models/user/User';
import ErrorRes from '../../interfaces/errorRes';
import Res from '../../interfaces/res';
import { validationResult } from 'express-validator';

interface GetUserReq {
  email: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
}

const getUserId = async (
  req: Request<unknown, unknown, GetUserReq>,
  res: Response<Res<string> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  const { email, picture, lastName, firstName } = req.body;

  User.findOne({ email })
    .select('_id')
    .then((user) => {
      if (!user) {
        const newUser = new User({
          email,
          picture,
          lastName,
          firstName,
        });
        newUser.save();
        res.status(200).json({ data: newUser._id.toString() });
        return;
      }
      res.status(200).json({ data: user._id.toString() });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

export default getUserId;
