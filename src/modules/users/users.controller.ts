import { Request, Response, NextFunction } from 'express';
import { UserService } from './users.service';
import { UserRepository } from './users.repository';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const user = await userService.getProfile(userId);

      // Calculate TDEE if possible
      const tdee = await userService.getEstimatedTDEE(userId);

      res.json({
        data: {
          ...user,
          estimatedTDEE: tdee,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const user = await userService.updateProfile(userId, req.body);

      res.json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
