import { Request, Response } from 'express';
import User from '../../models/user/User';
import ErrorRes from '../../interfaces/errorRes';
import Res from '../../interfaces/res';
import { validationResult } from 'express-validator';
import IUserWord from '../../models/user/interfaces/iUserWord';

interface GetMyWordsQuery {
  limit?: number;
}

const getMyWordsHeap = async (
  req: Request<unknown, unknown, unknown, GetMyWordsQuery>,
  res: Response<Res<IUserWord[]> | ErrorRes>,
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const userId = req.header('CurrentUserId');
    const user = await User.findById(userId).select('words');
    res.status(200).json({ data: user.getRandomHeap(req.query.limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default getMyWordsHeap;
