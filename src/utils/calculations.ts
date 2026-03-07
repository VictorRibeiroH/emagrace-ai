import { ActivityLevel, Sex } from '@prisma/client';

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 */
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  sex: Sex
): number => {
  // Weight in kg, height in cm, age in years
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;

  if (sex === Sex.MALE) {
    return baseBMR + 5;
  } else if (sex === Sex.FEMALE) {
    return baseBMR - 161;
  } else {
    // For OTHER, use average
    return baseBMR - 78;
  }
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  const activityMultipliers = {
    [ActivityLevel.SEDENTARY]: 1.2,
    [ActivityLevel.LIGHTLY_ACTIVE]: 1.375,
    [ActivityLevel.MODERATELY_ACTIVE]: 1.55,
    [ActivityLevel.VERY_ACTIVE]: 1.725,
    [ActivityLevel.EXTREMELY_ACTIVE]: 1.9,
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
};

/**
 * Calculate recommended calories based on diet type
 */
export const calculateDietCalories = (tdee: number, dietType: 'CUTTING' | 'MAINTENANCE' | 'BULKING'): number => {
  switch (dietType) {
    case 'CUTTING':
      return tdee - 500;
    case 'MAINTENANCE':
      return tdee;
    case 'BULKING':
      return tdee + 300;
  }
};

/**
 * Calculate macronutrient distribution
 */
export const calculateMacros = (
  weight: number,
  calories: number
): { protein: number; fat: number; carbs: number } => {
  // Protein: 2.2g per kg body weight
  const protein = Math.round(weight * 2.2);

  // Fat: 0.8g per kg body weight
  const fat = Math.round(weight * 0.8);

  // Remaining calories go to carbs
  // Protein = 4 cal/g, Fat = 9 cal/g, Carbs = 4 cal/g
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const remainingCalories = calories - proteinCalories - fatCalories;
  const carbs = Math.round(remainingCalories / 4);

  return { protein, fat, carbs };
};
