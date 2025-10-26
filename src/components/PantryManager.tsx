import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  Camera, 
  Mic, 
  Plus, 
  Package, 
  AlertTriangle, 
  ShoppingCart,
  Sparkles,
  Clock,
  TrendingDown
} from 'lucide-react';
import { PantryItem, Ingredient, RecipeFromIngredients } from '@/types/advanced-fitness';
import IngredientAIService from '@/lib/services/ingredientAI';

export const PantryManager: React.FC = () => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [aiRecipes, setAiRecipes] = useState<RecipeFromIngredients[]>([]);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const { toast } = useToast();

  // Load pantry items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pantry-items');
    if (saved) {
      setPantryItems(JSON.parse(saved));
    }
  }, []);

  // Save pantry items to localStorage
  useEffect(() => {
    localStorage.setItem('pantry-items', JSON.stringify(pantryItems));
  }, [pantryItems]);

  // Search ingredients
  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = IngredientAIService.searchIngredients(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Add ingredient to pantry
  const addToPantry = (ingredient: Ingredient) => {
    const pantryItem: PantryItem = {
      ...ingredient,
      id: `pantry-${Date.now()}`,
      location: 'pantry',
      addedDate: new Date()
    };
    setPantryItems([...pantryItems, pantryItem]);
    setSearchQuery('');
    setSearchResults([]);
    toast({
      title: "Added to Pantry",
      description: `${ingredient.name} has been added to your pantry.`
    });
  };

  // Simulate barcode scanning
  const handleBarcodeScan = () => {
    // Simulate scanning a product
    const mockBarcode = '1234567890';
    const product = IngredientAIService.getProductByBarcode(mockBarcode);
    
    if (product) {
      const ingredient: Ingredient = {
        id: `ing-${Date.now()}`,
        name: product.name,
        category: 'other',
        quantity: product.nutrition.servingSize,
        unit: product.nutrition.servingUnit as any,
        calories: product.nutrition.calories,
        protein: product.nutrition.protein,
        carbs: product.nutrition.carbs,
        fat: product.nutrition.fat,
        fiber: product.nutrition.fiber,
        addedDate: new Date(),
        barcode: product.barcode,
        brand: product.brand
      };
      addToPantry(ingredient);
      setShowBarcodeScanner(false);
    }
  };

  // Simulate voice input
  const handleVoiceInput = () => {
    // Simulate voice recognition
    const mockTranscript = "Add 2 cups of chicken breast";
    const result = IngredientAIService.processVoiceCommand(mockTranscript);
    
    if (result.ingredient) {
      toast({
        title: "Voice Command Recognized",
        description: `Adding ${result.quantity} ${result.unit} of ${result.ingredient}`
      });
      // Find and add the ingredient
      const ingredients = IngredientAIService.searchIngredients(result.ingredient);
      if (ingredients.length > 0) {
        addToPantry(ingredients[0]);
      }
    }
    setShowVoiceInput(false);
  };

  // Generate AI recipes from pantry
  const generateRecipes = () => {
    setIsGeneratingRecipes(true);
    const ingredientNames = pantryItems.map(item => item.name);
    const recipes = IngredientAIService.generateRecipesFromIngredients(ingredientNames);
    setAiRecipes(recipes);
    setIsGeneratingRecipes(false);
    
    if (recipes.length > 0) {
      toast({
        title: "Recipes Generated!",
        description: `Found ${recipes.length} recipes you can make with your ingredients.`
      });
    }
  };

  // Get expiring items
  const expiringItems = IngredientAIService.getExpiringIngredients(pantryItems, 3);
  const lowStockItems = IngredientAIService.getLowStockItems(pantryItems);

  // Filter pantry items by category
  const filteredItems = selectedCategory === 'all' 
    ? pantryItems 
    : pantryItems.filter(item => item.category === selectedCategory);

  // Generate shopping list
  const generateShoppingList = () => {
    const shoppingList = IngredientAIService.generateShoppingList(aiRecipes, pantryItems);
    toast({
      title: "Shopping List Generated",
      description: `Added ${shoppingList.length} items to your shopping list.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <Card className="card-premium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-display text-2xl">My Pantry</CardTitle>
              <CardDescription className="text-athletic">
                {pantryItems.length} ITEMS • {expiringItems.length} EXPIRING SOON
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={generateRecipes}
                className="btn-athletic btn-energy"
                disabled={isGeneratingRecipes}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGeneratingRecipes ? 'Generating...' : 'AI Recipes'}
              </Button>
              <Button 
                onClick={generateShoppingList}
                variant="outline"
                className="btn-athletic"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Shopping List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Input Methods */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Camera className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Barcode Scanner</DialogTitle>
                </DialogHeader>
                <div className="py-8 text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Position barcode within the frame
                  </p>
                  <Button onClick={handleBarcodeScan} className="btn-athletic">
                    Simulate Scan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showVoiceInput} onOpenChange={setShowVoiceInput}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Mic className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Voice Input</DialogTitle>
                </DialogHeader>
                <div className="py-8 text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-energy rounded-full flex items-center justify-center animate-pulse">
                    <Mic className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Say "Add [quantity] [ingredient]"
                  </p>
                  <Button onClick={handleVoiceInput} className="btn-athletic">
                    Simulate Voice Command
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">SEARCH RESULTS</p>
              <div className="space-y-2">
                {searchResults.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between p-2 bg-background rounded-lg">
                    <div>
                      <p className="font-semibold">{ingredient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ingredient.calories} cal • {ingredient.protein}g protein
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => addToPantry(ingredient)}
                      className="btn-athletic"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Section */}
          {(expiringItems.length > 0 || lowStockItems.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {expiringItems.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-sm">Expiring Soon</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {expiringItems.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <Badge variant="destructive" className="text-xs">
                            {item.expirationDate && 
                              Math.ceil((new Date(item.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                            } days
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {lowStockItems.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-yellow-600" />
                      <CardTitle className="text-sm">Low Stock</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lowStockItems.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <Badge variant="outline" className="text-xs">
                            Low
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="protein">Protein</TabsTrigger>
              <TabsTrigger value="vegetable">Veggies</TabsTrigger>
              <TabsTrigger value="fruit">Fruits</TabsTrigger>
              <TabsTrigger value="grain">Grains</TabsTrigger>
              <TabsTrigger value="dairy">Dairy</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="card-premium hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        {item.expirationDate && 
                          new Date(item.expirationDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000 && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.quantity} {item.unit}
                      </p>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.calories} cal
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.protein}g P
                        </Badge>
                      </div>
                      {item.location && (
                        <p className="text-xs text-muted-foreground mt-2">
                          📍 {item.location}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* AI Generated Recipes */}
          {aiRecipes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-athletic">
                AI GENERATED RECIPES ({aiRecipes.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiRecipes.map((recipe) => (
                  <Card key={recipe.id} className="card-premium">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{recipe.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {recipe.description}
                          </CardDescription>
                        </div>
                        <Badge className="bg-gradient-energy text-white">
                          {recipe.matchPercentage}% Match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                        <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                        <span>🍽️ {recipe.servings} servings</span>
                        <span>📊 {recipe.difficulty}</span>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline">{recipe.nutrition.calories} cal</Badge>
                        <Badge variant="outline">{recipe.nutrition.protein}g protein</Badge>
                        <Badge variant="outline">{recipe.nutrition.carbs}g carbs</Badge>
                      </div>
                      {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                        <p className="text-xs text-orange-600">
                          Missing: {recipe.missingIngredients.join(', ')}
                        </p>
                      )}
                      <Button className="w-full mt-3 btn-athletic" size="sm">
                        View Recipe
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
