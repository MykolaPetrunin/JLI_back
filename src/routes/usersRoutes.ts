import express from 'express';
import getCurrentUser from '../controllers/user/getCurrentUser';
import getUserId from '../controllers/user/getUserId';
import { check, body, query } from 'express-validator';
import getUserSettings from '../controllers/user/getUserSettings';
import updateUserSettings from '../controllers/user/updateUserSettings';
import updateCurrentUser from '../controllers/user/updateCurrentUser';
import postStudyCollection from '../controllers/user/postStudyCollection';
import postWordToNextStep from '../controllers/user/postWordToNextStep';
import postWordToKnown from '../controllers/user/postWordToKnown';
import getMyWordsHeap from '../controllers/user/getMyWordsHeap';
const usersRoutes = express.Router();

usersRoutes.get('/current', getCurrentUser);
usersRoutes.get('/me/settings', getUserSettings);
usersRoutes.get('/myWordsHeap', query('limit').optional().isNumeric().default(10), getMyWordsHeap);

usersRoutes.put(
  '/me/settings',
  body('isWordTranslation').isBoolean(),
  body('isTranslationWord').isBoolean(),
  body('isTyped').isBoolean(),
  body('repeatCount').isInt({ min: 1, max: 5 }),
  body('wordsPerDay').isInt({ min: 0 }),
  updateUserSettings,
);

usersRoutes.post(
  '/id',
  check('email').isEmail(),
  check('firstName').optional().isString(),
  check('lastName').optional().isString(),
  check('picture').optional().isString(),
  getUserId,
);
usersRoutes.post('/studyCollection', body('collectionId').isString(), postStudyCollection);
usersRoutes.post(
  '/wordToNextStep',
  body('wordId').isString(),
  body('currentStep').isString(),
  postWordToNextStep,
);
usersRoutes.post(
  '/wordToKnown',
  body('wordId').isString(),
  body('currentStep').isString(),
  body('isKnown').isBoolean(),
  postWordToKnown,
);

usersRoutes.patch(
  '/me',
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('picture').optional().isString(),
  updateCurrentUser,
);

export default usersRoutes;
