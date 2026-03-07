import { Meal } from '@prisma/client';
import { MealRepository } from './meals.repository';
import { DietRepository } from '../diets/diets.repository';
import { CreateMealInput } from './meals.schemas';
import { NotFoundError } from '../../utils/errors';

export class MealService {
  constructor(
    private mealRepository: MealRepository,
    private dietRepository: DietRepository
  ) {}

  async createMeal(userId: string, dietId: string, data: CreateMealInput): Promise<Meal> {
    // Verify diet exists and belongs to user
    const diet = await this.dietRepository.findById(dietId);

    if (!diet) {
      throw new NotFoundError('Diet not found');
    }

    if (diet.userId !== userId) {
      throw new NotFoundError('Diet not found');
    }

    const meal = await this.mealRepository.create({
      diet: {
        connect: { id: dietId },
      },
      mealName: data.mealName,
      foodName: data.foodName,
      quantity: data.quantity,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
    });

    return meal;
  }

  async getMeals(userId: string, dietId: string): Promise<Meal[]> {
    // Verify diet exists and belongs to user
    const diet = await this.dietRepository.findById(dietId);

    if (!diet) {
      throw new NotFoundError('Diet not found');
    }

    if (diet.userId !== userId) {
      throw new NotFoundError('Diet not found');
    }

    const meals = await this.mealRepository.findByDietId(dietId);
    return meals;
  }

  async deleteMeal(userId: string, mealId: string): Promise<void> {
    const meal = await this.mealRepository.findById(mealId);

    if (!meal) {
      throw new NotFoundError('Meal not found');
    }

    // Verify diet belongs to user
    const diet = await this.dietRepository.findById(meal.dietId);

    if (!diet || diet.userId !== userId) {
      throw new NotFoundError('Meal not found');
    }

    await this.mealRepository.delete(mealId);
  }
}
