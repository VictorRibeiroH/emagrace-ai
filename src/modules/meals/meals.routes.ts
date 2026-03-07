import { Router } from 'express';
import { MealController } from './meals.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { createMealSchema, getMealsSchema, deleteMealSchema } from './meals.schemas';

const router = Router();
const mealController = new MealController();

router.post('/diet/:id/meals', authMiddleware, validate(createMealSchema), mealController.createMeal);
router.get('/diet/:id/meals', authMiddleware, validate(getMealsSchema), mealController.getMeals);
router.delete('/meals/:id', authMiddleware, validate(deleteMealSchema), mealController.deleteMeal);

export default router;
