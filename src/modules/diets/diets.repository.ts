import prisma from '../../config/database';
import { Diet, Prisma } from '@prisma/client';

export class DietRepository {
  async create(data: Prisma.DietCreateInput): Promise<Diet> {
    return prisma.diet.create({
      data,
    });
  }

  async findById(id: string): Promise<Diet | null> {
    return prisma.diet.findUnique({
      where: { id },
      include: {
        meals: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Diet[]> {
    return prisma.diet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        meals: true,
      },
    });
  }

  async delete(id: string): Promise<Diet> {
    return prisma.diet.delete({
      where: { id },
    });
  }
}
