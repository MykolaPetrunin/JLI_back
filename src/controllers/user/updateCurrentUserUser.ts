import dotenv from 'dotenv';
import { Request, Response } from 'express';
import User from '../../models/user/User';
import ErrorRes from '../../interfaces/errorRes';
import Res from '../../interfaces/res';
import { validationResult } from 'express-validator';
import IUser from '../../models/user/interfaces/iUser';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3, { getUserImageFromAWS } from '../../services/s3';

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;

const updateCurrentUserUser = async (
  req: Request<unknown, unknown, Omit<IUser, 'email' | 'words' | 'settings'>, unknown>,
  res: Response<Res<IUser> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { firstName, lastName, picture } = req.body;

  User.findById(req.header('CurrentUserId'))
    .select('picture firstName lastName')
    .then((user) => {
      if (!user) {
        res.status(500).json({ error: 'Tere is no user with such id' });
        throw new Error('Tere is no user with such id');
      }

      return user;
    })
    .then(async (user) => {
      if (picture && user.picture !== picture && !user.picture.startsWith('http')) {
        const command = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: user.picture,
        });
        await s3.send(command);
      }
      return user;
    })
    .then((user) => {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (picture) user.picture = picture;
      user.save();
      return user;
    })
    .then(getUserImageFromAWS)
    .then((user) => {
      res.status(200).json({ data: user });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      return;
    });
};

export default updateCurrentUserUser;
