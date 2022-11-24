import express from 'express';
import { body, param, query } from 'express-validator';
import getCollections from '../controllers/collections/getCollections';
import postCollection from '../controllers/collections/postCollection';
import getCollection from '../controllers/collections/getCollection';
import patchCollection from '../controllers/collections/patchCollection';
import deleteCollection from '../controllers/collections/deleteCollection';
const collectionsRoutes = express.Router();

collectionsRoutes.get(
  '/',
  query('search').optional().isString(),
  query('isMy').optional().isBoolean(),
  query('limit').optional().isNumeric().default(10),
  query('page').optional().isNumeric().default(1),
  getCollections,
);

collectionsRoutes.get('/:collectionId', param('collectionId').isString(), getCollection);
collectionsRoutes.delete('/:collectionId', param('collectionId').isString(), deleteCollection);

collectionsRoutes.post(
  '/',
  body('name').isString(),
  body('words').isArray({ min: 5 }),
  body('words.*.word').isString(),
  body('words.*.translation').isString(),
  body('words.*.transcription').optional().isString(),
  body('words.*.image').optional().isString(),
  body('isPrivate').isBoolean(),
  postCollection,
);

collectionsRoutes.patch(
  '/:collectionId',
  param('collectionId').isString(),
  body('name').optional().isString(),
  body('words').optional().isArray({ min: 5 }),
  body('words.*.word').isString(),
  body('words.*.id').optional().isString(),
  body('words.*.translation').isString(),
  body('words.*.transcription').optional().isString(),
  body('words.*.image').optional().isString(),
  body('isPrivate').optional().isBoolean(),
  patchCollection,
);

export default collectionsRoutes;
