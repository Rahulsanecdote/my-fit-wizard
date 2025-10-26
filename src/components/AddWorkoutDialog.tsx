import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFitness } from '@/contexts/FitnessContext';
import { useToast } from '@/components/ui/use-toast';
import { WorkoutEntry } from '@/types/fitness';

interface AddWorkoutDialogProps {
  children: React.ReactNode;
}

export const AddWorkoutDialog = ({ children }: AddWorkoutDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    type: '' as WorkoutEntry['type'] | '',
    caloriesBurned: ''
  });
  
  const { addWorkoutEntry } = useFitness();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.duration || !formData.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const calories = formData.caloriesBurned ? Number(formData.caloriesBurned) : estimateCalories();

    addWorkoutEntry({
      name: formData.name,
      duration: Number(formData.duration),
      type: formData.type,
      caloriesBurned: calories
    });

    toast({
      title: "Workout Added!",
      description: `${formData.name} has been logged successfully.`
    });

    setFormData({
      name: '',
      duration: '',
      type: '',
      caloriesBurned: ''
    });
    setOpen(false);
  };

  // Simple calorie estimation based on workout type and duration
  const estimateCalories = (): number => {
    const caloriesPerMinute = {
      cardio: 8,
      strength: 6,
      flexibility: 3,
      sports: 7
    };
    
    const rate = caloriesPerMinute[formData.type as keyof typeof caloriesPerMinute] || 5;
    return rate * Number(formData.duration);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="workout-name">Workout Name *</Label>
            <Input
              id="workout-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Morning Run"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (min) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="30"
                required
              />
            </div>
            <div>
              <Label>Workout Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as WorkoutEntry['type'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="calories">Calories Burned</Label>
            <Input
              id="calories"
              type="number"
              min="0"
              value={formData.caloriesBurned}
              onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
              placeholder={formData.type && formData.duration ? `Est. ${estimateCalories()}` : "Auto-calculated"}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty for automatic estimation
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Workout
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
