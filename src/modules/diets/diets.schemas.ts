import { z } from 'zod';
import { DietType } from '@prisma/client';

export const createDietSchema = z.object({
  body: z.object({
    type: z.nativeEnum(DietType),
    calories: z.number().int().positive().optional(),
    protein: z.number().positive().optional(),
    carbs: z.number().positive().optional(),
    fat: z.number().positive().optional(),
  }),
});

export const getDietByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteDietSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateDietInput = z.infer<typeof createDietSchema>['body'];
