import express from 'express';
import { query } from 'express-validator';
import getCollections from '../controllers/collections/getCollections';
const collectionsRoutes = express.Router();

collectionsRoutes.get(
  '/',
  query('search').optional().isString(),
  query('rate-sorted').optional().isBoolean(),
  query('userId').optional().isString(),
  query('isCurrent').optional().isBoolean(),
  query('limit').optional().isNumeric().default(10),
  getCollections,
);

export default collectionsRoutes;
