import express from 'express';
import getCurrentUser from '../controllers/user/getCurrentUser';
import getUserId from '../controllers/user/getUserId';
import { check, body } from 'express-validator';
import getUserSettings from '../controllers/user/getUserSettings';
import updateUserSettings from '../controllers/user/updateUserSettings';
import updateCurrentUserUser from '../controllers/user/updateCurrentUserUser';
const usersRoutes = express.Router();

usersRoutes.get('/current', getCurrentUser);
usersRoutes.get('/me/settings', getUserSettings);
usersRoutes.put(
  '/me/settings',
  body('isWordTranslation').isBoolean(),
  body('isTranslationWord').isBoolean(),
  body('isTyped').isBoolean(),
  body('repeatCount').isInt({ min: 0, max: 5 }),
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

usersRoutes.patch(
  '/me',
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('picture').optional().isString(),
  updateCurrentUserUser,
);

export default usersRoutes;
