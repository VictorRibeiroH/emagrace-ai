import { z } from 'zod';
import { ActivityLevel, Sex } from '@prisma/client';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    height: z.number().positive().optional(),
    age: z.number().int().positive().optional(),
    sex: z.nativeEnum(Sex).optional(),
    activityLevel: z.nativeEnum(ActivityLevel).optional(),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
