import { Request, Response, NextFunction } from 'express';
import { BodyMetricService } from './body-metrics.service';
import { BodyMetricRepository } from './body-metrics.repository';

const bodyMetricRepository = new BodyMetricRepository();
const bodyMetricService = new BodyMetricService(bodyMetricRepository);

export class BodyMetricController {
  async createMetric(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const metric = await bodyMetricService.createMetric(userId, req.body);

      res.status(201).json({
        data: metric,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const result = await bodyMetricService.getMetrics(userId, req.query);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMetricsHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const metrics = await bodyMetricService.getMetricsHistory(userId);

      res.json({
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMetric(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      await bodyMetricService.deleteMetric(userId, id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
