import { Request, Response, NextFunction } from 'express';
import { GoalService } from './goals.service';
import { GoalRepository } from './goals.repository';

const goalRepository = new GoalRepository();
const goalService = new GoalService(goalRepository);

export class GoalController {
  async createGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const goal = await goalService.createGoal(userId, req.body);

      res.status(201).json({
        data: goal,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGoals(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const goals = await goalService.getGoals(userId);

      res.json({
        data: goals,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const goal = await goalService.updateGoal(userId, id, req.body);

      res.json({
        data: goal,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      await goalService.deleteGoal(userId, id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
