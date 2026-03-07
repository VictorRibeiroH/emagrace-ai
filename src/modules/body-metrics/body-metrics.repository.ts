import prisma from '../../config/database';
import { BodyMetric, Prisma } from '@prisma/client';

export class BodyMetricRepository {
  async create(data: Prisma.BodyMetricCreateInput): Promise<BodyMetric> {
    return prisma.bodyMetric.create({
      data,
    });
  }

  async findById(id: string): Promise<BodyMetric | null> {
    return prisma.bodyMetric.findUnique({
      where: { id },
    });
  }

  async findByUserId(
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<BodyMetric[]> {
    return prisma.bodyMetric.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    });
  }

  async findLatestByUserId(userId: string): Promise<BodyMetric | null> {
    return prisma.bodyMetric.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async delete(id: string): Promise<BodyMetric> {
    return prisma.bodyMetric.delete({
      where: { id },
    });
  }

  async count(userId: string): Promise<number> {
    return prisma.bodyMetric.count({
      where: { userId },
    });
  }
}
