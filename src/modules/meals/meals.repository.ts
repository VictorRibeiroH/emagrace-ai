import prisma from '../../config/database';
import { Meal, Prisma } from '@prisma/client';

export class MealRepository {
  async create(data: Prisma.MealCreateInput): Promise<Meal> {
    return prisma.meal.create({
      data,
    });
  }

  async findById(id: string): Promise<Meal | null> {
    return prisma.meal.findUnique({
      where: { id },
    });
  }

  async findByDietId(dietId: string): Promise<Meal[]> {
    return prisma.meal.findMany({
      where: { dietId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async delete(id: string): Promise<Meal> {
    return prisma.meal.delete({
      where: { id },
    });
  }
}
