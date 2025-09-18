import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/barbers'); // folder for barber images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  }
});

const uploadBarberImage = multer({ storage }).single('image'); // 'image' = frontend field name

export default uploadBarberImage;
