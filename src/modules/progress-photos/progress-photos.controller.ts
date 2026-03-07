import { Request, Response, NextFunction } from 'express';
import { ProgressPhotoService } from './progress-photos.service';
import { ProgressPhotoRepository } from './progress-photos.repository';

const progressPhotoRepository = new ProgressPhotoRepository();
const progressPhotoService = new ProgressPhotoService(progressPhotoRepository);

export class ProgressPhotoController {
  async createPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const photo = await progressPhotoService.createPhoto(userId, req.body);

      res.status(201).json({
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const result = await progressPhotoService.getPhotos(userId, req.query);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPhotoById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const photo = await progressPhotoService.getPhotoById(userId, id);

      res.json({
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      await progressPhotoService.deletePhoto(userId, id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
