import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BodyMetricService } from '../src/modules/body-metrics/body-metrics.service';
import { NotFoundError } from '../src/utils/errors';

vi.mock('../src/modules/body-metrics/body-metrics.repository');

describe('BodyMetricService', () => {
  let bodyMetricService: BodyMetricService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockBodyMetricRepository: any;

  beforeEach(() => {
    mockBodyMetricRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findLatestByUserId: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    };

    bodyMetricService = new BodyMetricService(mockBodyMetricRepository);
  });

  describe('createMetric', () => {
    it('should create a body metric successfully', async () => {
      const userId = 'user-1';
      const metricData = {
        weight: 80,
        waist: 85,
        chest: 100,
        arm: 35,
        thigh: 60,
        bodyFat: 15,
      };

      const mockMetric = {
        id: 'metric-1',
        userId,
        ...metricData,
        date: new Date(),
        createdAt: new Date(),
      };

      mockBodyMetricRepository.create.mockResolvedValue(mockMetric);

      const result = await bodyMetricService.createMetric(userId, metricData);

      expect(result).toEqual(mockMetric);
      expect(mockBodyMetricRepository.create).toHaveBeenCalled();
    });
  });

  describe('getMetrics', () => {
    it('should return paginated metrics', async () => {
      const userId = 'user-1';
      const mockMetrics = [
        { id: 'metric-1', userId, weight: 80, date: new Date(), createdAt: new Date() },
        { id: 'metric-2', userId, weight: 79, date: new Date(), createdAt: new Date() },
      ];

      mockBodyMetricRepository.findByUserId.mockResolvedValue(mockMetrics);
      mockBodyMetricRepository.count.mockResolvedValue(2);

      const result = await bodyMetricService.getMetrics(userId, {});

      expect(result.data).toEqual(mockMetrics);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.limit).toBe(50);
    });
  });

  describe('deleteMetric', () => {
    it('should delete metric successfully', async () => {
      const userId = 'user-1';
      const metricId = 'metric-1';
      const mockMetric = {
        id: metricId,
        userId,
        weight: 80,
        date: new Date(),
        createdAt: new Date(),
      };

      mockBodyMetricRepository.findById.mockResolvedValue(mockMetric);
      mockBodyMetricRepository.delete.mockResolvedValue(mockMetric);

      await bodyMetricService.deleteMetric(userId, metricId);

      expect(mockBodyMetricRepository.delete).toHaveBeenCalledWith(metricId);
    });

    it('should throw NotFoundError if metric does not exist', async () => {
      mockBodyMetricRepository.findById.mockResolvedValue(null);

      await expect(
        bodyMetricService.deleteMetric('user-1', 'nonexistent-metric')
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if metric belongs to different user', async () => {
      const mockMetric = {
        id: 'metric-1',
        userId: 'user-2',
        weight: 80,
        date: new Date(),
        createdAt: new Date(),
      };

      mockBodyMetricRepository.findById.mockResolvedValue(mockMetric);

      await expect(
        bodyMetricService.deleteMetric('user-1', 'metric-1')
      ).rejects.toThrow(NotFoundError);
    });
  });
});
