import { Router } from 'express';
import { GoalController } from './goals.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { createGoalSchema, updateGoalSchema, deleteGoalSchema } from './goals.schemas';

const router = Router();
const goalController = new GoalController();

router.post('/goals', authMiddleware, validate(createGoalSchema), goalController.createGoal);
router.get('/goals', authMiddleware, goalController.getGoals);
router.put('/goals/:id', authMiddleware, validate(updateGoalSchema), goalController.updateGoal);
router.delete('/goals/:id', authMiddleware, validate(deleteGoalSchema), goalController.deleteGoal);

export default router;
