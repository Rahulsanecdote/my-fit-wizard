// Advanced types for world-class fitness app features

// Ingredient Management Types
export interface Ingredient {
  id: string;
  name: string;
  category: 'protein' | 'vegetable' | 'fruit' | 'grain' | 'dairy' | 'spice' | 'condiment' | 'oil' | 'nut' | 'other';
  quantity: number;
  unit: 'g' | 'kg' | 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'ml' | 'l' | 'piece' | 'serving';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  expirationDate?: Date;
  addedDate: Date;
  isLowStock?: boolean;
  barcode?: string;
  brand?: string;
  allergens?: string[];
  tags?: string[];
  imageUrl?: string;
}

export interface PantryItem extends Ingredient {
  location?: 'fridge' | 'freezer' | 'pantry' | 'counter';
  opened?: boolean;
  openedDate?: Date;
  notes?: string;
}

export interface RecipeFromIngredients {
  id: string;
  name: string;
  description: string;
  availableIngredients: string[];
  missingIngredients?: string[];
  matchPercentage: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  tags: string[];
  cuisine?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  imageUrl?: string;
  aiGenerated: boolean;
  confidence: number; // AI confidence in recipe quality
}

// Equipment-Based Workout Types
export interface Equipment {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'bodyweight' | 'resistance' | 'other';
  subCategory?: string;
  spaceRequired: 'minimal' | 'moderate' | 'large';
  portability: 'fixed' | 'portable' | 'travel-friendly';
  alternatives?: string[];
  exercises: string[];
  imageUrl?: string;
}

export interface UserEquipment {
  equipmentId: string;
  owned: boolean;
  preferenceLevel: 1 | 2 | 3 | 4 | 5; // 1 = rarely use, 5 = love to use
  location?: 'home' | 'gym' | 'office' | 'outdoor';
  notes?: string;
}

export interface EquipmentBasedWorkout {
  id: string;
  name: string;
  description: string;
  requiredEquipment: string[];
  optionalEquipment?: string[];
  noEquipmentAlternative?: boolean;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  targetMuscles: string[];
  exercises: WorkoutExercise[];
  caloriesBurned: number;
  workoutType: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'hybrid';
  spaceRequired: 'minimal' | 'moderate' | 'large';
  aiGenerated: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number | string; // Can be "12-15" or "to failure"
  duration?: number; // seconds
  rest?: number; // seconds
  weight?: number;
  equipment?: string;
  alternatives?: string[];
  instructions: string[];
  tips?: string[];
  videoUrl?: string;
  imageUrl?: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Advanced Notification Types
export interface NotificationTemplate {
  id: string;
  type: 'meal' | 'workout' | 'water' | 'progress' | 'motivation' | 'achievement' | 'reminder' | 'tip';
  title: string;
  message: string;
  action?: {
    label: string;
    route: string;
  };
  icon?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customData?: Record<string, any>;
}

export interface ScheduledNotification {
  id: string;
  templateId: string;
  scheduledTime: Date;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    endDate?: Date;
  };
  delivered: boolean;
  read: boolean;
  snoozedUntil?: Date;
  userId: string;
}

// Nutrition Calculation Types
export interface NutritionCalculation {
  baseCalories: number;
  adjustedCalories: number;
  macroSplit: {
    proteinPercentage: number;
    carbsPercentage: number;
    fatPercentage: number;
  };
  micronutrients?: {
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminK?: number;
    thiamin?: number;
    riboflavin?: number;
    niacin?: number;
    b6?: number;
    folate?: number;
    b12?: number;
    calcium?: number;
    iron?: number;
    magnesium?: number;
    phosphorus?: number;
    potassium?: number;
    sodium?: number;
    zinc?: number;
  };
  mealDistribution: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
  hydrationGoal: number; // ml
  fiberGoal: number; // g
  sugarLimit: number; // g
  sodiumLimit: number; // mg
}

// AI Recommendation Types
export interface AIRecommendation {
  id: string;
  type: 'meal' | 'workout' | 'nutrition' | 'lifestyle';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  actionItems?: {
    label: string;
    action: string;
    data?: any;
  }[];
  validUntil: Date;
  basedOn: string[]; // What data points influenced this recommendation
  tags: string[];
}

// Social and Gamification Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'nutrition' | 'workout' | 'consistency' | 'milestone' | 'social';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  iconUrl?: string;
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
    unit: string;
  };
  requirements: {
    type: string;
    value: any;
    operator: 'equals' | 'greater' | 'less' | 'between';
  }[];
  rewards?: {
    type: 'badge' | 'title' | 'feature' | 'discount';
    value: string;
  }[];
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'personal' | 'community' | 'friend';
  category: 'nutrition' | 'workout' | 'weight' | 'habit';
  startDate: Date;
  endDate: Date;
  participants?: string[];
  leaderboard?: {
    userId: string;
    score: number;
    rank: number;
  }[];
  prize?: string;
  rules: string[];
  progress: {
    userId: string;
    current: number;
    target: number;
  }[];
  status: 'upcoming' | 'active' | 'completed';
}

// Voice Input Types
export interface VoiceCommand {
  id: string;
  transcript: string;
  intent: 'add_ingredient' | 'log_meal' | 'start_workout' | 'check_progress' | 'set_reminder' | 'ask_question';
  entities?: {
    ingredient?: string;
    quantity?: number;
    unit?: string;
    meal?: string;
    workout?: string;
    time?: Date;
  };
  confidence: number;
  processedAt: Date;
  response?: string;
}

// Barcode Scanning Types
export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  nutrition: {
    servingSize: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  ingredients?: string[];
  allergens?: string[];
  imageUrl?: string;
  verified: boolean;
}

// Shopping List Types
export interface ShoppingListItem {
  id: string;
  ingredientId?: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  addedBy: 'user' | 'ai' | 'recipe';
  relatedRecipes?: string[];
  store?: string;
  estimatedPrice?: number;
  notes?: string;
}

// Progress Analytics Types
export interface ProgressAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    nutrition: {
      averageCalories: number;
      calorieGoalAdherence: number; // percentage
      macroBalance: {
        protein: number;
        carbs: number;
        fat: number;
      };
      topFoods: { name: string; count: number }[];
      mealConsistency: number; // percentage
    };
    workout: {
      totalWorkouts: number;
      totalMinutes: number;
      averageIntensity: number;
      caloriesBurned: number;
      favoriteExercises: { name: string; count: number }[];
      consistency: number; // percentage
      strengthProgress?: { exercise: string; improvement: number }[];
    };
    body: {
      weightChange: number;
      bodyFatChange?: number;
      muscleGain?: number;
      measurements?: {
        chest?: number;
        waist?: number;
        hips?: number;
        arms?: number;
        thighs?: number;
      };
    };
    habits: {
      waterIntake: number;
      sleepAverage?: number;
      stepsAverage?: number;
      streaks: {
        current: number;
        longest: number;
      };
    };
  };
  insights: string[];
  recommendations: string[];
}
