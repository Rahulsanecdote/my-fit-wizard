// AI-powered equipment-based workout generation service

import {
  Equipment,
  UserEquipment,
  EquipmentBasedWorkout,
  WorkoutExercise
} from '@/types/advanced-fitness';

// Comprehensive equipment database
const EQUIPMENT_DATABASE: Equipment[] = [
  // No Equipment
  { id: 'eq-0', name: 'Bodyweight', category: 'bodyweight', spaceRequired: 'minimal', portability: 'travel-friendly', exercises: ['Push-ups', 'Pull-ups', 'Squats', 'Lunges', 'Planks', 'Burpees'] },
  
  // Cardio Equipment
  { id: 'eq-1', name: 'Treadmill', category: 'cardio', spaceRequired: 'moderate', portability: 'fixed', exercises: ['Running', 'Walking', 'HIIT Sprints', 'Incline Walk'], alternatives: ['Outdoor Running'] },
  { id: 'eq-2', name: 'Stationary Bike', category: 'cardio', spaceRequired: 'moderate', portability: 'fixed', exercises: ['Cycling', 'HIIT Cycling', 'Endurance Ride'], alternatives: ['Outdoor Cycling'] },
  { id: 'eq-3', name: 'Jump Rope', category: 'cardio', spaceRequired: 'minimal', portability: 'travel-friendly', exercises: ['Single Unders', 'Double Unders', 'Criss-Cross'] },
  { id: 'eq-4', name: 'Rowing Machine', category: 'cardio', spaceRequired: 'moderate', portability: 'fixed', exercises: ['Rowing', 'Rowing Intervals'] },
  
  // Strength Equipment
  { id: 'eq-5', name: 'Dumbbells', category: 'strength', spaceRequired: 'minimal', portability: 'portable', exercises: ['Bicep Curls', 'Shoulder Press', 'Chest Press', 'Rows', 'Lunges'] },
  { id: 'eq-6', name: 'Barbell', category: 'strength', spaceRequired: 'moderate', portability: 'portable', exercises: ['Squats', 'Deadlifts', 'Bench Press', 'Rows', 'Overhead Press'] },
  { id: 'eq-7', name: 'Kettlebell', category: 'strength', spaceRequired: 'minimal', portability: 'portable', exercises: ['Swings', 'Goblet Squats', 'Turkish Get-ups', 'Snatches'] },
  { id: 'eq-8', name: 'Pull-up Bar', category: 'strength', spaceRequired: 'minimal', portability: 'fixed', exercises: ['Pull-ups', 'Chin-ups', 'Hanging Leg Raises'] },
  
  // Resistance Equipment
  { id: 'eq-9', name: 'Resistance Bands', category: 'resistance', spaceRequired: 'minimal', portability: 'travel-friendly', exercises: ['Band Pulls', 'Band Squats', 'Band Rows', 'Band Press'] },
  { id: 'eq-10', name: 'TRX/Suspension Trainer', category: 'resistance', spaceRequired: 'minimal', portability: 'portable', exercises: ['TRX Rows', 'TRX Push-ups', 'TRX Squats', 'TRX Pike'] },
  
  // Flexibility Equipment
  { id: 'eq-11', name: 'Yoga Mat', category: 'flexibility', spaceRequired: 'minimal', portability: 'travel-friendly', exercises: ['Yoga Poses', 'Stretching', 'Core Work'] },
  { id: 'eq-12', name: 'Foam Roller', category: 'flexibility', spaceRequired: 'minimal', portability: 'portable', exercises: ['Myofascial Release', 'Recovery Rolling'] },
  
  // Other Equipment
  { id: 'eq-13', name: 'Medicine Ball', category: 'other', spaceRequired: 'minimal', portability: 'portable', exercises: ['Wall Balls', 'Russian Twists', 'Slams'] },
  { id: 'eq-14', name: 'Battle Ropes', category: 'other', spaceRequired: 'moderate', portability: 'portable', exercises: ['Waves', 'Slams', 'Spirals'] },
  { id: 'eq-15', name: 'Bench', category: 'other', spaceRequired: 'minimal', portability: 'portable', exercises: ['Step-ups', 'Box Jumps', 'Tricep Dips'] }
];

// Exercise database with detailed information
const EXERCISE_DATABASE: WorkoutExercise[] = [
  // Bodyweight Exercises
  {
    id: 'ex-1',
    name: 'Push-ups',
    sets: 3,
    reps: '10-15',
    rest: 60,
    instructions: ['Start in plank position', 'Lower chest to floor', 'Push back up', 'Keep core tight'],
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    difficulty: 'beginner',
    alternatives: ['Knee Push-ups', 'Incline Push-ups']
  },
  {
    id: 'ex-2',
    name: 'Squats',
    sets: 3,
    reps: '15-20',
    rest: 60,
    instructions: ['Stand with feet shoulder-width apart', 'Lower hips back and down', 'Keep chest up', 'Drive through heels to stand'],
    targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
    difficulty: 'beginner'
  },
  {
    id: 'ex-3',
    name: 'Burpees',
    sets: 3,
    reps: '8-12',
    rest: 90,
    instructions: ['Start standing', 'Drop to plank', 'Do a push-up', 'Jump feet to hands', 'Jump up with arms overhead'],
    targetMuscles: ['full body'],
    difficulty: 'intermediate'
  },
  
  // Dumbbell Exercises
  {
    id: 'ex-4',
    name: 'Dumbbell Chest Press',
    sets: 3,
    reps: '10-12',
    rest: 90,
    weight: 20,
    equipment: 'Dumbbells',
    instructions: ['Lie on bench with dumbbells', 'Press weights up', 'Lower with control', 'Keep core engaged'],
    targetMuscles: ['chest', 'triceps'],
    difficulty: 'intermediate'
  },
  {
    id: 'ex-5',
    name: 'Dumbbell Rows',
    sets: 3,
    reps: '12-15',
    rest: 60,
    weight: 15,
    equipment: 'Dumbbells',
    instructions: ['Hinge at hips', 'Pull weights to sides', 'Squeeze shoulder blades', 'Lower with control'],
    targetMuscles: ['back', 'biceps'],
    difficulty: 'intermediate'
  },
  
  // Barbell Exercises
  {
    id: 'ex-6',
    name: 'Barbell Squat',
    sets: 4,
    reps: '8-10',
    rest: 120,
    weight: 45,
    equipment: 'Barbell',
    instructions: ['Bar on upper back', 'Squat down keeping chest up', 'Drive through heels', 'Keep knees tracking over toes'],
    targetMuscles: ['quadriceps', 'glutes', 'core'],
    difficulty: 'advanced'
  },
  {
    id: 'ex-7',
    name: 'Deadlift',
    sets: 4,
    reps: '6-8',
    rest: 120,
    weight: 60,
    equipment: 'Barbell',
    instructions: ['Bar over mid-foot', 'Hinge at hips', 'Grip bar', 'Stand up driving hips forward', 'Keep back straight'],
    targetMuscles: ['hamstrings', 'glutes', 'back', 'core'],
    difficulty: 'advanced'
  },
  
  // Cardio Exercises
  {
    id: 'ex-8',
    name: 'Treadmill Intervals',
    duration: 1200, // 20 minutes
    equipment: 'Treadmill',
    instructions: ['5 min warm-up walk', '1 min sprint', '2 min recovery jog', 'Repeat 5 times', '5 min cool-down'],
    targetMuscles: ['cardiovascular', 'legs'],
    difficulty: 'intermediate'
  },
  {
    id: 'ex-9',
    name: 'Jump Rope HIIT',
    duration: 600, // 10 minutes
    equipment: 'Jump Rope',
    instructions: ['30 seconds fast', '30 seconds rest', 'Repeat 10 times'],
    targetMuscles: ['cardiovascular', 'calves', 'shoulders'],
    difficulty: 'intermediate'
  }
];

export class WorkoutAIService {
  // Generate workouts based on available equipment
  static generateWorkoutFromEquipment(
    availableEquipment: string[],
    workoutGoal: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'hybrid',
    duration: number, // minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    targetMuscles?: string[]
  ): EquipmentBasedWorkout {
    const hasNoEquipment = availableEquipment.length === 0 || availableEquipment.includes('Bodyweight');
    const hasDumbbells = availableEquipment.includes('Dumbbells');
    const hasBarbell = availableEquipment.includes('Barbell');
    const hasCardioEquipment = availableEquipment.some(eq => 
      ['Treadmill', 'Stationary Bike', 'Jump Rope', 'Rowing Machine'].includes(eq)
    );
    
    let workout: EquipmentBasedWorkout;
    
    // Generate based on goal and equipment
    if (workoutGoal === 'strength') {
      if (hasBarbell) {
        workout = this.generateBarbellStrengthWorkout(duration, difficulty);
      } else if (hasDumbbells) {
        workout = this.generateDumbbellStrengthWorkout(duration, difficulty);
      } else {
        workout = this.generateBodyweightStrengthWorkout(duration, difficulty);
      }
    } else if (workoutGoal === 'cardio') {
      if (hasCardioEquipment) {
        workout = this.generateCardioWorkout(availableEquipment, duration, difficulty);
      } else {
        workout = this.generateBodyweightCardioWorkout(duration, difficulty);
      }
    } else if (workoutGoal === 'hiit') {
      workout = this.generateHIITWorkout(availableEquipment, duration, difficulty);
    } else if (workoutGoal === 'flexibility') {
      workout = this.generateFlexibilityWorkout(duration, difficulty);
    } else {
      // Hybrid workout
      workout = this.generateHybridWorkout(availableEquipment, duration, difficulty);
    }
    
    // Filter exercises by target muscles if specified
    if (targetMuscles && targetMuscles.length > 0) {
      workout.exercises = workout.exercises.filter(ex => 
        ex.targetMuscles.some(muscle => targetMuscles.includes(muscle))
      );
    }
    
    return workout;
  }
  
  // Generate bodyweight strength workout
  private static generateBodyweightStrengthWorkout(
    duration: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): EquipmentBasedWorkout {
    const exercises: WorkoutExercise[] = [];
    
    if (difficulty === 'beginner') {
      exercises.push(
        { ...EXERCISE_DATABASE[0], sets: 3, reps: '8-10' }, // Push-ups
        { ...EXERCISE_DATABASE[1], sets: 3, reps: '12-15' }, // Squats
        {
          id: 'ex-plank',
          name: 'Plank',
          duration: 30,
          sets: 3,
          rest: 60,
          instructions: ['Hold plank position', 'Keep body straight', 'Engage core'],
          targetMuscles: ['core'],
          difficulty: 'beginner'
        },
        {
          id: 'ex-lunges',
          name: 'Lunges',
          sets: 3,
          reps: '10 each leg',
          rest: 60,
          instructions: ['Step forward', 'Lower back knee', 'Push back to start'],
          targetMuscles: ['quadriceps', 'glutes'],
          difficulty: 'beginner'
        }
      );
    } else if (difficulty === 'intermediate') {
      exercises.push(
        { ...EXERCISE_DATABASE[0], sets: 4, reps: '12-15' }, // Push-ups
        { ...EXERCISE_DATABASE[2] }, // Burpees
        {
          id: 'ex-pike',
          name: 'Pike Push-ups',
          sets: 3,
          reps: '10-12',
          rest: 60,
          instructions: ['Start in pike position', 'Lower head to floor', 'Push back up'],
          targetMuscles: ['shoulders', 'triceps'],
          difficulty: 'intermediate'
        },
        {
          id: 'ex-jump-squats',
          name: 'Jump Squats',
          sets: 3,
          reps: '12-15',
          rest: 90,
          instructions: ['Squat down', 'Explode up into jump', 'Land softly'],
          targetMuscles: ['quadriceps', 'glutes', 'calves'],
          difficulty: 'intermediate'
        }
      );
    } else {
      exercises.push(
        {
          id: 'ex-handstand',
          name: 'Handstand Push-ups',
          sets: 4,
          reps: '5-8',
          rest: 120,
          instructions: ['Kick up to handstand against wall', 'Lower head to floor', 'Press back up'],
          targetMuscles: ['shoulders', 'triceps', 'core'],
          difficulty: 'advanced'
        },
        {
          id: 'ex-pistol',
          name: 'Pistol Squats',
          sets: 3,
          reps: '5-8 each leg',
          rest: 90,
          instructions: ['Stand on one leg', 'Squat down fully', 'Stand back up'],
          targetMuscles: ['quadriceps', 'glutes', 'core'],
          difficulty: 'advanced'
        },
        { ...EXERCISE_DATABASE[2], sets: 4, reps: '15-20' }, // Burpees
        {
          id: 'ex-muscle-up',
          name: 'Muscle-ups',
          sets: 3,
          reps: '3-5',
          rest: 120,
          equipment: 'Pull-up Bar',
          instructions: ['Pull up explosively', 'Transition over bar', 'Press to full extension'],
          targetMuscles: ['back', 'chest', 'triceps'],
          difficulty: 'expert'
        }
      );
    }
    
    return {
      id: `workout-bw-strength-${Date.now()}`,
      name: 'Bodyweight Strength Builder',
      description: `A ${difficulty} level bodyweight workout focusing on strength and muscle building`,
      requiredEquipment: [],
      noEquipmentAlternative: true,
      duration,
      difficulty,
      targetMuscles: ['full body'],
      exercises,
      caloriesBurned: Math.round(duration * 7),
      workoutType: 'strength',
      spaceRequired: 'minimal',
      aiGenerated: true
    };
  }
  
  // Generate dumbbell strength workout
  private static generateDumbbellStrengthWorkout(
    duration: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): EquipmentBasedWorkout {
    const exercises: WorkoutExercise[] = [];
    
    exercises.push(
      { ...EXERCISE_DATABASE[3] }, // DB Chest Press
      { ...EXERCISE_DATABASE[4] }, // DB Rows
      {
        id: 'ex-db-shoulder',
        name: 'Dumbbell Shoulder Press',
        sets: 3,
        reps: '10-12',
        rest: 90,
        weight: 15,
        equipment: 'Dumbbells',
        instructions: ['Press dumbbells overhead', 'Control the descent', 'Keep core tight'],
        targetMuscles: ['shoulders', 'triceps'],
        difficulty: 'intermediate'
      },
      {
        id: 'ex-db-lunges',
        name: 'Dumbbell Lunges',
        sets: 3,
        reps: '12 each leg',
        rest: 60,
        weight: 20,
        equipment: 'Dumbbells',
        instructions: ['Hold dumbbells at sides', 'Lunge forward', 'Push back to start'],
        targetMuscles: ['quadriceps', 'glutes'],
        difficulty: 'intermediate'
      }
    );
    
    if (difficulty === 'advanced' || difficulty === 'expert') {
      exercises.forEach(ex => {
        ex.sets = 4;
        if (ex.weight) ex.weight *= 1.5;
      });
    }
    
    return {
      id: `workout-db-strength-${Date.now()}`,
      name: 'Dumbbell Power Session',
      description: `A comprehensive dumbbell workout for building strength and muscle`,
      requiredEquipment: ['Dumbbells'],
      duration,
      difficulty,
      targetMuscles: ['full body'],
      exercises,
      caloriesBurned: Math.round(duration * 8),
      workoutType: 'strength',
      spaceRequired: 'minimal',
      aiGenerated: true
    };
  }
  
  // Generate barbell strength workout
  private static generateBarbellStrengthWorkout(
    duration: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): EquipmentBasedWorkout {
    const exercises: WorkoutExercise[] = [
      { ...EXERCISE_DATABASE[5] }, // Barbell Squat
      { ...EXERCISE_DATABASE[6] }, // Deadlift
      {
        id: 'ex-bench',
        name: 'Bench Press',
        sets: 4,
        reps: '8-10',
        rest: 120,
        weight: 45,
        equipment: 'Barbell',
        instructions: ['Lower bar to chest', 'Press up powerfully', 'Keep feet planted'],
        targetMuscles: ['chest', 'triceps', 'shoulders'],
        difficulty: 'intermediate'
      },
      {
        id: 'ex-row',
        name: 'Barbell Row',
        sets: 4,
        reps: '10-12',
        rest: 90,
        weight: 40,
        equipment: 'Barbell',
        instructions: ['Hinge forward', 'Pull bar to stomach', 'Squeeze shoulder blades'],
        targetMuscles: ['back', 'biceps'],
        difficulty: 'intermediate'
      }
    ];
    
    if (difficulty === 'advanced' || difficulty === 'expert') {
      exercises.forEach(ex => {
        if (ex.weight) ex.weight *= 1.5;
        ex.sets = 5;
      });
    }
    
    return {
      id: `workout-barbell-strength-${Date.now()}`,
      name: 'Barbell Strength Foundation',
      description: `A powerful barbell workout for serious strength gains`,
      requiredEquipment: ['Barbell'],
      optionalEquipment: ['Bench', 'Squat Rack'],
      duration,
      difficulty,
      targetMuscles: ['full body'],
      exercises,
      caloriesBurned: Math.round(duration * 9),
      workoutType: 'strength',
      spaceRequired: 'moderate',
      aiGenerated: true
    };
  }
  
  // Generate cardio workout
  private static generateCardioWorkout(
    availableEquipment: string[],
    duration: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): EquipmentBasedWorkout {
    const exercises: WorkoutExercise[] = [];
    
    if (availableEquipment.includes('Treadmill')) {
      exercises.push({ ...EXERCISE_DATABASE[7] }); // Treadmill Intervals
    }
    
    if (availableEquipment.includes('Jump Rope')) {
      exercises.push({ ...EXERCISE_DATABASE[8] }); // Jump Rope HIIT
    }
    
    if (availableEquipment.includes('Stationary Bike')) {
      exercises.push({
        id: 'ex-bike',
        name: 'Cycling Intervals',
        duration: 1200,
        equipment: 'Stationary Bike',
        instructions: ['5 min warm-up', '30 sec sprint', '90 sec recovery', 'Repeat 8 times', 'Cool down'],
        targetMuscles: ['cardiovascular', 'quadriceps'],
        difficulty: 'intermediate'
      });
    }
    
    return {
      id: `workout-cardio-${Date.now()}`,
      name: 'Cardio Blast',
      description: `High-energy cardio workout to boost endurance and burn calories`,
      requiredEquipment: availableEquipment.filter(eq => 
        ['Treadmill', 'Stationary Bike', 'Jump Rope', 'Rowing Machine'].includes(eq)
      ),
      duration,
      difficulty,
      targetMuscles: ['cardiovascular'],
      exercises,
      caloriesBurned: Math.round(duration * 10),
      workoutType: 'cardio',
      spaceRequired: 'moderate',
      aiGenerated: true
    };
  }
  
  // Generate bodyweight cardio workout
  private static generateBodyweightCardioWorkout(
    duration: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): EquipmentBasedWorkout {
    const exercises: WorkoutExercise[] = [
      {
        id: 'ex-jumping-jacks',
        name: 'Jumping Jacks',
        duration: 60,
        sets: 3,
        rest: 30,
        instructions: ['Jump feet apart while raising arms', 'Jump back to start'],
        targetMuscles: ['cardiovascular'],
        difficulty: 'beginner'
      },
      {
        id: 'ex-mountain-climbers',
        name: 'Mountain Climbers',
        duration: 45,
        sets: 3,
        rest: 30,
        instructions: ['Plank position', 'Drive knees to chest alternating'],
        targetMuscles: ['cardiovascular', 'core'],
        difficulty: 'intermediate'
      },
      { ...EXERCISE_DATABASE[2] }, // Burpees
      {
        id: 'ex-high-knees',
        name: 'High Knees',
        duration: 45,
        sets: 3,
        rest: 30,
        instructions: ['Run in place', 'Bring knees up high'],
        targetMuscles: ['cardiovascular', 'hip flexors'],
        difficulty: 'beginner'
      }
    ];
    
    return {
      id: `workout-bodyweight-cardio-${Date.now()}`,
      name: 'No-Equipment Cardio Crusher',
      description: `High-intensity bodyweight cardio workout you can do anywhere`,
      requiredEquipment: [],
      noEquipmentAlternative: true,
      duration,
      difficulty,
      targetMuscles: ['cardiovascular', 'full body'],
      exercises,
      caloriesBurned: Math.round(duration * 9),
      workoutType: 'cardio',
      spaceRequired: 'minimal',
      aiGenerated: true
    };
  }
  
  // Generate HIIT workout
  private static generateHIITWorkout(
    availableEquipment: string[],
    duration: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): EquipmentBasedWorkout {
    const exercises: WorkoutExercise[] = [];
    
    // Mix of cardio and strength exercises for HIIT
    exercises.push(
      { ...EXERCISE_DATABASE[2], duration: 45, rest: 15 }, // Burpees
      {
        id: 'ex-squat-jumps',
        name: 'Squat Jumps',
        duration: 30,
        rest: 15,
        instructions: ['Squat and jump explosively'],
        targetMuscles: ['quadriceps', 'glutes'],
        difficulty: 'intermediate'
      }
    );
    
    if (availableEquipment.includes('Dumbbells')) {
      exercises.push({
        id: 'ex-db-thrusters',
        name: 'Dumbbell Thrusters',
        duration: 45,
        rest: 15,
        weight: 15,
        equipment: 'Dumbbells',
        instructions: ['Squat with dumbbells', 'Stand and press overhead'],
        targetMuscles: ['full body'],
        difficulty: 'intermediate'
      });
    }
    
    if (availableEquipment.includes('Kettlebell')) {
      exercises.push({
        id: 'ex-kb-swings',
        name: 'Kettlebell Swings',
        duration: 30,
        rest: 15,
        equipment: 'Kettlebell',
        instructions: ['Hinge and swing kettlebell to eye level'],
        targetMuscles: ['glutes', 'hamstrings', 'core'],
        difficulty: 'intermediate'
      });
    }
    
    // Repeat circuit based on duration
    const circuitTime = exercises.reduce((sum, ex) => sum + (ex.duration || 0) + (ex.rest || 0), 0) / 60;
    const rounds = Math.floor(duration / circuitTime);
    
    return {
      id: `workout-hiit-${Date.now()}`,
      name: 'HIIT Inferno',
      description: `High-intensity interval training for maximum calorie burn`,
      requiredEquipment: availableEquipment,
      duration,
      difficulty,
      targetMuscles: ['full body'],
      exercises: exercises.map(ex => ({ ...ex, sets: rounds })),
      caloriesBurned: Math.round(duration * 12),
      workoutType: 'hiit',
      spaceRequired: 'minimal',
      aiGenerated: true
    };
  }
  
  // Generate flexibility workout
  private static generateFlexibilityWorkout(
    duration: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): EquipmentBasedWorkout {
    const exercises: WorkoutExercise[] = [
      {
        id: 'ex-cat-cow',
        name: 'Cat-Cow Stretch',
        duration: 60,
        sets: 3,
        instructions: ['Arch and round spine alternately'],
        targetMuscles: ['back', 'core'],
        difficulty: 'beginner'
      },
      {
        id: 'ex-downward-dog',
        name: 'Downward Dog',
        duration: 90,
        sets: 3,
        instructions: ['Form inverted V shape', 'Press hands and feet into ground'],
        targetMuscles: ['hamstrings', 'shoulders', 'calves'],
        difficulty: 'beginner'
      },
      {
        id: 'ex-pigeon',
        name: 'Pigeon Pose',
        duration: 120,
        sets: 2,
        instructions: ['One leg forward bent', 'Other leg extended back', 'Hold each side'],
        targetMuscles: ['hips', 'glutes'],
        difficulty: 'intermediate'
      },
      {
        id: 'ex-forward-fold',
        name: 'Forward Fold',
        duration: 90,
        sets: 3,
        instructions: ['Hinge at hips', 'Let arms hang', 'Relax neck'],
        targetMuscles: ['hamstrings', 'back'],
        difficulty: 'beginner'
      }
    ];
    
    return {
      id: `workout-flexibility-${Date.now()}`,
      name: 'Flexibility Flow',
      description: `Stretching and mobility workout for improved flexibility`,
      requiredEquipment: ['Yoga Mat'],
      optionalEquipment: ['Foam Roller'],
      duration,
      difficulty,
      targetMuscles: ['full body'],
      exercises,
      caloriesBurned: Math.round(duration * 3),
      workoutType: 'flexibility',
      spaceRequired: 'minimal',
      aiGenerated: true
    };
  }
  
  // Generate hybrid workout combining different types
  private static generateHybridWorkout(
    availableEquipment: string[],
    duration: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): EquipmentBasedWorkout {
    const exercises: WorkoutExercise[] = [];
    
    // Warm-up with cardio
    exercises.push({
      id: 'ex-warmup',
      name: 'Dynamic Warm-up',
      duration: 300,
      instructions: ['Jumping jacks', 'Arm circles', 'Leg swings', 'Light jogging'],
      targetMuscles: ['full body'],
      difficulty: 'beginner'
    });
    
    // Add strength exercises
    if (availableEquipment.includes('Dumbbells')) {
      exercises.push(
        { ...EXERCISE_DATABASE[3], sets: 3 }, // DB Chest Press
        { ...EXERCISE_DATABASE[4], sets: 3 }  // DB Rows
      );
    } else {
      exercises.push(
        { ...EXERCISE_DATABASE[0], sets: 3 }, // Push-ups
        { ...EXERCISE_DATABASE[1], sets: 3 }  // Squats
      );
    }
    
    // Add HIIT section
    exercises.push(
      { ...EXERCISE_DATABASE[2], sets: 2, reps: '8-10' } // Burpees
    );
    
    // Cool-down with flexibility
    exercises.push({
      id: 'ex-cooldown',
      name: 'Static Stretching',
      duration: 300,
      instructions: ['Hold each stretch 30 seconds', 'Focus on worked muscles'],
      targetMuscles: ['full body'],
      difficulty: 'beginner'
    });
    
    return {
      id: `workout-hybrid-${Date.now()}`,
      name: 'Total Body Transformation',
      description: `Complete workout combining cardio, strength, and flexibility`,
      requiredEquipment: availableEquipment,
      duration,
      difficulty,
      targetMuscles: ['full body'],
      exercises,
      caloriesBurned: Math.round(duration * 8),
      workoutType: 'hybrid',
      spaceRequired: 'moderate',
      aiGenerated: true
    };
  }
  
  // Get equipment alternatives for exercises
  static getEquipmentAlternatives(equipment: string): string[] {
    const eq = EQUIPMENT_DATABASE.find(e => e.name === equipment);
    return eq?.alternatives || [];
  }
  
  // Calculate workout intensity based on user fitness level
  static calculateWorkoutIntensity(
    workout: EquipmentBasedWorkout,
    userFitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): {
    adjustedSets: number;
    adjustedReps: string;
    adjustedRest: number;
    adjustedWeight?: number;
  } {
    const levelMultipliers = {
      beginner: { sets: 0.7, reps: 0.8, rest: 1.3, weight: 0.6 },
      intermediate: { sets: 1, reps: 1, rest: 1, weight: 1 },
      advanced: { sets: 1.2, reps: 1.2, rest: 0.8, weight: 1.3 },
      expert: { sets: 1.4, reps: 1.3, rest: 0.7, weight: 1.5 }
    };
    
    const multiplier = levelMultipliers[userFitnessLevel];
    
    return {
      adjustedSets: Math.round(3 * multiplier.sets),
      adjustedReps: '10-15',
      adjustedRest: Math.round(60 * multiplier.rest),
      adjustedWeight: 20 * multiplier.weight
    };
  }
  
  // Suggest equipment based on goals and space
  static suggestEquipment(
    goals: string[],
    spaceAvailable: 'minimal' | 'moderate' | 'large',
    budget?: 'low' | 'medium' | 'high'
  ): Equipment[] {
    let suggestions: Equipment[] = [];
    
    // Always suggest bodyweight as it's free
    suggestions.push(EQUIPMENT_DATABASE[0]);
    
    // Based on goals
    if (goals.includes('strength')) {
      suggestions.push(
        EQUIPMENT_DATABASE[5], // Dumbbells
        EQUIPMENT_DATABASE[9]  // Resistance Bands
      );
      if (spaceAvailable !== 'minimal' && budget !== 'low') {
        suggestions.push(EQUIPMENT_DATABASE[6]); // Barbell
      }
    }
    
    if (goals.includes('cardio')) {
      suggestions.push(EQUIPMENT_DATABASE[3]); // Jump Rope
      if (spaceAvailable !== 'minimal' && budget !== 'low') {
        suggestions.push(EQUIPMENT_DATABASE[2]); // Stationary Bike
      }
    }
    
    if (goals.includes('flexibility')) {
      suggestions.push(
        EQUIPMENT_DATABASE[11], // Yoga Mat
        EQUIPMENT_DATABASE[12]  // Foam Roller
      );
    }
    
    // Remove duplicates
    return Array.from(new Set(suggestions));
  }
}

export default WorkoutAIService;
