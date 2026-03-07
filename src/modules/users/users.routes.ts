import { Router } from 'express';
import { UserController } from './users.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { updateProfileSchema } from './users.schemas';

const router = Router();
const userController = new UserController();

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, validate(updateProfileSchema), userController.updateProfile);

export default router;
