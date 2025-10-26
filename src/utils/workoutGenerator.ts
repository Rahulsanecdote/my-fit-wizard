import { WorkoutPlan, Exercise, UserStats, UserPreferences } from '@/types/fitness';

// Mock exercise database - in a real app, this would come from an AI service
const exerciseDatabase: Omit<Exercise, 'id'>[] = [
  // Cardio exercises
  {
    name: "Treadmill Running",
    type: "cardio",
    muscleGroups: ["legs", "cardiovascular"],
    duration: 30,
    instructions: ["Warm up for 5 minutes", "Run at moderate pace", "Cool down for 5 minutes"],
    caloriesPerMinute: 10,
  },
  {
    name: "Cycling",
    type: "cardio", 
    muscleGroups: ["legs", "cardiovascular"],
    duration: 45,
    instructions: ["Adjust seat height", "Start with easy pace", "Gradually increase intensity"],
    caloriesPerMinute: 8,
  },
  {
    name: "Jump Rope",
    type: "cardio",
    muscleGroups: ["legs", "arms", "cardiovascular"],
    duration: 15,
    instructions: ["Start slow", "Keep elbows close to body", "Land softly"],
    caloriesPerMinute: 12,
  },

  // Strength exercises
  {
    name: "Push-ups",
    type: "strength",
    muscleGroups: ["chest", "arms", "core"],
    sets: 3,
    reps: 12,
    restTime: 60,
    instructions: ["Keep body straight", "Lower chest to ground", "Push up explosively"],
    caloriesPerMinute: 6,
  },
  {
    name: "Squats",
    type: "strength",
    muscleGroups: ["legs", "glutes", "core"],
    sets: 3,
    reps: 15,
    restTime: 60,
    instructions: ["Feet shoulder-width apart", "Lower hips back", "Keep chest up"],
    caloriesPerMinute: 6,
  },
  {
    name: "Deadlifts",
    type: "strength",
    muscleGroups: ["back", "legs", "glutes"],
    sets: 3,
    reps: 8,
    restTime: 90,
    instructions: ["Keep back straight", "Lift with legs", "Engage core"],
    caloriesPerMinute: 7,
  },
  {
    name: "Pull-ups",
    type: "strength",
    muscleGroups: ["back", "arms"],
    sets: 3,
    reps: 8,
    restTime: 90,
    instructions: ["Hang with arms extended", "Pull chin over bar", "Lower with control"],
    caloriesPerMinute: 8,
  },
  {
    name: "Bench Press",
    type: "strength",
    muscleGroups: ["chest", "arms", "shoulders"],
    sets: 3,
    reps: 10,
    restTime: 90,
    instructions: ["Lie on bench", "Lower bar to chest", "Press up forcefully"],
    caloriesPerMinute: 6,
  },
  {
    name: "Plank",
    type: "strength",
    muscleGroups: ["core", "shoulders"],
    duration: 60,
    instructions: ["Hold body straight", "Engage core muscles", "Breathe steadily"],
    caloriesPerMinute: 4,
  },

  // Flexibility exercises
  {
    name: "Forward Fold",
    type: "flexibility",
    muscleGroups: ["hamstrings", "back"],
    duration: 30,
    instructions: ["Bend forward slowly", "Keep legs straight", "Breathe deeply"],
    caloriesPerMinute: 2,
  },
  {
    name: "Cat-Cow Stretch",
    type: "flexibility",
    muscleGroups: ["spine", "core"],
    duration: 60,
    instructions: ["Start on hands and knees", "Arch and round spine", "Move slowly"],
    caloriesPerMinute: 2,
  },
  {
    name: "Hip Flexor Stretch",
    type: "flexibility",
    muscleGroups: ["hips", "legs"],
    duration: 45,
    instructions: ["Lunge position", "Push hips forward", "Hold stretch"],
    caloriesPerMinute: 2,
  },
];

export const generateAIWorkoutPlan = async (
  userStats: UserStats,
  preferences?: UserPreferences,
  targetDuration: number = 45,
  workoutType: 'strength' | 'cardio' | 'flexibility' | 'mixed' = 'mixed'
): Promise<WorkoutPlan> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  const fitnessLevel = preferences?.fitnessLevel || 'beginner';
  const difficulty = fitnessLevel;

  let availableExercises = [...exerciseDatabase];

  // Filter exercises based on workout type
  if (workoutType !== 'mixed') {
    availableExercises = availableExercises.filter(ex => ex.type === workoutType);
  }

  // Adjust based on fitness level
  if (fitnessLevel === 'beginner') {
    availableExercises = availableExercises.filter(ex => 
      !['Deadlifts', 'Pull-ups', 'Bench Press'].includes(ex.name)
    );
  }

  const workoutPlan: WorkoutPlan = {
    id: crypto.randomUUID(),
    name: `AI ${workoutType} Workout - ${difficulty}`,
    description: `${targetDuration} minute ${workoutType} workout tailored for ${difficulty} level`,
    type: workoutType,
    difficulty,
    duration: targetDuration,
    exercises: [],
    createdAt: new Date(),
    isAIGenerated: true
  };

  let currentDuration = 0;
  const selectedExercises: Exercise[] = [];

  // Select exercises to fill target duration
  while (currentDuration < targetDuration && availableExercises.length > 0) {
    const randomExercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
    
    const exercise: Exercise = {
      ...randomExercise,
      id: crypto.randomUUID()
    };

    // Calculate exercise duration
    let exerciseDuration = 0;
    if (exercise.duration) {
      exerciseDuration = exercise.duration;
    } else if (exercise.sets && exercise.reps) {
      // Estimate duration: (reps * 3 seconds + rest time) * sets
      exerciseDuration = (exercise.reps * 3 + (exercise.restTime || 60)) * exercise.sets / 60;
    } else {
      exerciseDuration = 10; // default 10 minutes
    }

    if (currentDuration + exerciseDuration <= targetDuration + 5) { // Allow 5 min buffer
      selectedExercises.push(exercise);
      currentDuration += exerciseDuration;
      
      // Remove exercise to avoid duplicates
      availableExercises = availableExercises.filter(ex => ex.name !== exercise.name);
    } else {
      break;
    }
  }

  // Add warm-up and cool-down for longer workouts
  if (targetDuration >= 30) {
    selectedExercises.unshift({
      id: crypto.randomUUID(),
      name: "Warm-up",
      type: "cardio",
      muscleGroups: ["full body"],
      duration: 5,
      instructions: ["Light jogging in place", "Arm circles", "Dynamic stretching"],
      caloriesPerMinute: 4
    });

    selectedExercises.push({
      id: crypto.randomUUID(),
      name: "Cool-down",
      type: "flexibility",
      muscleGroups: ["full body"],
      duration: 5,
      instructions: ["Static stretching", "Deep breathing", "Gentle movements"],
      caloriesPerMinute: 2
    });
  }

  workoutPlan.exercises = selectedExercises;
  workoutPlan.duration = currentDuration;

  return workoutPlan;
};

export const generateWorkoutSuggestions = async (
  workoutType: 'strength' | 'cardio' | 'flexibility',
  targetDuration: number,
  preferences?: UserPreferences
): Promise<Exercise[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  let availableExercises = exerciseDatabase.filter(ex => ex.type === workoutType);
  
  const fitnessLevel = preferences?.fitnessLevel || 'beginner';
  
  if (fitnessLevel === 'beginner') {
    availableExercises = availableExercises.filter(ex => 
      !['Deadlifts', 'Pull-ups', 'Bench Press'].includes(ex.name)
    );
  }

  // Shuffle and return top 6 exercises
  const shuffled = availableExercises.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 6).map(exercise => ({
    ...exercise,
    id: crypto.randomUUID()
  }));
};

export const searchExercises = (query: string): Exercise[] => {
  const searchTerm = query.toLowerCase();
  return exerciseDatabase
    .filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm) ||
      exercise.muscleGroups.some(muscle => 
        muscle.toLowerCase().includes(searchTerm)
      ) ||
      exercise.type.toLowerCase().includes(searchTerm)
    )
    .map(exercise => ({
      ...exercise,
      id: crypto.randomUUID()
    }));
};

export const getExercisesByMuscleGroup = (muscleGroup: string): Exercise[] => {
  return exerciseDatabase
    .filter(exercise => 
      exercise.muscleGroups.some(muscle => 
        muscle.toLowerCase() === muscleGroup.toLowerCase()
      )
    )
    .map(exercise => ({
      ...exercise,
      id: crypto.randomUUID()
    }));
};
