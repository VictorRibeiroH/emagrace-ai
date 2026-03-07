import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../src/modules/users/users.service';
import { NotFoundError } from '../src/utils/errors';
import { ActivityLevel, Sex } from '@prisma/client';

// Mock UserRepository
vi.mock('../src/modules/users/users.repository');

describe('UserService', () => {
  let userService: UserService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    userService = new UserService(mockUserRepository);
  });

  describe('getProfile', () => {
    it('should return user profile if user exists', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        height: 180,
        age: 30,
        sex: Sex.MALE,
        activityLevel: ActivityLevel.MODERATELY_ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getProfile('user-1');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-1');
    });

    it('should throw NotFoundError if user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.getProfile('nonexistent-user')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const existingUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        height: 180,
        age: 30,
        sex: Sex.MALE,
        activityLevel: ActivityLevel.MODERATELY_ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateData = {
        name: 'Updated Name',
        height: 185,
      };

      const updatedUser = { ...existingUser, ...updateData };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await userService.updateProfile('user-1', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith('user-1', updateData);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        userService.updateProfile('nonexistent-user', { name: 'Test' })
      ).rejects.toThrow(NotFoundError);
    });
  });
});
