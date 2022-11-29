import { Request, Response } from 'express';
import Res from '../../interfaces/res';
import ErrorRes from '../../interfaces/errorRes';
import IUserWord from '../../models/user/interfaces/iUserWord';
import { validationResult } from 'express-validator';
import User from '../../models/user/User';
import IWordSteps from '../../models/user/interfaces/setpTypes';

const postWordToNextStep = async (
  req: Request<unknown, unknown, { wordId: string; currentStep: IWordSteps }>,
  res: Response<Res<{ words: IUserWord[]; step: IWordSteps }[]> | ErrorRes>,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const user = await User.findById(req.header('CurrentUserId'));
    const result = await user.nextStep(req.body.wordId, req.body.currentStep);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default postWordToNextStep;
