import { Router } from 'express';
import { ProgressPhotoController } from './progress-photos.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import {
  createPhotoSchema,
  getPhotosQuerySchema,
  getPhotoByIdSchema,
  deletePhotoSchema,
} from './progress-photos.schemas';

const router = Router();
const progressPhotoController = new ProgressPhotoController();

router.post('/photos', authMiddleware, validate(createPhotoSchema), progressPhotoController.createPhoto);
router.get('/photos', authMiddleware, validate(getPhotosQuerySchema), progressPhotoController.getPhotos);
router.get('/photos/:id', authMiddleware, validate(getPhotoByIdSchema), progressPhotoController.getPhotoById);
router.delete('/photos/:id', authMiddleware, validate(deletePhotoSchema), progressPhotoController.deletePhoto);

export default router;
