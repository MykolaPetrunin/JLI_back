import express from 'express';
import getCurrentUser from '../controllers/user/getCurrentUser';
import getUserId from '../controllers/user/getUserId';
import { check, query, param, body } from 'express-validator';
import getUserSettings from '../controllers/user/getUserSettings';
import updateUserSettings from '../controllers/user/updateUserSettings';
import updateUser from '../controllers/user/updateUser';
const usersRoutes = express.Router();

usersRoutes.get('/current', query('userId').isString(), getCurrentUser);
usersRoutes.get('/settings', query('userId').isString(), getUserSettings);
usersRoutes.put(
  '/settings/:userId',
  param('userId').isString(),
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
  '/:userId',
  param('userId').isString(),
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('picture').optional().isString(),
  updateUser,
);

export default usersRoutes;
