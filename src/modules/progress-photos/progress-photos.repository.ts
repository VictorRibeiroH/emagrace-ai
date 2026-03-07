import prisma from '../../config/database';
import { ProgressPhoto, Prisma } from '@prisma/client';

export class ProgressPhotoRepository {
  async create(data: Prisma.ProgressPhotoCreateInput): Promise<ProgressPhoto> {
    return prisma.progressPhoto.create({
      data,
    });
  }

  async findById(id: string): Promise<ProgressPhoto | null> {
    return prisma.progressPhoto.findUnique({
      where: { id },
    });
  }

  async findByUserId(
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<ProgressPhoto[]> {
    return prisma.progressPhoto.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    });
  }

  async delete(id: string): Promise<ProgressPhoto> {
    return prisma.progressPhoto.delete({
      where: { id },
    });
  }

  async count(userId: string): Promise<number> {
    return prisma.progressPhoto.count({
      where: { userId },
    });
  }
}
