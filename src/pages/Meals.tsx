import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitness } from '@/contexts/FitnessContext';
import { Header } from '@/components/layout/Header';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Sparkles, Search, Clock, TrendingUp, Utensils, Zap, Target, Package, Star, ChefHat, Loader2 } from 'lucide-react';
import { generateAIMealPlan, generateMealSuggestions, searchMeals } from '@/utils/mealGenerator';
import { MealPlan, MealPlanMeal } from '@/types/fitness';
import { useToast } from '@/components/ui/use-toast';
import { PantryManager } from '@/components/PantryManager';
import { AddFoodDialog } from '@/components/AddFoodDialog';

export const Meals = () => {
  const navigate = useNavigate();
  const { userStats, nutritionGoals, userPreferences, addMealPlan, setActiveMealPlan, activeMealPlan, mealPlans } = useFitness();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MealPlanMeal[]>([]);
  const [mealSuggestions, setMealSuggestions] = useState<MealPlanMeal[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generationOptions, setGenerationOptions] = useState({
    days: 1,
    mealType: 'all'
  });

  // Redirect to setup if no user stats
  if (!userStats) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-4">
        <Header title="Meal Plans" subtitle="Set up your profile first" />
        <main className="px-4 py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Please set up your profile to get personalized meal recommendations.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <MobileNavigation />
      </div>
    );
  }

  const handleGenerateAIPlan = async () => {
    setIsGenerating(true);
    try {
      const mealPlan = await generateAIMealPlan(nutritionGoals, userStats, userPreferences);
      addMealPlan(mealPlan);
      setActiveMealPlan(mealPlan);
      setGenerateDialogOpen(false);
      toast({
        title: "AI Meal Plan Generated!",
        description: `Created a personalized meal plan with ${mealPlan.totalCalories} calories.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetSuggestions = async (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setLoadingSuggestions(true);
    try {
      const targetCalories = Math.round(nutritionGoals.calories * (mealType === 'lunch' ? 0.35 : mealType === 'dinner' ? 0.30 : mealType === 'breakfast' ? 0.25 : 0.10));
      const suggestions = await generateMealSuggestions(mealType, targetCalories, userPreferences);
      setMealSuggestions(suggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get meal suggestions.",
        variant: "destructive"
      });
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = searchMeals(searchTerm);
      setSearchResults(results);
    }
  };

  const handleAddMealFromPlan = (meal: MealPlanMeal) => {
    // This would add the meal to today's food entries
    toast({
      title: "Meal Added!",
      description: `${meal.name} has been added to your daily log.`
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      <Header 
        title="Meal Plans" 
        subtitle="AI-powered nutrition planning"
      />
      
      <main className="px-4 py-6 space-y-6">
      <Tabs defaultValue="pantry" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pantry">Pantry</TabsTrigger>
          <TabsTrigger value="plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="generate">AI Generator</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="pantry" className="mt-6">
          <PantryManager />
        </TabsContent>

        <TabsContent value="plans" className="mt-6 space-y-4">
            {/* Active Plan */}
            {activeMealPlan && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        Active Plan: {activeMealPlan.name}
                      </CardTitle>
                      <CardDescription>{activeMealPlan.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {activeMealPlan.isAIGenerated ? "AI Generated" : "Custom"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{activeMealPlan.totalCalories}</p>
                      <p className="text-sm text-muted-foreground">Calories</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">{activeMealPlan.totalProtein}g</p>
                      <p className="text-sm text-muted-foreground">Protein</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {activeMealPlan.meals.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                        <div>
                          <p className="font-medium">{meal.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} • {meal.calories} kcal
                          </p>
                        </div>
                        <Button size="sm" onClick={() => handleAddMealFromPlan(meal)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Plans */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">All Meal Plans</h3>
                <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate New Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate AI Meal Plan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="days">Number of Days</Label>
                        <Select value={generationOptions.days.toString()} onValueChange={(value) => setGenerationOptions(prev => ({ ...prev, days: parseInt(value) }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Day</SelectItem>
                            <SelectItem value="3">3 Days</SelectItem>
                            <SelectItem value="7">1 Week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={handleGenerateAIPlan} 
                        disabled={isGenerating}
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Plan
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {mealPlans.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <ChefHat className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No meal plans yet. Generate your first AI meal plan!</p>
                    <Button onClick={() => setGenerateDialogOpen(true)}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Your First Plan
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {mealPlans.map((plan) => (
                    <Card key={plan.id} className={plan.id === activeMealPlan?.id ? "border-primary" : ""}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{plan.name}</CardTitle>
                          <div className="flex gap-2">
                            {plan.isAIGenerated && (
                              <Badge variant="secondary">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                            {plan.id === activeMealPlan?.id && (
                              <Badge>Active</Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 text-sm">
                            <span>{plan.totalCalories} kcal</span>
                            <span>{plan.totalProtein}g protein</span>
                            <span>{plan.meals.length} meals</span>
                          </div>
                          <div className="flex gap-2">
                            {plan.id !== activeMealPlan?.id && (
                              <Button size="sm" variant="outline" onClick={() => setActiveMealPlan(plan)}>
                                Set Active
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Meal Suggestions
                </CardTitle>
                <CardDescription>Get personalized meal suggestions for any meal type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => (
                    <Button
                      key={mealType}
                      variant="outline"
                      onClick={() => handleGetSuggestions(mealType)}
                      disabled={loadingSuggestions}
                      className="h-16"
                    >
                      {loadingSuggestions ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <div className="text-center">
                          <p className="font-medium capitalize">{mealType}</p>
                          <p className="text-xs text-muted-foreground">Get suggestions</p>
                        </div>
                      )}
                    </Button>
                  ))}
                </div>

                {mealSuggestions.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Suggested Meals</h4>
                    {mealSuggestions.map((meal) => (
                      <Card key={meal.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{meal.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {meal.calories} kcal • {meal.protein}g protein
                                {meal.prepTime && ` • ${meal.prepTime} min`}
                              </p>
                            </div>
                            <AddFoodDialog>
                              <Button size="sm">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </AddFoodDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Discover Meals
                </CardTitle>
                <CardDescription>Search our meal database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for meals, ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    {searchResults.map((meal) => (
                      <Card key={meal.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{meal.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} • {meal.calories} kcal
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {meal.ingredients.join(', ')}
                              </p>
                            </div>
                            <AddFoodDialog>
                              <Button size="sm">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </AddFoodDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNavigation />
    </div>
  );
};
