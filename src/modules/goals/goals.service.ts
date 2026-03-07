import { Goal } from '@prisma/client';
import { GoalRepository } from './goals.repository';
import { CreateGoalInput, UpdateGoalInput } from './goals.schemas';
import { NotFoundError } from '../../utils/errors';

export class GoalService {
  constructor(private goalRepository: GoalRepository) {}

  async createGoal(userId: string, data: CreateGoalInput): Promise<Goal> {
    const goal = await this.goalRepository.create({
      user: {
        connect: { id: userId },
      },
      targetWeight: data.targetWeight,
      targetBodyFat: data.targetBodyFat,
      deadline: data.deadline ? new Date(data.deadline) : null,
    });

    return goal;
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const goals = await this.goalRepository.findByUserId(userId);
    return goals;
  }

  async updateGoal(userId: string, goalId: string, data: UpdateGoalInput): Promise<Goal> {
    const goal = await this.goalRepository.findById(goalId);

    if (!goal) {
      throw new NotFoundError('Goal not found');
    }

    if (goal.userId !== userId) {
      throw new NotFoundError('Goal not found');
    }

    const updatedGoal = await this.goalRepository.update(goalId, {
      targetWeight: data.targetWeight,
      targetBodyFat: data.targetBodyFat,
      deadline: data.deadline !== undefined 
        ? (data.deadline ? new Date(data.deadline) : null)
        : undefined,
    });

    return updatedGoal;
  }

  async deleteGoal(userId: string, goalId: string): Promise<void> {
    const goal = await this.goalRepository.findById(goalId);

    if (!goal) {
      throw new NotFoundError('Goal not found');
    }

    if (goal.userId !== userId) {
      throw new NotFoundError('Goal not found');
    }

    await this.goalRepository.delete(goalId);
  }
}
