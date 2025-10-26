// Nutritionix API Integration Service
// Provides real-time nutrition data for accurate meal planning

interface NutritionixConfig {
  appId: string;
  appKey: string;
  baseUrl: string;
}

const NUTRITIONIX_CONFIG: NutritionixConfig = {
  appId: '7b0e6496', // You may need to get this from Nutritionix
  appKey: '5dbf764be795152681e4040d751e283b',
  baseUrl: 'https://trackapi.nutritionix.com/v2'
};

// Nutritionix API Types
export interface NutritionixFood {
  food_name: string;
  brand_name?: string;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
  nf_calories: number;
  nf_total_fat: number;
  nf_saturated_fat: number;
  nf_cholesterol: number;
  nf_sodium: number;
  nf_total_carbohydrate: number;
  nf_dietary_fiber: number;
  nf_sugars: number;
  nf_protein: number;
  nf_potassium: number;
  nf_p?: number;
  full_nutrients: Array<{
    attr_id: number;
    value: number;
  }>;
  nix_brand_name?: string;
  nix_brand_id?: string;
  nix_item_name?: string;
  nix_item_id?: string;
  upc?: string;
  consumed_at?: string;
  metadata?: any;
  source?: number;
  ndb_no?: number;
  tags?: any;
  alt_measures?: Array<{
    serving_weight: number;
    measure: string;
    seq?: number;
    qty: number;
  }>;
  lat?: number;
  lng?: number;
  meal_type?: number;
  photo: {
    thumb: string;
    highres?: string;
    is_user_uploaded?: boolean;
  };
  sub_recipe?: any;
  class_code?: string;
  brick_code?: string;
  tag_id?: string;
}

export interface NutritionixSearchResult {
  common: Array<{
    food_name: string;
    serving_unit: string;
    tag_name: string;
    serving_qty: number;
    common_type: number;
    tag_id: string;
    photo: {
      thumb: string;
    };
    locale: string;
  }>;
  branded: Array<{
    food_name: string;
    serving_unit: string;
    nix_brand_id: string;
    brand_name_item_name: string;
    serving_qty: number;
    nf_calories: number;
    photo: {
      thumb: string;
    };
    brand_name: string;
    region: number;
    brand_type: number;
    nix_item_id: string;
    locale: string;
  }>;
}

export interface NutritionixNutrients {
  foods: NutritionixFood[];
}

export interface NutritionixExercise {
  name: string;
  duration_min: number;
  nf_calories: number;
  photo: {
    highres: string;
    thumb: string;
    is_user_uploaded: boolean;
  };
  compendium_code: number;
  met: number;
  user_input: string;
}

export interface RecipeAnalysis {
  ingredientLines: string[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    cholesterol: number;
    saturatedFat: number;
    vitamins: Record<string, number>;
    minerals: Record<string, number>;
  };
  servings: number;
  perServing: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  nutritionalQuality: {
    score: number;
    strengths: string[];
    improvements: string[];
  };
}

class NutritionixService {
  private headers: HeadersInit;

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'x-app-id': NUTRITIONIX_CONFIG.appId,
      'x-app-key': NUTRITIONIX_CONFIG.appKey,
      'x-remote-user-id': '0' // Can be user-specific in production
    };
  }

  // Search for foods (instant search)
  async searchFoods(query: string): Promise<NutritionixSearchResult> {
    try {
      const response = await fetch(
        `${NUTRITIONIX_CONFIG.baseUrl}/search/instant?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Nutritionix API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  }

  // Get detailed nutrients for natural language food query
  async getNutrients(query: string): Promise<NutritionixNutrients> {
    try {
      const response = await fetch(
        `${NUTRITIONIX_CONFIG.baseUrl}/natural/nutrients`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            query,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Nutritionix API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting nutrients:', error);
      throw error;
    }
  }

  // Get nutrients for multiple foods at once
  async getBulkNutrients(foods: string[]): Promise<NutritionixNutrients> {
    const query = foods.join(', ');
    return this.getNutrients(query);
  }

  // Search for exercises and get calories burned
  async getExercise(query: string, weight_kg: number = 70): Promise<{ exercises: NutritionixExercise[] }> {
    try {
      const response = await fetch(
        `${NUTRITIONIX_CONFIG.baseUrl}/natural/exercise`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            query,
            weight_kg,
            gender: 'male', // Can be dynamic
            age: 30 // Can be dynamic
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Nutritionix API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting exercise:', error);
      throw error;
    }
  }

  // Analyze a complete recipe
  async analyzeRecipe(
    ingredientLines: string[],
    servings: number = 1
  ): Promise<RecipeAnalysis> {
    try {
      // Join all ingredients into a single query
      const query = ingredientLines.join('\n');
      const nutrientData = await this.getNutrients(query);

      // Calculate totals
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      let totalFiber = 0;
      let totalSugar = 0;
      let totalSodium = 0;
      let totalCholesterol = 0;
      let totalSaturatedFat = 0;

      const vitamins: Record<string, number> = {};
      const minerals: Record<string, number> = {};

      nutrientData.foods.forEach(food => {
        totalCalories += food.nf_calories || 0;
        totalProtein += food.nf_protein || 0;
        totalCarbs += food.nf_total_carbohydrate || 0;
        totalFat += food.nf_total_fat || 0;
        totalFiber += food.nf_dietary_fiber || 0;
        totalSugar += food.nf_sugars || 0;
        totalSodium += food.nf_sodium || 0;
        totalCholesterol += food.nf_cholesterol || 0;
        totalSaturatedFat += food.nf_saturated_fat || 0;

        // Extract vitamins and minerals from full_nutrients
        if (food.full_nutrients) {
          food.full_nutrients.forEach(nutrient => {
            const nutrientInfo = this.getNutrientInfo(nutrient.attr_id);
            if (nutrientInfo) {
              if (nutrientInfo.type === 'vitamin') {
                vitamins[nutrientInfo.name] = (vitamins[nutrientInfo.name] || 0) + nutrient.value;
              } else if (nutrientInfo.type === 'mineral') {
                minerals[nutrientInfo.name] = (minerals[nutrientInfo.name] || 0) + nutrient.value;
              }
            }
          });
        }
      });

      // Calculate nutritional quality score
      const qualityAnalysis = this.calculateNutritionalQuality({
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        fiber: totalFiber,
        sugar: totalSugar,
        sodium: totalSodium,
        saturatedFat: totalSaturatedFat
      });

      return {
        ingredientLines,
        totalNutrition: {
          calories: Math.round(totalCalories),
          protein: Math.round(totalProtein),
          carbs: Math.round(totalCarbs),
          fat: Math.round(totalFat),
          fiber: Math.round(totalFiber),
          sugar: Math.round(totalSugar),
          sodium: Math.round(totalSodium),
          cholesterol: Math.round(totalCholesterol),
          saturatedFat: Math.round(totalSaturatedFat),
          vitamins,
          minerals
        },
        servings,
        perServing: {
          calories: Math.round(totalCalories / servings),
          protein: Math.round(totalProtein / servings),
          carbs: Math.round(totalCarbs / servings),
          fat: Math.round(totalFat / servings),
          fiber: Math.round(totalFiber / servings)
        },
        nutritionalQuality: qualityAnalysis
      };
    } catch (error) {
      console.error('Error analyzing recipe:', error);
      throw error;
    }
  }

  // Get barcode item details
  async getBarcodeItem(upc: string): Promise<any> {
    try {
      const response = await fetch(
        `${NUTRITIONIX_CONFIG.baseUrl}/search/item?upc=${upc}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Nutritionix API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting barcode item:', error);
      throw error;
    }
  }

  // Autocomplete for food search
  async autocomplete(query: string): Promise<string[]> {
    try {
      const searchResults = await this.searchFoods(query);
      const suggestions: string[] = [];

      // Add common foods
      searchResults.common.slice(0, 5).forEach(item => {
        suggestions.push(item.food_name);
      });

      // Add branded foods
      searchResults.branded.slice(0, 5).forEach(item => {
        suggestions.push(`${item.brand_name} ${item.food_name}`);
      });

      return suggestions;
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error);
      return [];
    }
  }

  // Calculate meal macros for a list of ingredients with quantities
  async calculateMealMacros(ingredients: Array<{ name: string; quantity: string }>): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
    perIngredient: Array<{
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>;
  }> {
    try {
      // Build query string with quantities
      const query = ingredients.map(ing => `${ing.quantity} ${ing.name}`).join(', ');
      const nutrientData = await this.getNutrients(query);

      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      let totalFiber = 0;

      const perIngredient = nutrientData.foods.map(food => {
        totalCalories += food.nf_calories || 0;
        totalProtein += food.nf_protein || 0;
        totalCarbs += food.nf_total_carbohydrate || 0;
        totalFat += food.nf_total_fat || 0;
        totalFiber += food.nf_dietary_fiber || 0;

        return {
          name: food.food_name,
          calories: Math.round(food.nf_calories || 0),
          protein: Math.round(food.nf_protein || 0),
          carbs: Math.round(food.nf_total_carbohydrate || 0),
          fat: Math.round(food.nf_total_fat || 0)
        };
      });

      return {
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein),
        totalCarbs: Math.round(totalCarbs),
        totalFat: Math.round(totalFat),
        totalFiber: Math.round(totalFiber),
        perIngredient
      };
    } catch (error) {
      console.error('Error calculating meal macros:', error);
      throw error;
    }
  }

  // Smart meal suggestions based on nutritional goals
  async generateSmartMealSuggestions(params: {
    targetCalories: number;
    targetProtein: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    dietaryRestrictions?: string[];
    preferredCuisine?: string;
  }): Promise<Array<{
    name: string;
    ingredients: string[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    matchScore: number;
  }>> {
    // This would integrate with a meal database or AI to generate suggestions
    // For now, we'll create smart suggestions based on meal type and targets
    const mealTemplates = this.getMealTemplates(params.mealType);
    const suggestions = [];

    for (const template of mealTemplates) {
      try {
        const macros = await this.calculateMealMacros(
          template.ingredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity
          }))
        );

        // Calculate match score based on how close to targets
        const calorieMatch = 1 - Math.abs(macros.totalCalories - params.targetCalories) / params.targetCalories;
        const proteinMatch = 1 - Math.abs(macros.totalProtein - params.targetProtein) / params.targetProtein;
        const matchScore = (calorieMatch * 0.6 + proteinMatch * 0.4) * 100;

        suggestions.push({
          name: template.name,
          ingredients: template.ingredients.map(i => `${i.quantity} ${i.name}`),
          calories: macros.totalCalories,
          protein: macros.totalProtein,
          carbs: macros.totalCarbs,
          fat: macros.totalFat,
          matchScore: Math.round(matchScore)
        });
      } catch (error) {
        console.error(`Error processing template ${template.name}:`, error);
      }
    }

    // Sort by match score
    return suggestions.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  }

  // Helper: Get nutrient info by ID
  private getNutrientInfo(attrId: number): { name: string; type: 'vitamin' | 'mineral' } | null {
    const nutrientMap: Record<number, { name: string; type: 'vitamin' | 'mineral' }> = {
      // Vitamins
      318: { name: 'Vitamin A', type: 'vitamin' },
      401: { name: 'Vitamin C', type: 'vitamin' },
      324: { name: 'Vitamin D', type: 'vitamin' },
      323: { name: 'Vitamin E', type: 'vitamin' },
      430: { name: 'Vitamin K', type: 'vitamin' },
      404: { name: 'Thiamin (B1)', type: 'vitamin' },
      405: { name: 'Riboflavin (B2)', type: 'vitamin' },
      406: { name: 'Niacin (B3)', type: 'vitamin' },
      415: { name: 'Vitamin B6', type: 'vitamin' },
      417: { name: 'Folate', type: 'vitamin' },
      418: { name: 'Vitamin B12', type: 'vitamin' },
      // Minerals
      301: { name: 'Calcium', type: 'mineral' },
      303: { name: 'Iron', type: 'mineral' },
      304: { name: 'Magnesium', type: 'mineral' },
      305: { name: 'Phosphorus', type: 'mineral' },
      306: { name: 'Potassium', type: 'mineral' },
      307: { name: 'Sodium', type: 'mineral' },
      309: { name: 'Zinc', type: 'mineral' }
    };

    return nutrientMap[attrId] || null;
  }

  // Helper: Calculate nutritional quality score
  private calculateNutritionalQuality(nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    saturatedFat: number;
  }): {
    score: number;
    strengths: string[];
    improvements: string[];
  } {
    let score = 100;
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Protein ratio (aim for 20-35% of calories)
    const proteinCalories = nutrition.protein * 4;
    const proteinRatio = proteinCalories / nutrition.calories;
    if (proteinRatio >= 0.2 && proteinRatio <= 0.35) {
      strengths.push('Good protein content');
    } else if (proteinRatio < 0.15) {
      improvements.push('Consider adding more protein');
      score -= 10;
    }

    // Fiber content (aim for at least 25g/day, so ~8g per meal)
    if (nutrition.fiber >= 8) {
      strengths.push('High in fiber');
      score += 5;
    } else if (nutrition.fiber < 3) {
      improvements.push('Add more fiber-rich foods');
      score -= 10;
    }

    // Sugar content (limit to <10% of calories)
    const sugarCalories = nutrition.sugar * 4;
    const sugarRatio = sugarCalories / nutrition.calories;
    if (sugarRatio > 0.15) {
      improvements.push('High sugar content');
      score -= 15;
    } else if (sugarRatio < 0.1) {
      strengths.push('Low sugar content');
    }

    // Sodium (aim for <600mg per meal)
    if (nutrition.sodium > 800) {
      improvements.push('High sodium content');
      score -= 10;
    } else if (nutrition.sodium < 400) {
      strengths.push('Low sodium');
    }

    // Saturated fat (limit to <10% of calories)
    const satFatCalories = nutrition.saturatedFat * 9;
    const satFatRatio = satFatCalories / nutrition.calories;
    if (satFatRatio > 0.1) {
      improvements.push('Reduce saturated fat');
      score -= 10;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      strengths,
      improvements
    };
  }

  // Helper: Get meal templates
  private getMealTemplates(mealType: string): Array<{
    name: string;
    ingredients: Array<{ name: string; quantity: string }>;
  }> {
    const templates = {
      breakfast: [
        {
          name: 'Protein Power Bowl',
          ingredients: [
            { name: 'oatmeal', quantity: '1 cup' },
            { name: 'protein powder', quantity: '1 scoop' },
            { name: 'blueberries', quantity: '1/2 cup' },
            { name: 'almond butter', quantity: '1 tbsp' },
            { name: 'chia seeds', quantity: '1 tbsp' }
          ]
        },
        {
          name: 'Veggie Scramble',
          ingredients: [
            { name: 'eggs', quantity: '3 large' },
            { name: 'spinach', quantity: '1 cup' },
            { name: 'mushrooms', quantity: '1/2 cup' },
            { name: 'whole wheat toast', quantity: '2 slices' },
            { name: 'avocado', quantity: '1/2' }
          ]
        },
        {
          name: 'Greek Yogurt Parfait',
          ingredients: [
            { name: 'greek yogurt', quantity: '1 cup' },
            { name: 'granola', quantity: '1/4 cup' },
            { name: 'strawberries', quantity: '1/2 cup' },
            { name: 'honey', quantity: '1 tbsp' },
            { name: 'walnuts', quantity: '2 tbsp' }
          ]
        }
      ],
      lunch: [
        {
          name: 'Grilled Chicken Salad',
          ingredients: [
            { name: 'grilled chicken breast', quantity: '6 oz' },
            { name: 'mixed greens', quantity: '2 cups' },
            { name: 'cherry tomatoes', quantity: '1 cup' },
            { name: 'cucumber', quantity: '1/2 cup' },
            { name: 'olive oil', quantity: '2 tbsp' },
            { name: 'quinoa', quantity: '1/2 cup cooked' }
          ]
        },
        {
          name: 'Turkey Avocado Wrap',
          ingredients: [
            { name: 'turkey breast', quantity: '4 oz' },
            { name: 'whole wheat tortilla', quantity: '1 large' },
            { name: 'avocado', quantity: '1/2' },
            { name: 'lettuce', quantity: '1 cup' },
            { name: 'tomato', quantity: '2 slices' },
            { name: 'hummus', quantity: '2 tbsp' }
          ]
        },
        {
          name: 'Salmon Bowl',
          ingredients: [
            { name: 'baked salmon', quantity: '5 oz' },
            { name: 'brown rice', quantity: '1 cup cooked' },
            { name: 'broccoli', quantity: '1 cup' },
            { name: 'edamame', quantity: '1/2 cup' },
            { name: 'sesame oil', quantity: '1 tbsp' }
          ]
        }
      ],
      dinner: [
        {
          name: 'Lean Steak with Vegetables',
          ingredients: [
            { name: 'sirloin steak', quantity: '6 oz' },
            { name: 'sweet potato', quantity: '1 medium' },
            { name: 'asparagus', quantity: '1 cup' },
            { name: 'olive oil', quantity: '1 tbsp' },
            { name: 'garlic', quantity: '2 cloves' }
          ]
        },
        {
          name: 'Baked Cod with Quinoa',
          ingredients: [
            { name: 'cod fillet', quantity: '6 oz' },
            { name: 'quinoa', quantity: '1 cup cooked' },
            { name: 'zucchini', quantity: '1 cup' },
            { name: 'bell peppers', quantity: '1 cup' },
            { name: 'lemon', quantity: '1' },
            { name: 'olive oil', quantity: '2 tbsp' }
          ]
        },
        {
          name: 'Chicken Stir-Fry',
          ingredients: [
            { name: 'chicken breast', quantity: '5 oz' },
            { name: 'brown rice', quantity: '1 cup cooked' },
            { name: 'mixed vegetables', quantity: '2 cups' },
            { name: 'soy sauce', quantity: '2 tbsp' },
            { name: 'sesame oil', quantity: '1 tbsp' }
          ]
        }
      ],
      snack: [
        {
          name: 'Protein Shake',
          ingredients: [
            { name: 'protein powder', quantity: '1 scoop' },
            { name: 'banana', quantity: '1 medium' },
            { name: 'almond milk', quantity: '1 cup' },
            { name: 'peanut butter', quantity: '1 tbsp' }
          ]
        },
        {
          name: 'Greek Yogurt with Nuts',
          ingredients: [
            { name: 'greek yogurt', quantity: '3/4 cup' },
            { name: 'mixed nuts', quantity: '1/4 cup' },
            { name: 'honey', quantity: '1 tsp' }
          ]
        },
        {
          name: 'Apple with Almond Butter',
          ingredients: [
            { name: 'apple', quantity: '1 medium' },
            { name: 'almond butter', quantity: '2 tbsp' },
            { name: 'cinnamon', quantity: '1/4 tsp' }
          ]
        }
      ]
    };

    return templates[mealType as keyof typeof templates] || templates.lunch;
  }
}

// Export singleton instance
export const nutritionixService = new NutritionixService();

// Export types
export type {
  NutritionixFood,
  NutritionixSearchResult,
  NutritionixNutrients,
  NutritionixExercise,
  RecipeAnalysis
};
