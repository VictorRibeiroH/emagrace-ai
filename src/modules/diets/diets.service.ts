import { Diet } from '@prisma/client';
import { DietRepository } from './diets.repository';
import { CreateDietInput } from './diets.schemas';
import { NotFoundError } from '../../utils/errors';
import { UserRepository } from '../users/users.repository';
import { BodyMetricRepository } from '../body-metrics/body-metrics.repository';
import { calculateBMR, calculateTDEE, calculateDietCalories, calculateMacros } from '../../utils/calculations';

export class DietService {
  constructor(
    private dietRepository: DietRepository,
    private userRepository: UserRepository,
    private bodyMetricRepository: BodyMetricRepository
  ) {}

  async createDiet(userId: string, data: CreateDietInput): Promise<Diet> {
    // If calories and macros are not provided, calculate them automatically
    let calories = data.calories;
    let protein = data.protein;
    let carbs = data.carbs;
    let fat = data.fat;

    if (!calories || !protein || !carbs || !fat) {
      // Get user data
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Get latest weight
      const latestMetric = await this.bodyMetricRepository.findLatestByUserId(userId);

      if (user.height && user.age && user.sex && user.activityLevel && latestMetric?.weight) {
        // Calculate TDEE
        const bmr = calculateBMR(latestMetric.weight, user.height, user.age, user.sex);
        const tdee = calculateTDEE(bmr, user.activityLevel);

        // Calculate diet calories based on type
        calories = calculateDietCalories(tdee, data.type);

        // Calculate macros
        const macros = calculateMacros(latestMetric.weight, calories);
        protein = macros.protein;
        carbs = macros.carbs;
        fat = macros.fat;
      }
    }

    // Default values if calculations failed
    calories = calories || 2000;
    protein = protein || 150;
    carbs = carbs || 200;
    fat = fat || 50;

    const diet = await this.dietRepository.create({
      user: {
        connect: { id: userId },
      },
      type: data.type,
      calories,
      protein,
      carbs,
      fat,
    });

    return diet;
  }

  async getDiets(userId: string) {
    const diets = await this.dietRepository.findByUserId(userId);
    return diets;
  }

  async getDietById(userId: string, dietId: string): Promise<Diet> {
    const diet = await this.dietRepository.findById(dietId);

    if (!diet) {
      throw new NotFoundError('Diet not found');
    }

    if (diet.userId !== userId) {
      throw new NotFoundError('Diet not found');
    }

    return diet;
  }

  async deleteDiet(userId: string, dietId: string): Promise<void> {
    const diet = await this.dietRepository.findById(dietId);

    if (!diet) {
      throw new NotFoundError('Diet not found');
    }

    if (diet.userId !== userId) {
      throw new NotFoundError('Diet not found');
    }

    await this.dietRepository.delete(dietId);
  }
}
