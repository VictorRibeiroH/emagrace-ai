import { Router } from 'express';
import { BodyMetricController } from './body-metrics.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import {
  createMetricSchema,
  getMetricsQuerySchema,
  deleteMetricSchema,
} from './body-metrics.schemas';

const router = Router();
const bodyMetricController = new BodyMetricController();

router.post('/metrics', authMiddleware, validate(createMetricSchema), bodyMetricController.createMetric);
router.get('/metrics', authMiddleware, validate(getMetricsQuerySchema), bodyMetricController.getMetrics);
router.get('/metrics/history', authMiddleware, bodyMetricController.getMetricsHistory);
router.delete('/metrics/:id', authMiddleware, validate(deleteMetricSchema), bodyMetricController.deleteMetric);

export default router;
