import { Router } from 'express';
import { DietController } from './diets.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { createDietSchema, getDietByIdSchema, deleteDietSchema } from './diets.schemas';

const router = Router();
const dietController = new DietController();

router.post('/diet', authMiddleware, validate(createDietSchema), dietController.createDiet);
router.get('/diet', authMiddleware, dietController.getDiets);
router.get('/diet/:id', authMiddleware, validate(getDietByIdSchema), dietController.getDietById);
router.delete('/diet/:id', authMiddleware, validate(deleteDietSchema), dietController.deleteDiet);

export default router;
