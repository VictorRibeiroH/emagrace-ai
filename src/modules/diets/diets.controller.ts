import { Request, Response, NextFunction } from 'express';
import { DietService } from './diets.service';
import { DietRepository } from './diets.repository';
import { UserRepository } from '../users/users.repository';
import { BodyMetricRepository } from '../body-metrics/body-metrics.repository';

const dietRepository = new DietRepository();
const userRepository = new UserRepository();
const bodyMetricRepository = new BodyMetricRepository();
const dietService = new DietService(dietRepository, userRepository, bodyMetricRepository);

export class DietController {
  async createDiet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const diet = await dietService.createDiet(userId, req.body);

      res.status(201).json({
        data: diet,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDiets(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const diets = await dietService.getDiets(userId);

      res.json({
        data: diets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDietById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const diet = await dietService.getDietById(userId, id);

      res.json({
        data: diet,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDiet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      await dietService.deleteDiet(userId, id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
