import { BodyMetric } from '@prisma/client';
import { BodyMetricRepository } from './body-metrics.repository';
import { CreateMetricInput, GetMetricsQuery } from './body-metrics.schemas';
import { NotFoundError } from '../../utils/errors';

export class BodyMetricService {
  constructor(private bodyMetricRepository: BodyMetricRepository) {}

  async createMetric(userId: string, data: CreateMetricInput): Promise<BodyMetric> {
    const metric = await this.bodyMetricRepository.create({
      user: {
        connect: { id: userId },
      },
      weight: data.weight,
      waist: data.waist,
      chest: data.chest,
      arm: data.arm,
      thigh: data.thigh,
      bodyFat: data.bodyFat,
      date: data.date ? new Date(data.date) : new Date(),
    });

    return metric;
  }

  async getMetrics(userId: string, query: GetMetricsQuery) {
    const limit = query.limit || 50;
    const offset = query.offset || 0;

    const [metrics, total] = await Promise.all([
      this.bodyMetricRepository.findByUserId(userId, { limit, offset }),
      this.bodyMetricRepository.count(userId),
    ]);

    return {
      data: metrics,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + metrics.length < total,
      },
    };
  }

  async getMetricsHistory(userId: string) {
    const metrics = await this.bodyMetricRepository.findByUserId(userId);
    return metrics;
  }

  async deleteMetric(userId: string, metricId: string): Promise<void> {
    const metric = await this.bodyMetricRepository.findById(metricId);

    if (!metric) {
      throw new NotFoundError('Metric not found');
    }

    if (metric.userId !== userId) {
      throw new NotFoundError('Metric not found');
    }

    await this.bodyMetricRepository.delete(metricId);
  }
}
