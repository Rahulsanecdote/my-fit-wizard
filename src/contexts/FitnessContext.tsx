import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserStats, DailyNutrition, NutritionGoals, FoodEntry, WorkoutEntry, UserProgress, MealPlan, WorkoutPlan, UserPreferences, NotificationSettings } from '@/types/fitness';

interface FitnessContextType {
  userStats: UserStats | null;
  setUserStats: (stats: UserStats) => void;
  dailyNutrition: DailyNutrition;
  nutritionGoals: NutritionGoals;
  setNutritionGoals: (goals: NutritionGoals) => void;
  foodEntries: FoodEntry[];
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void;
  workoutEntries: WorkoutEntry[];
  addWorkoutEntry: (entry: Omit<WorkoutEntry, 'id' | 'timestamp'>) => void;
  userProgress: UserProgress[];
  addProgressEntry: (progress: Omit<UserProgress, 'date'>) => void;
  addWater: (glasses: number) => void;
  calculateNutritionGoals: (stats: UserStats) => NutritionGoals;
  // Meal plans
  mealPlans: MealPlan[];
  addMealPlan: (mealPlan: MealPlan) => void;
  activeMealPlan: MealPlan | null;
  setActiveMealPlan: (mealPlan: MealPlan | null) => void;
  // Workout plans
  workoutPlans: WorkoutPlan[];
  addWorkoutPlan: (workoutPlan: WorkoutPlan) => void;
  activeWorkoutPlan: WorkoutPlan | null;
  setActiveWorkoutPlan: (workoutPlan: WorkoutPlan | null) => void;
  // User preferences
  userPreferences: UserPreferences;
  setUserPreferences: (preferences: UserPreferences) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userStats, setUserStatsState] = useState<UserStats | null>(null);
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0
  });
  const [nutritionGoals, setNutritionGoalsState] = useState<NutritionGoals>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 70,
    water: 8
  });
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [workoutEntries, setWorkoutEntries] = useState<WorkoutEntry[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [activeMealPlan, setActiveMealPlanState] = useState<MealPlan | null>(null);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [activeWorkoutPlan, setActiveWorkoutPlanState] = useState<WorkoutPlan | null>(null);
  const [userPreferences, setUserPreferencesState] = useState<UserPreferences>({
    dietaryRestrictions: [],
    allergies: [],
    favoriteExercises: [],
    preferredWorkoutTime: 'flexible',
    units: 'metric',
    fitnessLevel: 'beginner',
    notificationSettings: {
      mealReminders: true,
      workoutReminders: true,
      progressUpdates: true,
      weeklyReports: false,
      mealReminderTimes: ['08:00', '12:00', '18:00'],
      workoutReminderTime: '07:00'
    }
  });

  // Calculate nutrition goals based on user stats
  const calculateNutritionGoals = (stats: UserStats): NutritionGoals => {
    // Basic BMR calculation using Mifflin-St Jeor Equation
    const bmr = stats.weight * 10 + stats.height * 6.25 - stats.age * 5 + 5; // for males, adjust if needed
    
    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    let calories = bmr * activityMultipliers[stats.activityLevel];

    // Adjust for goals
    switch (stats.goal) {
      case 'lose_weight':
        calories -= 500; // 1lb per week deficit
        break;
      case 'gain_weight':
      case 'gain_muscle':
        calories += 300; // moderate surplus
        break;
      default:
        break;
    }

    // Macro calculations (protein: 1g per lb bodyweight, fat: 25% calories, carbs: remainder)
    const protein = stats.weight * 2.2; // convert kg to lbs then 1g per lb
    const fat = (calories * 0.25) / 9; // 25% of calories from fat
    const carbs = (calories - protein * 4 - fat * 9) / 4; // remainder from carbs

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      water: 8 // 8 glasses per day
    };
  };

  const setUserStats = (stats: UserStats) => {
    setUserStatsState(stats);
    const goals = calculateNutritionGoals(stats);
    setNutritionGoalsState(goals);
    // Save to localStorage
    localStorage.setItem('fitness-user-stats', JSON.stringify(stats));
    localStorage.setItem('fitness-nutrition-goals', JSON.stringify(goals));
  };

  const setNutritionGoals = (goals: NutritionGoals) => {
    setNutritionGoalsState(goals);
    localStorage.setItem('fitness-nutrition-goals', JSON.stringify(goals));
  };

  const addFoodEntry = (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    
    setFoodEntries(prev => [...prev, newEntry]);
    
    // Update daily nutrition
    setDailyNutrition(prev => ({
      calories: prev.calories + entry.calories,
      protein: prev.protein + entry.protein,
      carbs: prev.carbs + entry.carbs,
      fat: prev.fat + entry.fat,
      water: prev.water
    }));
  };

  const addWorkoutEntry = (entry: Omit<WorkoutEntry, 'id' | 'timestamp'>) => {
    const newEntry: WorkoutEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    
    setWorkoutEntries(prev => [...prev, newEntry]);
  };

  const addProgressEntry = (progress: Omit<UserProgress, 'date'>) => {
    const newProgress: UserProgress = {
      ...progress,
      date: new Date().toISOString().split('T')[0]
    };
    
    setUserProgress(prev => [...prev.filter(p => p.date !== newProgress.date), newProgress]);
  };

  const addWater = (glasses: number) => {
    setDailyNutrition(prev => ({
      ...prev,
      water: Math.min(prev.water + glasses, nutritionGoals.water)
    }));
  };

  const addMealPlan = (mealPlan: MealPlan) => {
    setMealPlans(prev => [...prev, mealPlan]);
    localStorage.setItem('fitness-meal-plans', JSON.stringify([...mealPlans, mealPlan]));
  };

  const setActiveMealPlan = (mealPlan: MealPlan | null) => {
    setActiveMealPlanState(mealPlan);
    localStorage.setItem('fitness-active-meal-plan', JSON.stringify(mealPlan));
  };

  const addWorkoutPlan = (workoutPlan: WorkoutPlan) => {
    setWorkoutPlans(prev => [...prev, workoutPlan]);
    localStorage.setItem('fitness-workout-plans', JSON.stringify([...workoutPlans, workoutPlan]));
  };

  const setActiveWorkoutPlan = (workoutPlan: WorkoutPlan | null) => {
    setActiveWorkoutPlanState(workoutPlan);
    localStorage.setItem('fitness-active-workout-plan', JSON.stringify(workoutPlan));
  };

  const setUserPreferences = (preferences: UserPreferences) => {
    setUserPreferencesState(preferences);
    localStorage.setItem('fitness-user-preferences', JSON.stringify(preferences));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('fitness-user-stats');
    const savedGoals = localStorage.getItem('fitness-nutrition-goals');
    const savedMealPlans = localStorage.getItem('fitness-meal-plans');
    const savedActiveMealPlan = localStorage.getItem('fitness-active-meal-plan');
    const savedWorkoutPlans = localStorage.getItem('fitness-workout-plans');
    const savedActiveWorkoutPlan = localStorage.getItem('fitness-active-workout-plan');
    const savedPreferences = localStorage.getItem('fitness-user-preferences');
    
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setUserStatsState(stats);
    }
    
    if (savedGoals) {
      const goals = JSON.parse(savedGoals);
      setNutritionGoalsState(goals);
    }

    if (savedMealPlans) {
      setMealPlans(JSON.parse(savedMealPlans));
    }

    if (savedActiveMealPlan && savedActiveMealPlan !== 'null') {
      setActiveMealPlanState(JSON.parse(savedActiveMealPlan));
    }

    if (savedWorkoutPlans) {
      setWorkoutPlans(JSON.parse(savedWorkoutPlans));
    }

    if (savedActiveWorkoutPlan && savedActiveWorkoutPlan !== 'null') {
      setActiveWorkoutPlanState(JSON.parse(savedActiveWorkoutPlan));
    }

    if (savedPreferences) {
      setUserPreferencesState(JSON.parse(savedPreferences));
    }
  }, []);

  // Reset daily nutrition at midnight (in a real app, this would be handled by a service)
  useEffect(() => {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('last-nutrition-reset');
    
    if (lastReset !== today) {
      setDailyNutrition({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: 0
      });
      setFoodEntries([]);
      setWorkoutEntries([]);
      localStorage.setItem('last-nutrition-reset', today);
    }
  }, []);

  const value = {
    userStats,
    setUserStats,
    dailyNutrition,
    nutritionGoals,
    setNutritionGoals,
    foodEntries,
    addFoodEntry,
    workoutEntries,
    addWorkoutEntry,
    userProgress,
    addProgressEntry,
    addWater,
    calculateNutritionGoals,
    mealPlans,
    addMealPlan,
    activeMealPlan,
    setActiveMealPlan,
    workoutPlans,
    addWorkoutPlan,
    activeWorkoutPlan,
    setActiveWorkoutPlan,
    userPreferences,
    setUserPreferences
  };

  return <FitnessContext.Provider value={value}>{children}</FitnessContext.Provider>;
};
