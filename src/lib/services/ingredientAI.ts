// AI-powered ingredient management and recipe generation service

import { 
  Ingredient, 
  PantryItem, 
  RecipeFromIngredients,
  BarcodeProduct 
} from '@/types/advanced-fitness';

// Mock ingredient database with comprehensive nutritional data
const INGREDIENT_DATABASE: Ingredient[] = [
  // Proteins
  { id: 'ing-1', name: 'Chicken Breast', category: 'protein', quantity: 100, unit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, addedDate: new Date(), tags: ['lean', 'high-protein'] },
  { id: 'ing-2', name: 'Salmon', category: 'protein', quantity: 100, unit: 'g', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, addedDate: new Date(), tags: ['omega-3', 'fatty-fish'] },
  { id: 'ing-3', name: 'Eggs', category: 'protein', quantity: 1, unit: 'piece', calories: 72, protein: 6, carbs: 0.6, fat: 5, fiber: 0, addedDate: new Date(), tags: ['versatile', 'breakfast'] },
  { id: 'ing-4', name: 'Greek Yogurt', category: 'dairy', quantity: 100, unit: 'g', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, addedDate: new Date(), tags: ['probiotic', 'high-protein'] },
  { id: 'ing-5', name: 'Tofu', category: 'protein', quantity: 100, unit: 'g', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, addedDate: new Date(), tags: ['vegan', 'plant-based'] },
  
  // Vegetables
  { id: 'ing-6', name: 'Broccoli', category: 'vegetable', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, addedDate: new Date(), tags: ['cruciferous', 'vitamin-c'] },
  { id: 'ing-7', name: 'Spinach', category: 'vegetable', quantity: 100, unit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, addedDate: new Date(), tags: ['leafy-green', 'iron-rich'] },
  { id: 'ing-8', name: 'Bell Peppers', category: 'vegetable', quantity: 100, unit: 'g', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, addedDate: new Date(), tags: ['vitamin-c', 'colorful'] },
  { id: 'ing-9', name: 'Tomatoes', category: 'vegetable', quantity: 100, unit: 'g', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, addedDate: new Date(), tags: ['lycopene', 'versatile'] },
  { id: 'ing-10', name: 'Carrots', category: 'vegetable', quantity: 100, unit: 'g', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, addedDate: new Date(), tags: ['beta-carotene', 'sweet'] },
  
  // Grains
  { id: 'ing-11', name: 'Brown Rice', category: 'grain', quantity: 100, unit: 'g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, addedDate: new Date(), tags: ['whole-grain', 'gluten-free'] },
  { id: 'ing-12', name: 'Quinoa', category: 'grain', quantity: 100, unit: 'g', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, addedDate: new Date(), tags: ['complete-protein', 'superfood'] },
  { id: 'ing-13', name: 'Oats', category: 'grain', quantity: 100, unit: 'g', calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, addedDate: new Date(), tags: ['breakfast', 'heart-healthy'] },
  { id: 'ing-14', name: 'Whole Wheat Pasta', category: 'grain', quantity: 100, unit: 'g', calories: 124, protein: 5, carbs: 27, fat: 0.5, fiber: 3, addedDate: new Date(), tags: ['whole-grain', 'pasta'] },
  
  // Fruits
  { id: 'ing-15', name: 'Banana', category: 'fruit', quantity: 1, unit: 'piece', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, addedDate: new Date(), tags: ['potassium', 'energy'] },
  { id: 'ing-16', name: 'Apple', category: 'fruit', quantity: 1, unit: 'piece', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, addedDate: new Date(), tags: ['fiber', 'antioxidant'] },
  { id: 'ing-17', name: 'Berries (Mixed)', category: 'fruit', quantity: 100, unit: 'g', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2, addedDate: new Date(), tags: ['antioxidant', 'low-calorie'] },
  
  // Healthy Fats
  { id: 'ing-18', name: 'Avocado', category: 'fruit', quantity: 100, unit: 'g', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, addedDate: new Date(), tags: ['healthy-fat', 'monounsaturated'] },
  { id: 'ing-19', name: 'Olive Oil', category: 'oil', quantity: 1, unit: 'tbsp', calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0, addedDate: new Date(), tags: ['mediterranean', 'cooking-oil'] },
  { id: 'ing-20', name: 'Almonds', category: 'nut', quantity: 30, unit: 'g', calories: 173, protein: 6, carbs: 6, fat: 15, fiber: 3.5, addedDate: new Date(), tags: ['snack', 'vitamin-e'] },
];

// Mock barcode database
const BARCODE_DATABASE: Record<string, BarcodeProduct> = {
  '1234567890': {
    barcode: '1234567890',
    name: 'Organic Chicken Breast',
    brand: 'FarmFresh',
    category: 'protein',
    nutrition: {
      servingSize: 100,
      servingUnit: 'g',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sodium: 74
    },
    verified: true
  },
  '0987654321': {
    barcode: '0987654321',
    name: 'Whole Grain Bread',
    brand: 'Healthy Choice',
    category: 'grain',
    nutrition: {
      servingSize: 1,
      servingUnit: 'slice',
      calories: 80,
      protein: 4,
      carbs: 15,
      fat: 1,
      fiber: 3,
      sugar: 2,
      sodium: 135
    },
    allergens: ['wheat', 'gluten'],
    verified: true
  }
};

export class IngredientAIService {
  // Search ingredients with autocomplete
  static searchIngredients(query: string): Ingredient[] {
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return INGREDIENT_DATABASE.filter(ing => 
      ing.name.toLowerCase().includes(lowerQuery) ||
      ing.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get ingredient by barcode
  static getProductByBarcode(barcode: string): BarcodeProduct | null {
    return BARCODE_DATABASE[barcode] || null;
  }

  // Simulate voice command processing
  static processVoiceCommand(transcript: string): {
    ingredient: string | null;
    quantity: number | null;
    unit: string | null;
  } {
    const lowerTranscript = transcript.toLowerCase();
    
    // Simple pattern matching for demonstration
    const quantityMatch = lowerTranscript.match(/(\d+)\s*(cups?|tbsp|tsp|grams?|g|oz|pounds?|lbs?|pieces?)/i);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : null;
    const unit = quantityMatch ? quantityMatch[2] : null;
    
    // Find ingredient name
    let ingredient = null;
    for (const ing of INGREDIENT_DATABASE) {
      if (lowerTranscript.includes(ing.name.toLowerCase())) {
        ingredient = ing.name;
        break;
      }
    }
    
    return { ingredient, quantity, unit };
  }

  // Generate recipes from available ingredients using AI logic
  static generateRecipesFromIngredients(
    availableIngredients: string[],
    dietaryPreferences: string[] = [],
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    maxPrepTime?: number
  ): RecipeFromIngredients[] {
    const recipes: RecipeFromIngredients[] = [];
    
    // AI-powered recipe generation logic
    const hasChicken = availableIngredients.some(i => i.toLowerCase().includes('chicken'));
    const hasRice = availableIngredients.some(i => i.toLowerCase().includes('rice'));
    const hasVegetables = availableIngredients.some(i => 
      ['broccoli', 'spinach', 'pepper', 'carrot', 'tomato'].some(v => i.toLowerCase().includes(v))
    );
    const hasEggs = availableIngredients.some(i => i.toLowerCase().includes('egg'));
    const hasPasta = availableIngredients.some(i => i.toLowerCase().includes('pasta'));
    
    // Generate Chicken Stir-Fry if ingredients match
    if (hasChicken && hasVegetables) {
      recipes.push({
        id: 'recipe-1',
        name: 'Protein-Packed Chicken Stir-Fry',
        description: 'A quick and healthy stir-fry loaded with lean protein and colorful vegetables',
        availableIngredients: availableIngredients.filter(i => 
          i.toLowerCase().includes('chicken') || 
          ['broccoli', 'pepper', 'carrot'].some(v => i.toLowerCase().includes(v))
        ),
        missingIngredients: hasRice ? [] : ['Rice or Noodles'],
        matchPercentage: hasRice ? 95 : 80,
        prepTime: 10,
        cookTime: 15,
        difficulty: 'easy',
        servings: 2,
        instructions: [
          'Cut chicken into bite-sized pieces and season with salt and pepper',
          'Heat oil in a large pan or wok over high heat',
          'Cook chicken until golden brown (5-6 minutes)',
          'Add vegetables and stir-fry for 3-4 minutes',
          'Add soy sauce, garlic, and ginger if available',
          'Serve over rice or enjoy on its own'
        ],
        nutrition: {
          calories: 320,
          protein: 35,
          carbs: hasRice ? 45 : 15,
          fat: 8,
          fiber: 5
        },
        tags: ['high-protein', 'low-carb', 'quick', 'healthy'],
        cuisine: 'Asian Fusion',
        mealType: 'dinner',
        aiGenerated: true,
        confidence: 0.92
      });
    }
    
    // Generate Veggie Scramble if has eggs
    if (hasEggs && hasVegetables) {
      recipes.push({
        id: 'recipe-2',
        name: 'Power Breakfast Scramble',
        description: 'Start your day with this protein and nutrient-rich scramble',
        availableIngredients: availableIngredients.filter(i => 
          i.toLowerCase().includes('egg') || 
          ['spinach', 'tomato', 'pepper'].some(v => i.toLowerCase().includes(v))
        ),
        matchPercentage: 88,
        prepTime: 5,
        cookTime: 10,
        difficulty: 'easy',
        servings: 1,
        instructions: [
          'Whisk eggs with a splash of milk if available',
          'Heat pan with a small amount of oil or butter',
          'Sauté vegetables for 2-3 minutes',
          'Pour in eggs and scramble until cooked through',
          'Season with salt, pepper, and herbs',
          'Serve hot with whole grain toast if available'
        ],
        nutrition: {
          calories: 250,
          protein: 18,
          carbs: 8,
          fat: 16,
          fiber: 3
        },
        tags: ['breakfast', 'high-protein', 'vegetarian', 'quick'],
        cuisine: 'American',
        mealType: 'breakfast',
        aiGenerated: true,
        confidence: 0.89
      });
    }
    
    // Generate Pasta Primavera if has pasta and vegetables
    if (hasPasta && hasVegetables) {
      recipes.push({
        id: 'recipe-3',
        name: 'Garden Fresh Pasta Primavera',
        description: 'A light and colorful pasta dish celebrating fresh vegetables',
        availableIngredients: availableIngredients.filter(i => 
          i.toLowerCase().includes('pasta') || 
          ['broccoli', 'tomato', 'pepper', 'spinach'].some(v => i.toLowerCase().includes(v))
        ),
        matchPercentage: 85,
        prepTime: 10,
        cookTime: 20,
        difficulty: 'medium',
        servings: 3,
        instructions: [
          'Cook pasta according to package directions',
          'In a large pan, sauté garlic in olive oil',
          'Add harder vegetables first (broccoli, carrots)',
          'After 3 minutes, add softer vegetables',
          'Toss cooked pasta with vegetables',
          'Add parmesan cheese if available',
          'Season with herbs, salt, and pepper'
        ],
        nutrition: {
          calories: 380,
          protein: 14,
          carbs: 65,
          fat: 8,
          fiber: 8
        },
        tags: ['vegetarian', 'italian', 'comfort-food', 'balanced'],
        cuisine: 'Italian',
        mealType: 'dinner',
        aiGenerated: true,
        confidence: 0.87
      });
    }
    
    // Generate Rice Bowl
    if (hasRice && (hasChicken || hasVegetables)) {
      recipes.push({
        id: 'recipe-4',
        name: 'Customizable Power Bowl',
        description: 'A nutritious bowl combining whole grains, protein, and vegetables',
        availableIngredients: availableIngredients.filter(i => 
          i.toLowerCase().includes('rice') || 
          i.toLowerCase().includes('chicken') ||
          ['broccoli', 'carrot', 'spinach'].some(v => i.toLowerCase().includes(v))
        ),
        matchPercentage: 90,
        prepTime: 15,
        cookTime: 25,
        difficulty: 'easy',
        servings: 2,
        instructions: [
          'Cook rice according to package instructions',
          'Season and cook protein if using',
          'Steam or sauté vegetables until tender-crisp',
          'Assemble bowl with rice as base',
          'Top with protein and vegetables',
          'Drizzle with sauce (soy, tahini, or yogurt-based)',
          'Garnish with seeds or nuts if available'
        ],
        nutrition: {
          calories: 420,
          protein: hasChicken ? 32 : 12,
          carbs: 55,
          fat: 10,
          fiber: 6
        },
        tags: ['bowl', 'customizable', 'meal-prep', 'balanced'],
        cuisine: 'Fusion',
        mealType: mealType || 'lunch',
        aiGenerated: true,
        confidence: 0.91
      });
    }
    
    // Filter by dietary preferences
    let filteredRecipes = recipes;
    if (dietaryPreferences.length > 0) {
      filteredRecipes = recipes.filter(recipe => {
        if (dietaryPreferences.includes('vegetarian') && 
            !recipe.tags.includes('vegetarian')) return false;
        if (dietaryPreferences.includes('vegan') && 
            recipe.availableIngredients.some(i => 
              ['chicken', 'egg', 'dairy'].some(v => i.toLowerCase().includes(v))
            )) return false;
        if (dietaryPreferences.includes('gluten-free') && 
            recipe.availableIngredients.some(i => 
              ['pasta', 'bread'].some(v => i.toLowerCase().includes(v))
            )) return false;
        return true;
      });
    }
    
    // Filter by meal type
    if (mealType) {
      filteredRecipes = filteredRecipes.filter(r => r.mealType === mealType);
    }
    
    // Filter by prep time
    if (maxPrepTime) {
      filteredRecipes = filteredRecipes.filter(r => 
        (r.prepTime + r.cookTime) <= maxPrepTime
      );
    }
    
    // Sort by match percentage
    return filteredRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  // Calculate recipe nutrition from ingredients
  static calculateRecipeNutrition(
    ingredients: { ingredient: Ingredient; amount: number }[]
  ): {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  } {
    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };
    
    ingredients.forEach(({ ingredient, amount }) => {
      const multiplier = amount / ingredient.quantity;
      totalNutrition.calories += ingredient.calories * multiplier;
      totalNutrition.protein += ingredient.protein * multiplier;
      totalNutrition.carbs += ingredient.carbs * multiplier;
      totalNutrition.fat += ingredient.fat * multiplier;
      totalNutrition.fiber += (ingredient.fiber || 0) * multiplier;
    });
    
    // Round to reasonable precision
    return {
      calories: Math.round(totalNutrition.calories),
      protein: Math.round(totalNutrition.protein * 10) / 10,
      carbs: Math.round(totalNutrition.carbs * 10) / 10,
      fat: Math.round(totalNutrition.fat * 10) / 10,
      fiber: Math.round(totalNutrition.fiber * 10) / 10
    };
  }

  // Generate shopping list from recipes
  static generateShoppingList(
    recipes: RecipeFromIngredients[],
    pantryItems: PantryItem[]
  ): string[] {
    const shoppingList: string[] = [];
    const pantryNames = pantryItems.map(item => item.name.toLowerCase());
    
    recipes.forEach(recipe => {
      recipe.missingIngredients?.forEach(ingredient => {
        if (!pantryNames.includes(ingredient.toLowerCase()) && 
            !shoppingList.includes(ingredient)) {
          shoppingList.push(ingredient);
        }
      });
    });
    
    return shoppingList;
  }

  // Check for expiring ingredients
  static getExpiringIngredients(pantryItems: PantryItem[], daysAhead: number = 3): PantryItem[] {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    return pantryItems.filter(item => {
      if (!item.expirationDate) return false;
      return new Date(item.expirationDate) <= futureDate;
    });
  }

  // Get low stock items
  static getLowStockItems(pantryItems: PantryItem[]): PantryItem[] {
    return pantryItems.filter(item => item.isLowStock === true);
  }

  // Smart meal suggestions based on expiring ingredients
  static suggestMealsForExpiringIngredients(
    expiringItems: PantryItem[],
    allPantryItems: PantryItem[]
  ): RecipeFromIngredients[] {
    const expiringNames = expiringItems.map(item => item.name);
    const allNames = allPantryItems.map(item => item.name);
    
    // Prioritize recipes that use expiring ingredients
    const recipes = this.generateRecipesFromIngredients(allNames);
    
    // Score recipes based on how many expiring ingredients they use
    return recipes.map(recipe => {
      const usesExpiringCount = recipe.availableIngredients.filter(ing => 
        expiringNames.some(exp => ing.toLowerCase().includes(exp.toLowerCase()))
      ).length;
      
      // Boost confidence score for recipes using expiring ingredients
      return {
        ...recipe,
        confidence: Math.min(1, recipe.confidence + (usesExpiringCount * 0.05)),
        tags: [...recipe.tags, 'uses-expiring-ingredients']
      };
    }).sort((a, b) => b.confidence - a.confidence);
  }
}

export default IngredientAIService;
