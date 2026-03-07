import { Request, Response, NextFunction } from 'express';
import { MealService } from './meals.service';
import { MealRepository } from './meals.repository';
import { DietRepository } from '../diets/diets.repository';

const mealRepository = new MealRepository();
const dietRepository = new DietRepository();
const mealService = new MealService(mealRepository, dietRepository);

export class MealController {
  async createMeal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id: dietId } = req.params;
      const meal = await mealService.createMeal(userId, dietId, req.body);

      res.status(201).json({
        data: meal,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMeals(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id: dietId } = req.params;
      const meals = await mealService.getMeals(userId, dietId);

      res.json({
        data: meals,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMeal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id: mealId } = req.params;

      await mealService.deleteMeal(userId, mealId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
