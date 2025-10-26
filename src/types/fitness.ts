export interface UserStats {
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'gain_weight';
}

export interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  timestamp: Date;
}

export interface WorkoutEntry {
  id: string;
  name: string;
  duration: number; // minutes
  type: 'cardio' | 'strength' | 'flexibility' | 'sports';
  caloriesBurned: number;
  timestamp: Date;
}

export interface UserProgress {
  date: string;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: MealPlanMeal[];
  createdAt: Date;
  isAIGenerated: boolean;
}

export interface MealPlanMeal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions?: string[];
  prepTime?: number;
  image?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  exercises: Exercise[];
  createdAt: Date;
  isAIGenerated: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility';
  muscleGroups: string[];
  sets?: number;
  reps?: number;
  duration?: number;
  weight?: number;
  restTime?: number;
  instructions: string[];
  image?: string;
  caloriesPerMinute?: number;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  favoriteExercises: string[];
  preferredWorkoutTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  notificationSettings: NotificationSettings;
  units: 'metric' | 'imperial';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface NotificationSettings {
  mealReminders: boolean;
  workoutReminders: boolean;
  progressUpdates: boolean;
  weeklyReports: boolean;
  mealReminderTimes: string[];
  workoutReminderTime?: string;
}
