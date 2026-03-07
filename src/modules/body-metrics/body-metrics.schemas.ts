import { z } from 'zod';

export const createMetricSchema = z.object({
  body: z.object({
    weight: z.number().positive().optional(),
    waist: z.number().positive().optional(),
    chest: z.number().positive().optional(),
    arm: z.number().positive().optional(),
    thigh: z.number().positive().optional(),
    bodyFat: z.number().min(0).max(100).optional(),
    date: z.string().datetime().optional(),
  }),
});

export const getMetricsQuerySchema = z.object({
  query: z.object({
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const deleteMetricSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateMetricInput = z.infer<typeof createMetricSchema>['body'];
export type GetMetricsQuery = z.infer<typeof getMetricsQuerySchema>['query'];
