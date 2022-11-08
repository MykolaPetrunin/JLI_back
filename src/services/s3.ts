import dotenv from 'dotenv';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import IUser from '../models/user/interfaces/iUser';

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

export const getUserImageFromAWS = async (user: IUser) => {
  if (user.picture && !user.picture.startsWith('http')) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: user.picture,
    });

    user.picture = await getSignedUrl(s3, command, { expiresIn: 3600 });
  }
  return user;
};

export default s3;
