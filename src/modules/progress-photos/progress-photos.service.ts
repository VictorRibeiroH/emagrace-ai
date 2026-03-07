import { ProgressPhoto } from '@prisma/client';
import { ProgressPhotoRepository } from './progress-photos.repository';
import { CreatePhotoInput, GetPhotosQuery } from './progress-photos.schemas';
import { NotFoundError } from '../../utils/errors';

export class ProgressPhotoService {
  constructor(private progressPhotoRepository: ProgressPhotoRepository) {}

  async createPhoto(userId: string, data: CreatePhotoInput): Promise<ProgressPhoto> {
    const photo = await this.progressPhotoRepository.create({
      user: {
        connect: { id: userId },
      },
      frontPhotoUrl: data.frontPhotoUrl,
      sidePhotoUrl: data.sidePhotoUrl,
      backPhotoUrl: data.backPhotoUrl,
      date: data.date ? new Date(data.date) : new Date(),
    });

    return photo;
  }

  async getPhotos(userId: string, query: GetPhotosQuery) {
    const limit = query.limit || 50;
    const offset = query.offset || 0;

    const [photos, total] = await Promise.all([
      this.progressPhotoRepository.findByUserId(userId, { limit, offset }),
      this.progressPhotoRepository.count(userId),
    ]);

    return {
      data: photos,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + photos.length < total,
      },
    };
  }

  async getPhotoById(userId: string, photoId: string): Promise<ProgressPhoto> {
    const photo = await this.progressPhotoRepository.findById(photoId);

    if (!photo) {
      throw new NotFoundError('Photo not found');
    }

    if (photo.userId !== userId) {
      throw new NotFoundError('Photo not found');
    }

    return photo;
  }

  async deletePhoto(userId: string, photoId: string): Promise<void> {
    const photo = await this.progressPhotoRepository.findById(photoId);

    if (!photo) {
      throw new NotFoundError('Photo not found');
    }

    if (photo.userId !== userId) {
      throw new NotFoundError('Photo not found');
    }

    await this.progressPhotoRepository.delete(photoId);
  }
}
