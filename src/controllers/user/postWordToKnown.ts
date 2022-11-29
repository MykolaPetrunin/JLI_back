import { Request, Response } from 'express';
import Res from '../../interfaces/res';
import ErrorRes from '../../interfaces/errorRes';
import { validationResult } from 'express-validator';
import User from '../../models/user/User';
import IWordSteps from '../../models/user/interfaces/setpTypes';
import IUserWord from '../../models/user/interfaces/iUserWord';

const postWordToKnown = async (
  req: Request<unknown, unknown, { wordId: string; currentStep: IWordSteps; isKnown: boolean }>,
  res: Response<Res<{ words: IUserWord[]; step: IWordSteps }[]> | ErrorRes>,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const user = await User.findById(req.header('CurrentUserId'));
    const data = await user.setKnown(req.body.wordId, req.body.currentStep, req.body.isKnown);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default postWordToKnown;
