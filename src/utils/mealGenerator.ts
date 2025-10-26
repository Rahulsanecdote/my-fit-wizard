import { MealPlan, MealPlanMeal, UserStats, NutritionGoals, UserPreferences } from '@/types/fitness';

// Mock meal database - in a real app, this would come from an AI service
const mealDatabase: Omit<MealPlanMeal, 'id'>[] = [
  // Breakfast options
  {
    name: "Greek Yogurt Power Bowl",
    type: "breakfast",
    calories: 320,
    protein: 25,
    carbs: 35,
    fat: 8,
    ingredients: ["Greek yogurt", "Mixed berries", "Granola", "Honey", "Chia seeds"],
    instructions: ["Mix yogurt with honey", "Top with berries and granola", "Sprinkle chia seeds"],
    prepTime: 5,
  },
  {
    name: "Protein Pancakes",
    type: "breakfast", 
    calories: 380,
    protein: 30,
    carbs: 40,
    fat: 12,
    ingredients: ["Protein powder", "Oats", "Banana", "Eggs", "Cinnamon"],
    instructions: ["Blend all ingredients", "Cook on medium heat", "Serve with berries"],
    prepTime: 15,
  },
  {
    name: "Avocado Toast",
    type: "breakfast",
    calories: 290,
    protein: 12,
    carbs: 25,
    fat: 18,
    ingredients: ["Whole grain bread", "Avocado", "Tomato", "Feta cheese", "Lime"],
    instructions: ["Toast bread", "Mash avocado with lime", "Top with tomato and feta"],
    prepTime: 8,
  },

  // Lunch options
  {
    name: "Grilled Chicken Salad",
    type: "lunch",
    calories: 420,
    protein: 35,
    carbs: 20,
    fat: 22,
    ingredients: ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil", "Lemon"],
    instructions: ["Grill chicken", "Prepare salad", "Dress with olive oil and lemon"],
    prepTime: 20,
  },
  {
    name: "Quinoa Buddha Bowl",
    type: "lunch",
    calories: 450,
    protein: 18,
    carbs: 65,
    fat: 15,
    ingredients: ["Quinoa", "Roasted vegetables", "Chickpeas", "Tahini", "Spinach"],
    instructions: ["Cook quinoa", "Roast vegetables", "Assemble bowl", "Drizzle with tahini"],
    prepTime: 25,
  },
  {
    name: "Turkey Wrap",
    type: "lunch",
    calories: 380,
    protein: 28,
    carbs: 35,
    fat: 16,
    ingredients: ["Whole wheat tortilla", "Turkey slices", "Hummus", "Vegetables", "Spinach"],
    instructions: ["Spread hummus on tortilla", "Add turkey and vegetables", "Roll tightly"],
    prepTime: 10,
  },

  // Dinner options
  {
    name: "Baked Salmon with Asparagus",
    type: "dinner",
    calories: 480,
    protein: 40,
    carbs: 15,
    fat: 28,
    ingredients: ["Salmon fillet", "Asparagus", "Lemon", "Garlic", "Olive oil", "Herbs"],
    instructions: ["Season salmon", "Bake with asparagus", "Serve with lemon"],
    prepTime: 25,
  },
  {
    name: "Lean Beef Stir Fry",
    type: "dinner",
    calories: 420,
    protein: 32,
    carbs: 30,
    fat: 20,
    ingredients: ["Lean beef", "Mixed vegetables", "Brown rice", "Soy sauce", "Ginger"],
    instructions: ["Stir fry beef", "Add vegetables", "Serve over rice"],
    prepTime: 18,
  },
  {
    name: "Lentil Curry",
    type: "dinner",
    calories: 390,
    protein: 20,
    carbs: 55,
    fat: 12,
    ingredients: ["Red lentils", "Coconut milk", "Curry spices", "Onion", "Spinach"],
    instructions: ["Sauté onion", "Add lentils and spices", "Simmer with coconut milk"],
    prepTime: 30,
  },

  // Snack options
  {
    name: "Apple with Almond Butter",
    type: "snack",
    calories: 190,
    protein: 6,
    carbs: 25,
    fat: 9,
    ingredients: ["Apple", "Almond butter"],
    instructions: ["Slice apple", "Serve with almond butter"],
    prepTime: 2,
  },
  {
    name: "Protein Smoothie",
    type: "snack",
    calories: 250,
    protein: 25,
    carbs: 20,
    fat: 8,
    ingredients: ["Protein powder", "Banana", "Spinach", "Almond milk", "Berries"],
    instructions: ["Blend all ingredients", "Serve immediately"],
    prepTime: 5,
  }
];

export const generateAIMealPlan = async (
  nutritionGoals: NutritionGoals,
  userStats: UserStats,
  preferences?: UserPreferences,
  days: number = 1
): Promise<MealPlan> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const mealPlan: MealPlan = {
    id: crypto.randomUUID(),
    name: `AI Generated Plan - ${new Date().toLocaleDateString()}`,
    description: `Personalized meal plan for ${userStats.goal} goal with ${nutritionGoals.calories} calories per day`,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    meals: [],
    createdAt: new Date(),
    isAIGenerated: true
  };

  // Filter meals based on dietary restrictions
  let availableMeals = [...mealDatabase];
  if (preferences?.dietaryRestrictions.includes('vegetarian')) {
    availableMeals = availableMeals.filter(meal => 
      !meal.ingredients.some(ingredient => 
        ['chicken', 'turkey', 'beef', 'salmon', 'fish'].some(meat => 
          ingredient.toLowerCase().includes(meat)
        )
      )
    );
  }

  // Target calories per meal type
  const calorieTargets = {
    breakfast: Math.round(nutritionGoals.calories * 0.25),
    lunch: Math.round(nutritionGoals.calories * 0.35),
    dinner: Math.round(nutritionGoals.calories * 0.30),
    snack: Math.round(nutritionGoals.calories * 0.10)
  };

  // Select meals for each type
  const mealTypes: ('breakfast' | 'lunch' | 'dinner' | 'snack')[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  for (const mealType of mealTypes) {
    const mealsOfType = availableMeals.filter(meal => meal.type === mealType);
    const targetCalories = calorieTargets[mealType];
    
    // Find meal closest to target calories
    const selectedMeal = mealsOfType.reduce((best, current) => {
      const bestDiff = Math.abs(best.calories - targetCalories);
      const currentDiff = Math.abs(current.calories - targetCalories);
      return currentDiff < bestDiff ? current : best;
    });

    const meal: MealPlanMeal = {
      ...selectedMeal,
      id: crypto.randomUUID()
    };

    mealPlan.meals.push(meal);
    mealPlan.totalCalories += meal.calories;
    mealPlan.totalProtein += meal.protein;
    mealPlan.totalCarbs += meal.carbs;
    mealPlan.totalFat += meal.fat;
  }

  return mealPlan;
};

export const generateMealSuggestions = async (
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  targetCalories: number,
  preferences?: UserPreferences
): Promise<MealPlanMeal[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let availableMeals = mealDatabase.filter(meal => meal.type === mealType);
  
  // Filter based on preferences
  if (preferences?.dietaryRestrictions.includes('vegetarian')) {
    availableMeals = availableMeals.filter(meal => 
      !meal.ingredients.some(ingredient => 
        ['chicken', 'turkey', 'beef', 'salmon', 'fish'].some(meat => 
          ingredient.toLowerCase().includes(meat)
        )
      )
    );
  }

  // Sort by how close to target calories
  availableMeals.sort((a, b) => 
    Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories)
  );

  return availableMeals.slice(0, 3).map(meal => ({
    ...meal,
    id: crypto.randomUUID()
  }));
};

export const searchMeals = (query: string): MealPlanMeal[] => {
  const searchTerm = query.toLowerCase();
  return mealDatabase
    .filter(meal => 
      meal.name.toLowerCase().includes(searchTerm) ||
      meal.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      )
    )
    .map(meal => ({
      ...meal,
      id: crypto.randomUUID()
    }));
};
