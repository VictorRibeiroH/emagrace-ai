import { z } from 'zod';

export const createGoalSchema = z.object({
  body: z.object({
    targetWeight: z.number().positive().optional(),
    targetBodyFat: z.number().min(0).max(100).optional(),
    deadline: z.string().datetime().optional(),
  }),
});

export const updateGoalSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    targetWeight: z.number().positive().optional(),
    targetBodyFat: z.number().min(0).max(100).optional(),
    deadline: z.string().datetime().optional().nullable(),
  }),
});

export const deleteGoalSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>['body'];
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>['body'];
