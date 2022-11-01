import cors from 'cors';
import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  }),
);

app.use(
  auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_BASE_URL,
    secret: process.env.AUTH0_SECRET,
    tokenSigningAlg: 'HS256',
  }),
);
app.get('/api/private', (req, res) => {
  console.log(req.auth?.payload.email);

  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.',
  });
});

app.use((req, res) => {
  res.status(404).send({ message: '404' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.67qegpj.mongodb.net/?retryWrites=true&w=majority`,
  )
  .then(() => {
    app.listen(3050);
  })
  .catch((err) => console.log(err));
