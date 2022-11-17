import express from 'express';
import { body, query } from 'express-validator';
import getCollections from '../controllers/collections/getCollections';
import postCollection from '../controllers/collections/postCollection';
const collectionsRoutes = express.Router();

collectionsRoutes.get(
  '/',
  query('search').optional().isString(),
  query('userId').optional().isString(),
  query('limit').optional().isNumeric().default(10),
  query('skip').optional().isNumeric().default(0),
  getCollections,
);

collectionsRoutes.post(
  '/',
  body('userId').isString(),
  body('name').isString(),
  body('words').isArray({ min: 5 }),
  body('words.*.word').isString(),
  body('words.*.translation').isString(),
  body('words.*.transcription').optional().isString(),
  body('words.*.image').optional().isString(),
  body('isPrivate').isBoolean(),
  postCollection,
);

export default collectionsRoutes;
