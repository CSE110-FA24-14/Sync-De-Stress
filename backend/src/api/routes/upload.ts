import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from '../../controller/upload';
import { requireAuthorization } from '../../middlewares/user';

const router = Router();

// Configure storage settings for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/'); // Save files to the 'public' directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const randomName = `${uuidv4()}${ext}`; // Generate random file name
    cb(null, randomName);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

export default (app: Router) => {
    router.post('/', requireAuthorization, upload.single('image'), uploadImage);
    app.use("/upload", router);
};
