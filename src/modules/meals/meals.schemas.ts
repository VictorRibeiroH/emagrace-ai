import { z } from 'zod';

export const createMealSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    mealName: z.string().min(1),
    foodName: z.string().min(1),
    quantity: z.string().min(1),
    calories: z.number().int().min(0),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
  }),
});

export const getMealsSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteMealSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateMealInput = z.infer<typeof createMealSchema>['body'];
