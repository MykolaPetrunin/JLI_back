import cors from 'cors';
import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import usersRoutes from './routes/usersRoutes';
import imageRoutes from './routes/imageRoutes';
import collectionsRoutes from './routes/collectionsRoutes';

dotenv.config();

const app = express();

const whitelist = ['http://localhost:3000', 'http://localhost', 'https://jli-web.herokuapp.com']

app.use(
  cors( (req, callback) => {
      callback(null, { origin: whitelist.indexOf(req.header('Origin')) !== -1, optionsSuccessStatus: 200 })
  }),
);

app.use(
  auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_BASE_URL,
    tokenSigningAlg: 'HS256',
    secret: process.env.AUTH0_SECRET,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/users', usersRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/collections', collectionsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: '404' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.67qegpj.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
  )
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
