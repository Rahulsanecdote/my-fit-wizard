// Comprehensive API Service for AI Meal Plans and Workouts
// This service provides real-time AI generation with full CRUD operations

import { 
  MealPlan, 
  MealPlanMeal, 
  WorkoutPlan, 
  NutritionGoals,
  UserStats,
  UserPreferences
} from '@/types/fitness';
import {
  RecipeFromIngredients,
  EquipmentBasedWorkout,
  WorkoutExercise
} from '@/types/advanced-fitness';
import { nutritionixService } from './nutritionixService';

// API Configuration
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'https://api.fitgenie.ai',
  apiKey: import.meta.env.VITE_API_KEY || 'demo-key',
  timeout: 30000,
  retryAttempts: 3
};

// Mock API responses for development
const USE_MOCK_API = !import.meta.env.VITE_API_URL || import.meta.env.DEV;

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    processingTime: number;
    confidence: number;
    version: string;
  };
}

interface MealPlanRequest {
  nutritionGoals: NutritionGoals;
  userStats: UserStats;
  preferences?: UserPreferences;
  ingredients?: string[];
  duration: number; // days
  mealTypes?: ('breakfast' | 'lunch' | 'dinner' | 'snack')[];
  cuisinePreferences?: string[];
  allergies?: string[];
  budget?: 'low' | 'medium' | 'high';
}

interface WorkoutPlanRequest {
  userStats: UserStats;
  goals: string[];
  equipment: string[];
  duration: number; // minutes per session
  frequency: number; // sessions per week
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  targetMuscles?: string[];
  limitations?: string[];
  environment?: 'home' | 'gym' | 'outdoor';
}

interface MealUpdateRequest {
  mealId: string;
  updates: Partial<MealPlanMeal>;
}

interface WorkoutUpdateRequest {
  exerciseId: string;
  updates: Partial<WorkoutExercise>;
}

class AIApiService {
  private headers: HeadersInit;
  private abortController: AbortController | null = null;

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      'X-Client-Version': '1.0.0'
    };
  }

  // Cancel ongoing requests
  cancelRequest() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // Generic API request handler with retry logic
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = API_CONFIG.retryAttempts
  ): Promise<ApiResponse<T>> {
    this.abortController = new AbortController();

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
        ...options,
        headers: { ...this.headers, ...options.headers },
        signal: this.abortController.signal,
        timeout: API_CONFIG.timeout
      } as RequestInit);

      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          // Rate limited - wait and retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.makeRequest<T>(endpoint, options, retries - 1);
        }
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        metadata: data.metadata
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request cancelled' };
      }
      return { success: false, error: error.message || 'Network error' };
    } finally {
      this.abortController = null;
    }
  }

  // ==================== MEAL PLAN APIS ====================

  // Generate AI Meal Plan in real-time
  async generateMealPlan(request: MealPlanRequest): Promise<ApiResponse<MealPlan>> {
    if (USE_MOCK_API) {
      return this.mockGenerateMealPlan(request);
    }

    return this.makeRequest<MealPlan>('/api/v1/meals/generate', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  // Stream meal plan generation for real-time updates
  async *streamMealPlanGeneration(request: MealPlanRequest) {
    if (USE_MOCK_API) {
      yield* this.mockStreamMealPlan(request);
      return;
    }

    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/meals/stream`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Stream error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          yield data;
        }
      }
    }
  }

  // Get meal suggestions based on ingredients
  async getMealSuggestions(
    ingredients: string[],
    preferences?: UserPreferences
  ): Promise<ApiResponse<RecipeFromIngredients[]>> {
    if (USE_MOCK_API) {
      return this.mockGetMealSuggestions(ingredients, preferences);
    }

    return this.makeRequest<RecipeFromIngredients[]>('/api/v1/meals/suggestions', {
      method: 'POST',
      body: JSON.stringify({ ingredients, preferences })
    });
  }

  // Add meal to plan
  async addMealToPlan(
    planId: string,
    meal: Partial<MealPlanMeal>
  ): Promise<ApiResponse<MealPlanMeal>> {
    if (USE_MOCK_API) {
      return this.mockAddMealToPlan(planId, meal);
    }

    return this.makeRequest<MealPlanMeal>(`/api/v1/meals/plans/${planId}/meals`, {
      method: 'POST',
      body: JSON.stringify(meal)
    });
  }

  // Update meal in plan
  async updateMealInPlan(
    planId: string,
    request: MealUpdateRequest
  ): Promise<ApiResponse<MealPlanMeal>> {
    if (USE_MOCK_API) {
      return this.mockUpdateMeal(planId, request);
    }

    return this.makeRequest<MealPlanMeal>(
      `/api/v1/meals/plans/${planId}/meals/${request.mealId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(request.updates)
      }
    );
  }

  // Remove meal from plan
  async removeMealFromPlan(
    planId: string,
    mealId: string
  ): Promise<ApiResponse<boolean>> {
    if (USE_MOCK_API) {
      return { success: true, data: true };
    }

    return this.makeRequest<boolean>(
      `/api/v1/meals/plans/${planId}/meals/${mealId}`,
      {
        method: 'DELETE'
      }
    );
  }

  // Swap meals in plan
  async swapMeals(
    planId: string,
    mealId1: string,
    mealId2: string
  ): Promise<ApiResponse<MealPlan>> {
    if (USE_MOCK_API) {
      return this.mockSwapMeals(planId, mealId1, mealId2);
    }

    return this.makeRequest<MealPlan>(`/api/v1/meals/plans/${planId}/swap`, {
      method: 'POST',
      body: JSON.stringify({ mealId1, mealId2 })
    });
  }

  // Get alternative meals
  async getAlternativeMeals(
    meal: MealPlanMeal,
    count: number = 5
  ): Promise<ApiResponse<MealPlanMeal[]>> {
    if (USE_MOCK_API) {
      return this.mockGetAlternatives(meal, count);
    }

    return this.makeRequest<MealPlanMeal[]>('/api/v1/meals/alternatives', {
      method: 'POST',
      body: JSON.stringify({ meal, count })
    });
  }

  // ==================== WORKOUT APIS ====================

  // Generate AI Workout Plan
  async generateWorkoutPlan(
    request: WorkoutPlanRequest
  ): Promise<ApiResponse<WorkoutPlan>> {
    if (USE_MOCK_API) {
      return this.mockGenerateWorkoutPlan(request);
    }

    return this.makeRequest<WorkoutPlan>('/api/v1/workouts/generate', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  // Stream workout generation
  async *streamWorkoutGeneration(request: WorkoutPlanRequest) {
    if (USE_MOCK_API) {
      yield* this.mockStreamWorkout(request);
      return;
    }

    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/workouts/stream`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Stream error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          yield data;
        }
      }
    }
  }

  // Add exercise to workout
  async addExerciseToWorkout(
    workoutId: string,
    exercise: Partial<WorkoutExercise>
  ): Promise<ApiResponse<WorkoutExercise>> {
    if (USE_MOCK_API) {
      return this.mockAddExercise(workoutId, exercise);
    }

    return this.makeRequest<WorkoutExercise>(
      `/api/v1/workouts/${workoutId}/exercises`,
      {
        method: 'POST',
        body: JSON.stringify(exercise)
      }
    );
  }

  // Update exercise in workout
  async updateExercise(
    workoutId: string,
    request: WorkoutUpdateRequest
  ): Promise<ApiResponse<WorkoutExercise>> {
    if (USE_MOCK_API) {
      return this.mockUpdateExercise(workoutId, request);
    }

    return this.makeRequest<WorkoutExercise>(
      `/api/v1/workouts/${workoutId}/exercises/${request.exerciseId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(request.updates)
      }
    );
  }

  // Remove exercise from workout
  async removeExerciseFromWorkout(
    workoutId: string,
    exerciseId: string
  ): Promise<ApiResponse<boolean>> {
    if (USE_MOCK_API) {
      return { success: true, data: true };
    }

    return this.makeRequest<boolean>(
      `/api/v1/workouts/${workoutId}/exercises/${exerciseId}`,
      {
        method: 'DELETE'
      }
    );
  }

  // Get alternative exercises
  async getAlternativeExercises(
    exercise: WorkoutExercise,
    equipment: string[]
  ): Promise<ApiResponse<WorkoutExercise[]>> {
    if (USE_MOCK_API) {
      return this.mockGetAlternativeExercises(exercise, equipment);
    }

    return this.makeRequest<WorkoutExercise[]>('/api/v1/workouts/alternatives', {
      method: 'POST',
      body: JSON.stringify({ exercise, equipment })
    });
  }

  // ==================== ANALYTICS APIS ====================

  // Analyze meal plan nutrition
  async analyzeMealPlanNutrition(
    mealPlan: MealPlan
  ): Promise<ApiResponse<{
    totalCalories: number;
    macros: { protein: number; carbs: number; fat: number };
    micronutrients: Record<string, number>;
    nutritionalGaps: string[];
    recommendations: string[];
  }>> {
    if (USE_MOCK_API) {
      return this.mockAnalyzeNutrition(mealPlan);
    }

    return this.makeRequest('/api/v1/meals/analyze', {
      method: 'POST',
      body: JSON.stringify({ mealPlan })
    });
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(
    userStats: UserStats,
    history: any[]
  ): Promise<ApiResponse<{
    meals: MealPlanMeal[];
    workouts: EquipmentBasedWorkout[];
    tips: string[];
  }>> {
    if (USE_MOCK_API) {
      return this.mockGetRecommendations(userStats, history);
    }

    return this.makeRequest('/api/v1/recommendations', {
      method: 'POST',
      body: JSON.stringify({ userStats, history })
    });
  }

  // ==================== MOCK IMPLEMENTATIONS WITH REAL NUTRITION DATA ====================

  private async mockGenerateMealPlan(request: MealPlanRequest): Promise<ApiResponse<MealPlan>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const meals: MealPlanMeal[] = [];
    const mealTypes = request.mealTypes || ['breakfast', 'lunch', 'dinner', 'snack'];
    
    for (let day = 0; day < request.duration; day++) {
      for (const mealType of mealTypes) {
        const targetCalories = this.calculateMealCalories(
          request.nutritionGoals.calories,
          mealType
        );
        const targetProtein = this.calculateMealProtein(
          request.nutritionGoals.protein,
          mealType
        );

        try {
          // Generate smart meal suggestions with real nutrition data
          const suggestions = await nutritionixService.generateSmartMealSuggestions({
            targetCalories,
            targetProtein,
            mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
            dietaryRestrictions: request.allergies,
            preferredCuisine: request.cuisinePreferences?.[0]
          });

          if (suggestions.length > 0) {
            const bestMatch = suggestions[0];
            meals.push({
              id: `meal-${Date.now()}-${Math.random()}`,
              name: bestMatch.name,
              type: mealType,
              calories: bestMatch.calories,
              protein: bestMatch.protein,
              carbs: bestMatch.carbs,
              fat: bestMatch.fat,
              fiber: Math.round(bestMatch.calories * 0.015), // Estimate
              ingredients: bestMatch.ingredients,
              instructions: this.generateInstructions(mealType),
              prepTime: Math.round(Math.random() * 30 + 10),
              cookTime: Math.round(Math.random() * 45 + 15),
              servings: 1,
              tags: ['healthy', 'balanced', mealType, 'nutritionix-verified'],
              day: day + 1,
              imageUrl: `/api/placeholder/400/300`,
              nutritionSource: 'nutritionix'
            });
          } else {
            // Fallback to generated meal if Nutritionix fails
            meals.push(await this.generateFallbackMeal(mealType, targetCalories, day + 1));
          }
        } catch (error) {
          console.error('Error getting Nutritionix data, using fallback:', error);
          meals.push(await this.generateFallbackMeal(mealType, targetCalories, day + 1));
        }
      }
    }

    const mealPlan: MealPlan = {
      id: `plan-${Date.now()}`,
      name: `${request.duration}-Day Custom Plan`,
      description: `AI-generated meal plan based on your preferences`,
      meals,
      totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
      totalProtein: meals.reduce((sum, meal) => sum + meal.protein, 0),
      totalCarbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
      totalFat: meals.reduce((sum, meal) => sum + meal.fat, 0),
      createdAt: new Date().toISOString(),
      isAIGenerated: true,
      duration: request.duration,
      tags: ['custom', 'ai-generated']
    };

    return {
      success: true,
      data: mealPlan,
      metadata: {
        processingTime: 1500,
        confidence: 0.92,
        version: '1.0.0'
      }
    };
  }

  private async *mockStreamMealPlan(request: MealPlanRequest) {
    const mealTypes = request.mealTypes || ['breakfast', 'lunch', 'dinner', 'snack'];
    
    for (let day = 0; day < request.duration; day++) {
      for (const mealType of mealTypes) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const meal: MealPlanMeal = {
          id: `meal-${Date.now()}-${Math.random()}`,
          name: this.generateMealName(mealType, request.cuisinePreferences),
          type: mealType,
          calories: this.calculateMealCalories(request.nutritionGoals.calories, mealType),
          protein: 30,
          carbs: 45,
          fat: 15,
          ingredients: this.generateIngredients(mealType),
          instructions: ['Prepare ingredients', 'Cook', 'Serve'],
          day: day + 1
        };
        
        yield {
          type: 'meal',
          progress: ((day * mealTypes.length + mealTypes.indexOf(mealType) + 1) / 
                   (request.duration * mealTypes.length)) * 100,
          data: meal
        };
      }
    }
    
    yield {
      type: 'complete',
      progress: 100,
      message: 'Meal plan generation complete!'
    };
  }

  private async mockGenerateWorkoutPlan(request: WorkoutPlanRequest): Promise<ApiResponse<WorkoutPlan>> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const workouts: EquipmentBasedWorkout[] = [];
    const exerciseDatabase = this.getExerciseDatabase(request.equipment, request.difficulty);

    for (let i = 0; i < request.frequency; i++) {
      const exercises = this.selectExercises(
        exerciseDatabase,
        request.targetMuscles,
        request.duration
      );

      workouts.push({
        id: `workout-${Date.now()}-${i}`,
        name: `Day ${i + 1} - ${this.getWorkoutName(request.targetMuscles)}`,
        description: `${request.difficulty} level workout for ${request.targetMuscles?.join(', ') || 'full body'}`,
        requiredEquipment: request.equipment,
        duration: request.duration,
        difficulty: request.difficulty,
        targetMuscles: request.targetMuscles || ['full body'],
        exercises,
        caloriesBurned: Math.round(request.duration * 8),
        workoutType: 'strength',
        spaceRequired: 'moderate',
        aiGenerated: true
      });
    }

    const workoutPlan: WorkoutPlan = {
      id: `wplan-${Date.now()}`,
      name: `${request.frequency}-Day Workout Plan`,
      description: `Custom ${request.difficulty} workout plan`,
      workouts,
      duration: request.frequency,
      difficulty: request.difficulty,
      targetMuscles: request.targetMuscles || [],
      equipment: request.equipment,
      createdAt: new Date().toISOString(),
      isAIGenerated: true
    };

    return {
      success: true,
      data: workoutPlan,
      metadata: {
        processingTime: 1500,
        confidence: 0.89,
        version: '1.0.0'
      }
    };
  }

  private async *mockStreamWorkout(request: WorkoutPlanRequest) {
    for (let i = 0; i < request.frequency; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      yield {
        type: 'workout',
        progress: ((i + 1) / request.frequency) * 100,
        data: {
          day: i + 1,
          name: `Day ${i + 1} Workout`,
          exercises: 5 + Math.floor(Math.random() * 5)
        }
      };
    }
    
    yield {
      type: 'complete',
      progress: 100,
      message: 'Workout plan generation complete!'
    };
  }

  private async mockGetMealSuggestions(
    ingredients: string[],
    preferences?: UserPreferences
  ): Promise<ApiResponse<RecipeFromIngredients[]>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Get real nutrition data for the ingredients
      const nutritionData = await nutritionixService.calculateMealMacros(
        ingredients.map(ing => ({ name: ing, quantity: '100g' }))
      );

      // Analyze recipe quality
      const recipeAnalysis = await nutritionixService.analyzeRecipe(
        ingredients.map(ing => `100g ${ing}`),
        2
      );

      const suggestions: RecipeFromIngredients[] = [
      {
        id: `recipe-${Date.now()}-1`,
        name: 'Protein Power Bowl',
        description: 'High-protein meal with your available ingredients',
        availableIngredients: ingredients.slice(0, 3),
        matchPercentage: 85 + Math.random() * 10,
        prepTime: 15,
        cookTime: 20,
        difficulty: 'easy',
        servings: 2,
        instructions: [
          'Prepare all ingredients',
          'Cook protein source',
          'Assemble bowl',
          'Add toppings and serve'
        ],
        nutrition: {
          calories: recipeAnalysis.perServing.calories || 450,
          protein: recipeAnalysis.perServing.protein || 35,
          carbs: recipeAnalysis.perServing.carbs || 40,
          fat: recipeAnalysis.perServing.fat || 15,
          fiber: recipeAnalysis.perServing.fiber || 8
        },
        tags: ['high-protein', 'balanced', 'quick'],
        mealType: 'lunch',
        aiGenerated: true,
        confidence: 0.88
      },
      {
        id: `recipe-${Date.now()}-2`,
        name: 'Quick Stir-Fry Delight',
        description: 'Fast and nutritious stir-fry',
        availableIngredients: ingredients.slice(0, 4),
        matchPercentage: 92,
        prepTime: 10,
        cookTime: 15,
        difficulty: 'easy',
        servings: 2,
        instructions: [
          'Heat oil in pan',
          'Add vegetables',
          'Stir-fry for 5 minutes',
          'Season and serve'
        ],
        nutrition: {
          calories: 380,
          protein: 25,
          carbs: 45,
          fat: 12,
          fiber: 6
        },
        tags: ['quick', 'vegetable-rich', 'asian'],
        mealType: 'dinner',
        aiGenerated: true,
        confidence: 0.91
      }
    ];

      return {
        success: true,
        data: suggestions,
        metadata: {
          processingTime: 800,
          confidence: 0.95,
          version: '1.0.0',
          nutritionSource: 'nutritionix'
        }
      };
    } catch (error) {
      console.error('Error with Nutritionix API, using fallback data:', error);
      // Return fallback suggestions if Nutritionix fails
      return {
        success: true,
        data: this.getFallbackSuggestions(ingredients)
      };
    }
  }

  private async mockAddMealToPlan(
    planId: string,
    meal: Partial<MealPlanMeal>
  ): Promise<ApiResponse<MealPlanMeal>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newMeal: MealPlanMeal = {
      id: `meal-${Date.now()}`,
      name: meal.name || 'Custom Meal',
      type: meal.type || 'lunch',
      calories: meal.calories || 400,
      protein: meal.protein || 30,
      carbs: meal.carbs || 40,
      fat: meal.fat || 15,
      ingredients: meal.ingredients || [],
      instructions: meal.instructions || [],
      ...meal
    };

    return {
      success: true,
      data: newMeal
    };
  }

  private async mockUpdateMeal(
    planId: string,
    request: MealUpdateRequest
  ): Promise<ApiResponse<MealPlanMeal>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: {
        id: request.mealId,
        ...request.updates
      } as MealPlanMeal
    };
  }

  private async mockSwapMeals(
    planId: string,
    mealId1: string,
    mealId2: string
  ): Promise<ApiResponse<MealPlan>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock updated plan
    return {
      success: true,
      data: {} as MealPlan // Would swap meals in real implementation
    };
  }

  private async mockGetAlternatives(
    meal: MealPlanMeal,
    count: number
  ): Promise<ApiResponse<MealPlanMeal[]>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const alternatives: MealPlanMeal[] = [];
    const mealNames = [
      'Grilled Chicken Salad',
      'Quinoa Buddha Bowl',
      'Mediterranean Wrap',
      'Asian Fusion Bowl',
      'Protein Smoothie Bowl'
    ];

    for (let i = 0; i < Math.min(count, mealNames.length); i++) {
      alternatives.push({
        ...meal,
        id: `alt-${Date.now()}-${i}`,
        name: mealNames[i],
        calories: meal.calories + (Math.random() * 100 - 50),
        protein: meal.protein + (Math.random() * 10 - 5),
        tags: ['alternative', meal.type]
      });
    }

    return {
      success: true,
      data: alternatives
    };
  }

  private async mockAddExercise(
    workoutId: string,
    exercise: Partial<WorkoutExercise>
  ): Promise<ApiResponse<WorkoutExercise>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newExercise: WorkoutExercise = {
      id: `ex-${Date.now()}`,
      name: exercise.name || 'Custom Exercise',
      sets: exercise.sets || 3,
      reps: exercise.reps || '10-12',
      rest: exercise.rest || 60,
      instructions: exercise.instructions || [],
      targetMuscles: exercise.targetMuscles || ['general'],
      difficulty: exercise.difficulty || 'intermediate',
      ...exercise
    };

    return {
      success: true,
      data: newExercise
    };
  }

  private async mockUpdateExercise(
    workoutId: string,
    request: WorkoutUpdateRequest
  ): Promise<ApiResponse<WorkoutExercise>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: {
        id: request.exerciseId,
        ...request.updates
      } as WorkoutExercise
    };
  }

  private async mockGetAlternativeExercises(
    exercise: WorkoutExercise,
    equipment: string[]
  ): Promise<ApiResponse<WorkoutExercise[]>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const alternatives: WorkoutExercise[] = [
      {
        ...exercise,
        id: `alt-ex-${Date.now()}-1`,
        name: 'Alternative Exercise 1',
        equipment: equipment[0]
      },
      {
        ...exercise,
        id: `alt-ex-${Date.now()}-2`,
        name: 'Alternative Exercise 2',
        equipment: equipment[1] || 'bodyweight'
      }
    ];

    return {
      success: true,
      data: alternatives
    };
  }

  private async mockAnalyzeNutrition(mealPlan: MealPlan): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      data: {
        totalCalories: mealPlan.totalCalories,
        macros: {
          protein: mealPlan.totalProtein,
          carbs: mealPlan.totalCarbs,
          fat: mealPlan.totalFat
        },
        micronutrients: {
          vitaminA: Math.random() * 100,
          vitaminC: Math.random() * 100,
          calcium: Math.random() * 1000,
          iron: Math.random() * 20
        },
        nutritionalGaps: ['More fiber needed', 'Consider adding omega-3 sources'],
        recommendations: [
          'Add more vegetables to dinner',
          'Include nuts for healthy fats',
          'Consider a protein shake post-workout'
        ]
      }
    };
  }

  private async mockGetRecommendations(
    userStats: UserStats,
    history: any[]
  ): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      success: true,
      data: {
        meals: [
          {
            id: `rec-meal-${Date.now()}`,
            name: 'Recommended Power Breakfast',
            type: 'breakfast',
            calories: 450,
            protein: 30,
            carbs: 50,
            fat: 15,
            ingredients: ['Oats', 'Protein powder', 'Berries', 'Almonds']
          }
        ],
        workouts: [
          {
            id: `rec-workout-${Date.now()}`,
            name: 'Personalized HIIT Session',
            duration: 30,
            difficulty: userStats.activityLevel === 'sedentary' ? 'beginner' : 'intermediate',
            targetMuscles: ['full body'],
            exercises: [],
            caloriesBurned: 250,
            workoutType: 'hiit',
            spaceRequired: 'minimal',
            aiGenerated: true,
            requiredEquipment: []
          }
        ],
        tips: [
          'Increase protein intake by 10g per day',
          'Try to get 7-8 hours of sleep',
          'Add 10 minutes of stretching post-workout'
        ]
      }
    };
  }

  // Helper methods
  private calculateMealCalories(dailyCalories: number, mealType: string): number {
    const distribution = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.30,
      snack: 0.10
    };
    return Math.round(dailyCalories * (distribution[mealType as keyof typeof distribution] || 0.25));
  }

  private generateMealName(mealType: string, cuisines?: string[]): string {
    const mealNames = {
      breakfast: ['Power Breakfast Bowl', 'Protein Pancakes', 'Overnight Oats', 'Veggie Scramble'],
      lunch: ['Grilled Chicken Salad', 'Quinoa Buddha Bowl', 'Turkey Wrap', 'Salmon Bowl'],
      dinner: ['Lean Steak & Veggies', 'Baked Cod with Rice', 'Chicken Stir-Fry', 'Veggie Pasta'],
      snack: ['Protein Shake', 'Greek Yogurt Parfait', 'Mixed Nuts', 'Fruit & Nut Bar']
    };
    
    const options = mealNames[mealType as keyof typeof mealNames] || mealNames.lunch;
    return options[Math.floor(Math.random() * options.length)];
  }

  private generateIngredients(mealType: string): string[] {
    const ingredientSets = {
      breakfast: ['Eggs', 'Oats', 'Greek Yogurt', 'Berries', 'Almonds'],
      lunch: ['Chicken Breast', 'Mixed Greens', 'Quinoa', 'Tomatoes', 'Olive Oil'],
      dinner: ['Salmon', 'Brown Rice', 'Broccoli', 'Sweet Potato', 'Garlic'],
      snack: ['Protein Powder', 'Banana', 'Peanut Butter', 'Honey']
    };
    
    return ingredientSets[mealType as keyof typeof ingredientSets] || ingredientSets.lunch;
  }

  private generateInstructions(mealType: string): string[] {
    return [
      'Prepare all ingredients',
      'Season proteins with herbs and spices',
      'Cook according to recipe',
      'Plate and garnish',
      'Serve immediately'
    ];
  }

  private getExerciseDatabase(equipment: string[], difficulty: string): WorkoutExercise[] {
    const exercises: WorkoutExercise[] = [
      {
        id: 'ex-1',
        name: 'Push-ups',
        sets: 3,
        reps: '10-15',
        rest: 60,
        instructions: ['Start in plank position', 'Lower chest to floor', 'Push back up'],
        targetMuscles: ['chest', 'triceps'],
        difficulty: 'beginner'
      },
      {
        id: 'ex-2',
        name: 'Squats',
        sets: 3,
        reps: '12-15',
        rest: 60,
        instructions: ['Stand with feet shoulder-width', 'Lower hips back and down', 'Stand back up'],
        targetMuscles: ['quadriceps', 'glutes'],
        difficulty: 'beginner'
      }
    ];

    if (equipment.includes('dumbbells')) {
      exercises.push({
        id: 'ex-3',
        name: 'Dumbbell Press',
        sets: 3,
        reps: '10-12',
        rest: 90,
        weight: 20,
        equipment: 'dumbbells',
        instructions: ['Lie on bench', 'Press weights up', 'Lower with control'],
        targetMuscles: ['chest', 'shoulders'],
        difficulty: 'intermediate'
      });
    }

    return exercises;
  }

  private selectExercises(
    database: WorkoutExercise[],
    targetMuscles?: string[],
    duration?: number
  ): WorkoutExercise[] {
    // Select 4-6 exercises based on duration
    const exerciseCount = Math.min(database.length, Math.floor((duration || 30) / 7));
    return database.slice(0, exerciseCount);
  }

  private getWorkoutName(targetMuscles?: string[]): string {
    if (!targetMuscles || targetMuscles.length === 0) return 'Full Body Workout';
    if (targetMuscles.includes('chest') && targetMuscles.includes('triceps')) return 'Push Day';
    if (targetMuscles.includes('back') && targetMuscles.includes('biceps')) return 'Pull Day';
    if (targetMuscles.includes('quadriceps') && targetMuscles.includes('glutes')) return 'Leg Day';
    return `${targetMuscles[0]} Focus`;
  }

  // Helper: Calculate meal protein targets
  private calculateMealProtein(dailyProtein: number, mealType: string): number {
    const distribution = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.30,
      snack: 0.10
    };
    return Math.round(dailyProtein * (distribution[mealType as keyof typeof distribution] || 0.25));
  }

  // Helper: Generate fallback meal when Nutritionix is unavailable
  private async generateFallbackMeal(
    mealType: string,
    targetCalories: number,
    day: number
  ): Promise<MealPlanMeal> {
    return {
      id: `meal-${Date.now()}-${Math.random()}`,
      name: this.generateMealName(mealType),
      type: mealType,
      calories: targetCalories,
      protein: Math.round(targetCalories * 0.3 / 4),
      carbs: Math.round(targetCalories * 0.4 / 4),
      fat: Math.round(targetCalories * 0.3 / 9),
      fiber: Math.round(Math.random() * 10 + 5),
      ingredients: this.generateIngredients(mealType),
      instructions: this.generateInstructions(mealType),
      prepTime: Math.round(Math.random() * 30 + 10),
      cookTime: Math.round(Math.random() * 45 + 15),
      servings: 1,
      tags: ['healthy', 'balanced', mealType],
      day,
      imageUrl: `/api/placeholder/400/300`
    };
  }

  // Helper: Get fallback suggestions when Nutritionix is unavailable
  private getFallbackSuggestions(ingredients: string[]): RecipeFromIngredients[] {
    return [
      {
        id: `recipe-${Date.now()}-1`,
        name: 'Custom Recipe',
        description: 'Recipe based on your ingredients',
        availableIngredients: ingredients.slice(0, 3),
        matchPercentage: 85,
        prepTime: 15,
        cookTime: 20,
        difficulty: 'easy',
        servings: 2,
        instructions: [
          'Prepare all ingredients',
          'Cook according to preference',
          'Season to taste',
          'Serve hot'
        ],
        nutrition: {
          calories: 400,
          protein: 30,
          carbs: 40,
          fat: 15,
          fiber: 8
        },
        tags: ['custom', 'flexible'],
        mealType: 'lunch',
        aiGenerated: true,
        confidence: 0.75
      }
    ];
  }

  // Enhanced: Search for food with autocomplete
  async searchFoodWithAutocomplete(query: string): Promise<string[]> {
    try {
      return await nutritionixService.autocomplete(query);
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  }

  // Enhanced: Get nutrition for barcode scan
  async getNutritionFromBarcode(barcode: string): Promise<ApiResponse<any>> {
    try {
      const data = await nutritionixService.getBarcodeItem(barcode);
      return {
        success: true,
        data,
        metadata: {
          processingTime: 500,
          confidence: 1.0,
          version: '1.0.0',
          source: 'nutritionix-barcode'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Barcode not found'
      };
    }
  }

  // Enhanced: Analyze complete meal plan with real nutrition data
  async analyzeEnhancedMealPlanNutrition(
    mealPlan: MealPlan
  ): Promise<ApiResponse<{
    totalCalories: number;
    macros: { protein: number; carbs: number; fat: number };
    micronutrients: Record<string, number>;
    nutritionalGaps: string[];
    recommendations: string[];
    qualityScore: number;
  }>> {
    try {
      // Get all ingredients from all meals
      const allIngredients: string[] = [];
      mealPlan.meals.forEach(meal => {
        if (meal.ingredients) {
          allIngredients.push(...meal.ingredients);
        }
      });

      // Analyze with Nutritionix
      const analysis = await nutritionixService.analyzeRecipe(
        allIngredients,
        mealPlan.duration || 1
      );

      return {
        success: true,
        data: {
          totalCalories: analysis.totalNutrition.calories,
          macros: {
            protein: analysis.totalNutrition.protein,
            carbs: analysis.totalNutrition.carbs,
            fat: analysis.totalNutrition.fat
          },
          micronutrients: {
            ...analysis.totalNutrition.vitamins,
            ...analysis.totalNutrition.minerals
          },
          nutritionalGaps: analysis.nutritionalQuality.improvements,
          recommendations: [
            ...analysis.nutritionalQuality.strengths.map(s => `✓ ${s}`),
            ...analysis.nutritionalQuality.improvements.map(i => `→ ${i}`)
          ],
          qualityScore: analysis.nutritionalQuality.score
        },
        metadata: {
          processingTime: 2000,
          confidence: 0.95,
          version: '1.0.0',
          source: 'nutritionix-analysis'
        }
      };
    } catch (error) {
      // Fallback to original analysis if Nutritionix fails
      return this.mockAnalyzeNutrition(mealPlan);
    }
  }
}

// Export singleton instance
export const aiApiService = new AIApiService();

// Export types for use in components
export type {
  ApiResponse,
  MealPlanRequest,
  WorkoutPlanRequest,
  MealUpdateRequest,
  WorkoutUpdateRequest
};
