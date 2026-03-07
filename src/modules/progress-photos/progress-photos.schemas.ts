import { z } from 'zod';

export const createPhotoSchema = z.object({
  body: z.object({
    frontPhotoUrl: z.string().url().optional(),
    sidePhotoUrl: z.string().url().optional(),
    backPhotoUrl: z.string().url().optional(),
    date: z.string().datetime().optional(),
  }),
});

export const getPhotosQuerySchema = z.object({
  query: z.object({
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const getPhotoByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deletePhotoSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>['body'];
export type GetPhotosQuery = z.infer<typeof getPhotosQuerySchema>['query'];
