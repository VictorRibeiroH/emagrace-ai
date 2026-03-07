import prisma from '../../config/database';
import { Goal, Prisma } from '@prisma/client';

export class GoalRepository {
  async create(data: Prisma.GoalCreateInput): Promise<Goal> {
    return prisma.goal.create({
      data,
    });
  }

  async findById(id: string): Promise<Goal | null> {
    return prisma.goal.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Goal[]> {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Prisma.GoalUpdateInput): Promise<Goal> {
    return prisma.goal.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Goal> {
    return prisma.goal.delete({
      where: { id },
    });
  }
}
