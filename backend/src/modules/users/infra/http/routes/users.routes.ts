import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';
import UsersController from '@modules/users/infra/http/controllers/UsersControllers';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';

const usersRouter = Router();
const upload = multer(uploadConfig);
const userAvatarController = new UserAvatarController();
const usersController = new UsersController();

usersRouter.post('/', usersController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
