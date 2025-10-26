import { useAuth } from '@/contexts/AuthContext';
import { useFitness } from '@/contexts/FitnessContext';
import { Header } from '@/components/layout/Header';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Dumbbell, Target, TrendingUp, Apple, Droplets, Plus, Settings, User } from 'lucide-react';
import { AddFoodDialog } from '@/components/AddFoodDialog';
import { AddWorkoutDialog } from '@/components/AddWorkoutDialog';
import { UserSetupDialog } from '@/components/UserSetupDialog';

export const Dashboard = () => {
  const { user } = useAuth();
  const { userStats, dailyNutrition, nutritionGoals, workoutEntries, foodEntries, addWater } = useFitness();

  // Calculate progress percentages
  const calorieProgress = nutritionGoals.calories > 0 ? Math.round((dailyNutrition.calories / nutritionGoals.calories) * 100) : 0;
  const proteinProgress = nutritionGoals.protein > 0 ? Math.round((dailyNutrition.protein / nutritionGoals.protein) * 100) : 0;
  const waterProgress = nutritionGoals.water > 0 ? Math.round((dailyNutrition.water / nutritionGoals.water) * 100) : 0;
  
  // Calculate total workout time for today
  const totalWorkoutTime = workoutEntries.reduce((total, workout) => total + workout.duration, 0);
  const workoutGoal = 45; // minutes
  const workoutProgress = Math.round((totalWorkoutTime / workoutGoal) * 100);
  
  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    const totalProgress = (calorieProgress + proteinProgress + waterProgress + workoutProgress) / 4;
    if (totalProgress >= 80) return "CRUSHING IT! Keep this momentum going! 🔥";
    if (totalProgress >= 50) return "Strong work! You're halfway to greatness! 💪";
    if (totalProgress >= 25) return "Good start! Time to push harder! ⚡";
    return "Every champion starts here. Let's build momentum! 🚀";
  };
  
  const getHeroGradient = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'bg-gradient-midnight';
    if (hour < 12) return 'bg-gradient-energy';
    if (hour < 18) return 'bg-gradient-hero';
    return 'bg-gradient-sunset';
  };

  // Show setup prompt if no user stats
  if (!userStats) {
    return (
      <div className="min-h-screen bg-black">
        {/* Hero Welcome Section */}
        <div className="hero-section bg-gradient-hero min-h-[80vh] flex items-center justify-center">
          <div className="hero-overlay" />
          <div className="hero-content text-center max-w-md mx-auto">
            <div className="animate-bounce-in">
              <h1 className="text-hero text-white mb-4">Welcome to<br />FitGenie AI</h1>
              <p className="text-lg opacity-90 mb-8 font-medium">
                Your AI-powered fitness companion is ready to transform your journey
              </p>
              <UserSetupDialog>
                <button className="btn-athletic btn-energy text-lg px-8 py-4">
                  <Settings className="h-6 w-6 mr-3" />
                  Start Your Transformation
                </button>
              </UserSetupDialog>
            </div>
          </div>
        </div>
        
        {/* Quick Features Preview */}
        <div className="px-4 py-8">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="card-energy p-6 text-center">
              <Dumbbell className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold text-sm">AI WORKOUTS</h3>
              <p className="text-xs opacity-90">Personalized training</p>
            </div>
            <div className="card-success p-6 text-center">
              <Apple className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold text-sm">SMART NUTRITION</h3>
              <p className="text-xs opacity-90">Tailored meal plans</p>
            </div>
          </div>
        </div>
        
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      {/* Premium Hero Section */}
      <div className={`hero-section ${getHeroGradient()} min-h-[300px] mb-6`}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="animate-slide-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-display text-white mb-1">
                  {user?.user_metadata?.first_name || 'Champion'}
                </h1>
                <p className="text-athletic text-white/80 text-sm">
                  {getMotivationalMessage()}
                </p>
              </div>
            </div>
            
            {/* Quick Stats in Hero */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white">{Math.round((calorieProgress + proteinProgress + waterProgress + workoutProgress) / 4)}%</div>
                <div className="text-xs text-white/80 text-athletic">TODAY'S PROGRESS</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white">{foodEntries.length + workoutEntries.length}</div>
                <div className="text-xs text-white/80 text-athletic">ACTIVITIES LOGGED</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="px-4 space-y-6">
        {/* Premium Action Cards */}
        <div className="grid grid-cols-2 gap-4">
          <AddFoodDialog>
            <div className="card-energy cursor-pointer transform hover:scale-105 transition-all duration-300 p-6">
              <div className="flex items-center gap-4">
                <Apple className="h-10 w-10" />
                <div>
                  <p className="text-athletic text-sm opacity-90">ADD FOOD</p>
                  <p className="text-xl font-bold">Log Meals</p>
                </div>
              </div>
            </div>
          </AddFoodDialog>

          <AddWorkoutDialog>
            <div className="card-power cursor-pointer transform hover:scale-105 transition-all duration-300 p-6">
              <div className="flex items-center gap-4">
                <Dumbbell className="h-10 w-10" />
                <div>
                  <p className="text-athletic text-sm opacity-90">LOG WORKOUT</p>
                  <p className="text-xl font-bold">Track Exercise</p>
                </div>
              </div>
            </div>
          </AddWorkoutDialog>
        </div>

        {/* Premium Progress Section */}
        <div className="card-premium animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-energy rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-display text-lg">Today's Metrics</CardTitle>
                  <CardDescription className="text-athletic text-xs">
                    {calorieProgress >= 90 && calorieProgress <= 110 ? 
                      "PERFECT EXECUTION! TARGETS LOCKED! 🎯" :
                      calorieProgress < 90 ?
                      "FUEL UP! MORE ENERGY NEEDED! ⚡" :
                      "STRONG INTAKE! MANAGE THE SURPLUS! 🔥"
                    }
                  </CardDescription>
                </div>
              </div>
              <UserSetupDialog>
                <button className="btn-athletic bg-black text-white px-4 py-2 text-xs">
                  <Settings className="h-3 w-3 mr-1" />
                  ADJUST
                </button>
              </UserSetupDialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Premium Progress Bars */}
            <div className="space-y-4">
              {/* Calories */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-athletic text-sm font-bold">CALORIES</span>
                  <span className="text-lg font-bold">{dailyNutrition.calories}<span className="text-muted-foreground text-sm">/{nutritionGoals.calories}</span></span>
                </div>
                <div className="progress-athletic progress-energy">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">{calorieProgress}% complete</div>
              </div>

              {/* Protein */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-athletic text-sm font-bold">PROTEIN</span>
                  <span className="text-lg font-bold">{dailyNutrition.protein}g<span className="text-muted-foreground text-sm">/{nutritionGoals.protein}g</span></span>
                </div>
                <div className="progress-athletic progress-success">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">{proteinProgress}% complete</div>
              </div>

              {/* Water */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-athletic text-sm font-bold">HYDRATION</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{dailyNutrition.water}<span className="text-muted-foreground text-sm">/{nutritionGoals.water}</span></span>
                    <button 
                      className="btn-athletic bg-blue-500 text-white px-3 py-1 text-xs rounded-full"
                      onClick={() => addWater(1)}
                      disabled={dailyNutrition.water >= nutritionGoals.water}
                    >
                      +1
                    </button>
                  </div>
                </div>
                <div className="progress-athletic">
                  <div 
                    className="progress-fill bg-blue-500" 
                    style={{ width: `${Math.min(waterProgress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">{waterProgress}% complete</div>
              </div>

              {/* Workout */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-athletic text-sm font-bold">TRAINING</span>
                  <span className="text-lg font-bold">{totalWorkoutTime}min<span className="text-muted-foreground text-sm">/{workoutGoal}min</span></span>
                </div>
                <div className="progress-athletic progress-power">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(workoutProgress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">{workoutProgress}% complete</div>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Premium Activity Feed */}
        {(foodEntries.length > 0 || workoutEntries.length > 0) && (
          <div className="card-premium animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-success rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-display text-lg">Activity Feed</CardTitle>
                  <CardDescription className="text-athletic text-xs">
                    TODAY'S LOGGED ACTIVITIES • {foodEntries.length + workoutEntries.length} ENTRIES
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Food Entries */}
              {foodEntries.slice(0, 3).map((food) => (
                <div key={food.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-energy rounded-full flex items-center justify-center">
                      <Apple className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{food.name}</p>
                      <p className="text-xs text-muted-foreground text-athletic">{food.calories} KCAL • {food.protein}G PROTEIN</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground font-mono">
                      {food.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-green-600 font-bold">LOGGED</div>
                  </div>
                </div>
              ))}
              
              {/* Workout Entries */}
              {workoutEntries.slice(0, 2).map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-power rounded-full flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{workout.name}</p>
                      <p className="text-xs text-muted-foreground text-athletic">{workout.duration} MIN • {workout.caloriesBurned} KCAL BURNED</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground font-mono">
                      {workout.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-purple-600 font-bold">COMPLETED</div>
                  </div>
                </div>
              ))}
              
              {(foodEntries.length > 3 || workoutEntries.length > 2) && (
                <div className="text-center p-4 bg-muted/30 rounded-xl border-2 border-dashed border-muted">
                  <p className="text-athletic text-xs text-muted-foreground">
                    + {Math.max(0, foodEntries.length - 3) + Math.max(0, workoutEntries.length - 2)} MORE ACTIVITIES LOGGED TODAY
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        )}

        {/* Premium Motivational Section */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-sunset opacity-90" />
          <div className="relative z-10 p-8 text-center text-white">
            <div className="animate-bounce-in">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-display text-xl mb-3">
                {totalWorkoutTime > 0 ?
                  "UNSTOPPABLE ENERGY!" :
                  "TIME TO IGNITE!"
                }
              </h3>
              <p className="text-athletic text-sm opacity-90 mb-4">
                {totalWorkoutTime > 0 ?
                  `${totalWorkoutTime} MINUTES OF PURE POWER TODAY! KEEP THE FIRE BURNING! 🔥` :
                  "YOUR NEXT WORKOUT IS WHERE LEGENDS ARE MADE! LET'S GO! ⚡"
                }
              </p>
              <p className="text-xs opacity-75">
                {foodEntries.length === 0 ? 
                  "FUEL YOUR AMBITION • LOG YOUR FIRST MEAL" : 
                  `${foodEntries.length} MEAL${foodEntries.length !== 1 ? 'S' : ''} LOGGED • NUTRITION ON POINT`
                }
              </p>
            </div>
          </div>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
};
