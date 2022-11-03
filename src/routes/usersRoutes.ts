import express from 'express';
import getCurrentUser from '../controllers/user/getCurrentUser';
import getUserId from '../controllers/user/getUserId';
import { check, query } from 'express-validator';
const usersRoutes = express.Router();

usersRoutes.get('/current', query('userId').isString(), getCurrentUser);
usersRoutes.post(
  '/id',
  check('email').isEmail(),
  check('firstName').optional().isString(),
  check('lastName').optional().isString(),
  check('picture').optional().isString(),
  getUserId,
);

export default usersRoutes;
