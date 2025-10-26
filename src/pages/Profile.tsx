import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitness } from '@/contexts/FitnessContext';
import { Header } from '@/components/layout/Header';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Ruler, Target, Settings, User, Scale, Activity } from 'lucide-react';
import { UserStats, UserPreferences } from '@/types/fitness';

export const Profile = () => {
  const navigate = useNavigate();
  const { userStats, setUserStats, userPreferences, setUserPreferences, calculateNutritionGoals, setNutritionGoals, nutritionGoals } = useFitness();
  const { toast } = useToast();

  const [statsForm, setStatsForm] = useState<UserStats>(
    userStats || { age: 25, height: 175, weight: 70, activityLevel: 'moderate', goal: 'maintain' }
  );

  const [prefsForm, setPrefsForm] = useState<UserPreferences>(userPreferences);

  const handleSaveStats = () => {
    setUserStats(statsForm);
    const newGoals = calculateNutritionGoals(statsForm);
    setNutritionGoals(newGoals);
    toast({ title: 'Profile Updated', description: 'Your nutrition goals have been recalculated.' });
  };

  const handleSavePreferences = () => {
    setUserPreferences(prefsForm);
    toast({ title: 'Preferences Saved', description: 'Your preferences and settings have been updated.' });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      <Header title="Your Profile" subtitle="Manage your stats and preferences" />

      <main className="px-4 py-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Stats
              </CardTitle>
              <CardDescription>Update your body metrics and fitness goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" min={13} max={120} value={statsForm.age} onChange={(e) => setStatsForm({ ...statsForm, age: Number(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" min={30} max={300} step={0.1} value={statsForm.weight} onChange={(e) => setStatsForm({ ...statsForm, weight: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" min={100} max={250} value={statsForm.height} onChange={(e) => setStatsForm({ ...statsForm, height: Number(e.target.value) })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Activity Level</Label>
                  <Select value={statsForm.activityLevel} onValueChange={(value) => setStatsForm({ ...statsForm, activityLevel: value as UserStats['activityLevel'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="very_active">Very Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Goal</Label>
                  <Select value={statsForm.goal} onValueChange={(value) => setStatsForm({ ...statsForm, goal: value as UserStats['goal'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose_weight">Lose Weight</SelectItem>
                      <SelectItem value="maintain">Maintain</SelectItem>
                      <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                      <SelectItem value="gain_weight">Gain Weight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSaveStats} className="w-full">Save Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>Configure diet and workout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Units</Label>
                <Select value={prefsForm.units} onValueChange={(value) => setPrefsForm({ ...prefsForm, units: value as UserPreferences['units'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                    <SelectItem value="imperial">Imperial (lb, in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fitness Level</Label>
                <Select value={prefsForm.fitnessLevel} onValueChange={(value) => setPrefsForm({ ...prefsForm, fitnessLevel: value as UserPreferences['fitnessLevel'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Preferred Workout Time</Label>
                <Select value={prefsForm.preferredWorkoutTime} onValueChange={(value) => setPrefsForm({ ...prefsForm, preferredWorkoutTime: value as UserPreferences['preferredWorkoutTime'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSavePreferences} variant="outline" className="w-full">Save Preferences</Button>
              <Button onClick={() => navigate('/settings')} variant="ghost" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Current Nutrition Goals
            </CardTitle>
            <CardDescription>Your targets based on your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{nutritionGoals.calories}</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-secondary">{nutritionGoals.protein}g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{nutritionGoals.carbs}g</p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{nutritionGoals.fat}g</p>
                <p className="text-xs text-muted-foreground">Fat</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
};
