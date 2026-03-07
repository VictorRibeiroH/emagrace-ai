import { describe, it, expect } from 'vitest';
import { ActivityLevel, Sex } from '@prisma/client';
import {
  calculateBMR,
  calculateTDEE,
  calculateDietCalories,
  calculateMacros,
} from '../src/utils/calculations';

describe('Calculations Utils', () => {
  describe('calculateBMR', () => {
    it('should calculate BMR for male correctly', () => {
      const bmr = calculateBMR(80, 180, 30, Sex.MALE);
      // BMR = 10 * 80 + 6.25 * 180 - 5 * 30 + 5 = 1780
      expect(bmr).toBe(1780);
    });

    it('should calculate BMR for female correctly', () => {
      const bmr = calculateBMR(60, 165, 25, Sex.FEMALE);
      // BMR = 10 * 60 + 6.25 * 165 - 5 * 25 - 161 = 1376.25
      expect(bmr).toBe(1376.25);
    });

    it('should calculate BMR for other gender correctly', () => {
      const bmr = calculateBMR(70, 175, 28, Sex.OTHER);
      // BMR = 10 * 70 + 6.25 * 175 - 5 * 28 - 78 = 1649.75
      expect(bmr).toBe(1649.75);
    });
  });

  describe('calculateTDEE', () => {
    it('should calculate TDEE for sedentary activity', () => {
      const bmr = 1500;
      const tdee = calculateTDEE(bmr, ActivityLevel.SEDENTARY);
      expect(tdee).toBe(1800); // 1500 * 1.2
    });

    it('should calculate TDEE for moderately active', () => {
      const bmr = 1500;
      const tdee = calculateTDEE(bmr, ActivityLevel.MODERATELY_ACTIVE);
      expect(tdee).toBe(2325); // 1500 * 1.55
    });

    it('should calculate TDEE for very active', () => {
      const bmr = 1800;
      const tdee = calculateTDEE(bmr, ActivityLevel.VERY_ACTIVE);
      expect(tdee).toBe(3105); // 1800 * 1.725
    });
  });

  describe('calculateDietCalories', () => {
    it('should calculate calories for cutting diet', () => {
      const tdee = 2500;
      const calories = calculateDietCalories(tdee, 'CUTTING');
      expect(calories).toBe(2000); // 2500 - 500
    });

    it('should calculate calories for maintenance diet', () => {
      const tdee = 2500;
      const calories = calculateDietCalories(tdee, 'MAINTENANCE');
      expect(calories).toBe(2500);
    });

    it('should calculate calories for bulking diet', () => {
      const tdee = 2500;
      const calories = calculateDietCalories(tdee, 'BULKING');
      expect(calories).toBe(2800); // 2500 + 300
    });
  });

  describe('calculateMacros', () => {
    it('should calculate macros correctly', () => {
      const weight = 80; // kg
      const calories = 2500;

      const macros = calculateMacros(weight, calories);

      // Protein: 80 * 2.2 = 176g
      expect(macros.protein).toBe(176);

      // Fat: 80 * 0.8 = 64g
      expect(macros.fat).toBe(64);

      // Carbs: (2500 - 176*4 - 64*9) / 4 = (2500 - 704 - 576) / 4 = 305g
      expect(macros.carbs).toBe(305);
    });

    it('should handle different weights', () => {
      const weight = 70;
      const calories = 2200;

      const macros = calculateMacros(weight, calories);

      expect(macros.protein).toBe(154); // 70 * 2.2
      expect(macros.fat).toBe(56); // 70 * 0.8
      expect(macros.carbs).toBe(281); // (2200 - 616 - 504) / 4
    });
  });
});
