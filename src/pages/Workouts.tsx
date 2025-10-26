import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitness } from '@/contexts/FitnessContext';
import { Header } from '@/components/layout/Header';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Timer, Target, Dumbbell, Play, Search, Star, Clock, Activity } from 'lucide-react';
import { AddWorkoutDialog } from '@/components/AddWorkoutDialog';
import { generateAIWorkoutPlan, generateWorkoutSuggestions, searchExercises } from '@/utils/workoutGenerator';
import { WorkoutPlan, Exercise } from '@/types/fitness';
import { useToast } from '@/components/ui/use-toast';

export const Workouts = () => {
  const navigate = useNavigate();
  const { userStats, userPreferences, addWorkoutPlan, setActiveWorkoutPlan, activeWorkoutPlan, workoutPlans } = useFitness();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [exerciseSuggestions, setExerciseSuggestions] = useState<Exercise[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generationOptions, setGenerationOptions] = useState({
    duration: 30,
    type: 'mixed' as 'strength' | 'cardio' | 'flexibility' | 'mixed'
  });

  // Redirect to setup if no user stats
  if (!userStats) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-4">
        <Header title="Workouts" subtitle="Set up your profile first" />
        <main className="px-4 py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Please set up your profile to get personalized workout recommendations.
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

  const handleGenerateAIWorkout = async () => {
    setIsGenerating(true);
    try {
      const workoutPlan = await generateAIWorkoutPlan(
        userStats, 
        userPreferences, 
        generationOptions.duration,
        generationOptions.type
      );
      addWorkoutPlan(workoutPlan);
      setActiveWorkoutPlan(workoutPlan);
      setGenerateDialogOpen(false);
      toast({
        title: "AI Workout Generated!",
        description: `Created a ${generationOptions.duration}-minute ${generationOptions.type} workout.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate workout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetSuggestions = async (workoutType: 'strength' | 'cardio' | 'flexibility') => {
    setLoadingSuggestions(true);
    try {
      const suggestions = await generateWorkoutSuggestions(workoutType, generationOptions.duration, userPreferences);
      setExerciseSuggestions(suggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get exercise suggestions.",
        variant: "destructive"
      });
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = searchExercises(searchTerm);
      setSearchResults(results);
    }
  };

  const handleStartWorkout = (workout: WorkoutPlan) => {
    toast({
      title: "Workout Started!",
      description: `Starting ${workout.name}. Good luck!`
    });
    // In a real app, this would navigate to a workout session page
  };

  const formatDuration = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      <Header 
        title="Workouts" 
        subtitle="AI-powered fitness training"
      />
      
      <main className="px-4 py-6 space-y-6">
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">My Plans</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-4">
            {/* Active Plan */}
            {activeWorkoutPlan && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        Active Plan: {activeWorkoutPlan.name}
                      </CardTitle>
                      <CardDescription>{activeWorkoutPlan.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {activeWorkoutPlan.isAIGenerated ? "AI Generated" : "Custom"}
                      </Badge>
                      <Badge variant="outline">
                        {activeWorkoutPlan.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{formatDuration(activeWorkoutPlan.duration)}</p>
                      <p className="text-sm text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">{activeWorkoutPlan.exercises.length}</p>
                      <p className="text-sm text-muted-foreground">Exercises</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">{activeWorkoutPlan.type}</p>
                      <p className="text-sm text-muted-foreground">Type</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {activeWorkoutPlan.exercises.slice(0, 3).map((exercise) => (
                      <div key={exercise.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {exercise.sets && exercise.reps 
                              ? `${exercise.sets} sets × ${exercise.reps} reps`
                              : exercise.duration ? `${exercise.duration} minutes` : 'See instructions'
                            }
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {exercise.type}
                        </Badge>
                      </div>
                    ))}
                    {activeWorkoutPlan.exercises.length > 3 && (
                      <p className="text-center text-sm text-muted-foreground">
                        +{activeWorkoutPlan.exercises.length - 3} more exercises
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => handleStartWorkout(activeWorkoutPlan)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* All Plans */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">All Workout Plans</h3>
                <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate New Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate AI Workout Plan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Select 
                          value={generationOptions.duration.toString()} 
                          onValueChange={(value) => setGenerationOptions(prev => ({ ...prev, duration: parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="type">Workout Type</Label>
                        <Select 
                          value={generationOptions.type} 
                          onValueChange={(value) => setGenerationOptions(prev => ({ ...prev, type: value as typeof prev.type }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mixed">Mixed Training</SelectItem>
                            <SelectItem value="strength">Strength Training</SelectItem>
                            <SelectItem value="cardio">Cardio</SelectItem>
                            <SelectItem value="flexibility">Flexibility</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={handleGenerateAIWorkout} 
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
                            Generate Workout
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {workoutPlans.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No workout plans yet. Generate your first AI workout!</p>
                    <Button onClick={() => setGenerateDialogOpen(true)}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Your First Workout
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {workoutPlans.map((plan) => (
                    <Card key={plan.id} className={plan.id === activeWorkoutPlan?.id ? "border-primary" : ""}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            {plan.name}
                          </CardTitle>
                          <div className="flex gap-2">
                            {plan.isAIGenerated && (
                              <Badge variant="secondary">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                            <Badge variant="outline" className="capitalize">
                              {plan.difficulty}
                            </Badge>
                            {plan.id === activeWorkoutPlan?.id && (
                              <Badge>Active</Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(plan.duration)}
                            </span>
                            <span className="capitalize">{plan.type}</span>
                            <span>{plan.exercises.length} exercises</span>
                          </div>
                          <div className="flex gap-2">
                            {plan.id !== activeWorkoutPlan?.id && (
                              <Button size="sm" variant="outline" onClick={() => setActiveWorkoutPlan(plan)}>
                                Set Active
                              </Button>
                            )}
                            <Button size="sm" onClick={() => handleStartWorkout(plan)}>
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
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
                  AI Exercise Suggestions
                </CardTitle>
                <CardDescription>Get personalized exercise suggestions by workout type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {(['strength', 'cardio', 'flexibility'] as const).map((workoutType) => (
                    <Button
                      key={workoutType}
                      variant="outline"
                      onClick={() => handleGetSuggestions(workoutType)}
                      disabled={loadingSuggestions}
                      className="h-16"
                    >
                      {loadingSuggestions ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <div className="text-center">
                          <p className="font-medium capitalize">{workoutType}</p>
                          <p className="text-xs text-muted-foreground">Get exercises</p>
                        </div>
                      )}
                    </Button>
                  ))}
                </div>

                {exerciseSuggestions.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Suggested Exercises</h4>
                    {exerciseSuggestions.map((exercise) => (
                      <Card key={exercise.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{exercise.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {exercise.sets && exercise.reps 
                                  ? `${exercise.sets} sets × ${exercise.reps} reps`
                                  : exercise.duration ? `${exercise.duration} minutes` : 'Custom duration'
                                }
                                {exercise.restTime && ` • ${exercise.restTime}s rest`}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {exercise.muscleGroups.join(', ')}
                              </p>
                            </div>
                            <AddWorkoutDialog>
                              <Button size="sm">
                                <Target className="h-4 w-4" />
                              </Button>
                            </AddWorkoutDialog>
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
                  Discover Exercises
                </CardTitle>
                <CardDescription>Search our exercise database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for exercises, muscle groups..."
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
                    {searchResults.map((exercise) => (
                      <Card key={exercise.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{exercise.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)} exercise
                                {exercise.sets && exercise.reps && ` • ${exercise.sets}×${exercise.reps}`}
                                {exercise.duration && ` • ${exercise.duration} min`}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {exercise.muscleGroups.join(', ')}
                              </p>
                            </div>
                            <AddWorkoutDialog>
                              <Button size="sm">
                                <Target className="h-4 w-4" />
                              </Button>
                            </AddWorkoutDialog>
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
