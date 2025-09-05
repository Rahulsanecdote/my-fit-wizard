import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Dumbbell, Target, TrendingUp, Apple, Droplets } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      <Header 
        title={`Welcome back, ${user?.user_metadata?.first_name || 'there'}!`}
        subtitle="Let's crush your fitness goals today"
      />
      
      <main className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-primary text-primary-foreground border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Apple className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Today's Meals</p>
                  <p className="text-lg font-bold">Plan Now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-secondary text-secondary-foreground border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Dumbbell className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Workout</p>
                  <p className="text-lg font-bold">Start Now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Today's Progress
            </CardTitle>
            <CardDescription>
              Keep up the great work! You're on track to meet your goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Calories */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Calories</span>
                <span>1,240 / 2,100 kcal</span>
              </div>
              <Progress value={59} className="h-2" />
            </div>

            {/* Protein */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Protein</span>
                <span>45 / 150g</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>

            {/* Water */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Water
                </span>
                <span>6 / 8 glasses</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            {/* Workout */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Workout</span>
                <span>0 / 45 min</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">4</p>
                <p className="text-sm text-muted-foreground">Workouts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">85%</p>
                <p className="text-sm text-muted-foreground">Nutrition Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Coming Up
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Upper Body Strength</p>
                <p className="text-sm text-muted-foreground">Tomorrow, 7:00 AM</p>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Meal Prep Session</p>
                <p className="text-sm text-muted-foreground">Sunday, 2:00 PM</p>
              </div>
              <Button size="sm" variant="outline">
                Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-medium text-accent mb-2">
              "The groundwork for all happiness is good health."
            </p>
            <p className="text-sm text-muted-foreground">- Leigh Hunt</p>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
};