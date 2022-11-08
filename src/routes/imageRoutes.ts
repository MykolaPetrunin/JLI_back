import express from 'express';
import postImage from '../controllers/images/postImage';
const imageRoutes = express.Router();
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRoutes.post('/', upload.single('file'), postImage);

export default imageRoutes;
