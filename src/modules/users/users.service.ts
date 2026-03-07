import { User } from '@prisma/client';
import { UserRepository } from './users.repository';
import { UpdateProfileInput } from './users.schemas';
import { NotFoundError } from '../../utils/errors';
import { calculateBMR, calculateTDEE } from '../../utils/calculations';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Update user
    const updatedUser = await this.userRepository.update(userId, data);

    return updatedUser;
  }

  async getEstimatedTDEE(userId: string): Promise<number | null> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user has all required data
    if (!user.height || !user.age || !user.sex || !user.activityLevel) {
      return null;
    }

    // Get latest weight from body metrics
    const latestMetric = await prisma.bodyMetric.findFirst({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      select: { weight: true },
    });

    if (!latestMetric || !latestMetric.weight) {
      return null;
    }

    const bmr = calculateBMR(latestMetric.weight, user.height, user.age, user.sex);
    const tdee = calculateTDEE(bmr, user.activityLevel);

    return tdee;
  }
}

// Import prisma for the TDEE calculation
import prisma from '../../config/database';
