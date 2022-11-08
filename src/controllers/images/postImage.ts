import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Res from '../../interfaces/res';
import ErrorRes from '../../interfaces/errorRes';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import s3 from '../../services/s3';

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const postImage = async (
  req: Request<unknown, unknown, { file: string }, unknown>,
  res: Response<Res<{ imageId: string }> | ErrorRes>,
): Promise<void> => {
  const matches = req.body.file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const buf = new Buffer(matches[2], 'base64');

  if (buf.length > 1000000) {
    res.status(400).json({ error: 'File size should not be more than 1 MB' });
  }

  const imageName = randomImageName();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageName,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: matches[1],
  });

  await s3.send(command);

  res.status(200).json({ data: { imageId: imageName } });
};

export default postImage;
