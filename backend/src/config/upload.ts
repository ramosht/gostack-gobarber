import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,
  tmpFolder,
  uploadFolder: path.resolve(tmpFolder, 'uploads'),

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const hashName = crypto.randomBytes(10).toString('hex');
      const filename = `${hashName}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
