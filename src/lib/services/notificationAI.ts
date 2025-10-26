// Advanced notification and recommendation service

import {
  NotificationTemplate,
  ScheduledNotification,
  AIRecommendation,
  Achievement,
  Challenge,
  ProgressAnalytics
} from '@/types/advanced-fitness';

// Notification templates database
const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  // Meal Reminders
  {
    id: 'nt-meal-breakfast',
    type: 'meal',
    title: '🌅 Breakfast Time!',
    message: 'Start your day with a nutritious breakfast. You need {{calories}} calories to meet your goals.',
    action: { label: 'Log Meal', route: '/meals' },
    priority: 'high'
  },
  {
    id: 'nt-meal-lunch',
    type: 'meal',
    title: '🍽️ Lunch Break',
    message: 'Time to refuel! Remember to include {{protein}}g of protein.',
    action: { label: 'Quick Add', route: '/meals' },
    priority: 'high'
  },
  {
    id: 'nt-meal-dinner',
    type: 'meal',
    title: '🌙 Dinner Time',
    message: 'Complete your day with a balanced dinner. {{calories}} calories remaining.',
    action: { label: 'Find Recipes', route: '/meals' },
    priority: 'high'
  },
  
  // Workout Reminders
  {
    id: 'nt-workout-morning',
    type: 'workout',
    title: '💪 Morning Workout',
    message: "Let's crush today's {{workoutType}} session! {{duration}} minutes to greatness.",
    action: { label: 'Start Workout', route: '/workouts' },
    priority: 'high'
  },
  {
    id: 'nt-workout-evening',
    type: 'workout',
    title: '🏃 Evening Exercise',
    message: 'Perfect time for your workout! Your body is primed for peak performance.',
    action: { label: 'Begin', route: '/workouts' },
    priority: 'medium'
  },
  
  // Water Reminders
  {
    id: 'nt-water',
    type: 'water',
    title: '💧 Hydration Check',
    message: 'Time to drink water! {{remaining}} glasses left for today.',
    action: { label: 'Log Water', route: '/dashboard' },
    priority: 'low'
  },
  
  // Progress Updates
  {
    id: 'nt-progress-daily',
    type: 'progress',
    title: '📊 Daily Summary',
    message: "Great job today! You've completed {{percentage}}% of your goals.",
    action: { label: 'View Details', route: '/dashboard' },
    priority: 'medium'
  },
  {
    id: 'nt-progress-streak',
    type: 'progress',
    title: '🔥 Streak Alert!',
    message: "Amazing! You're on a {{days}}-day streak. Keep the momentum!",
    priority: 'high'
  },
  
  // Motivational Messages
  {
    id: 'nt-motivation-morning',
    type: 'motivation',
    title: '☀️ Rise and Shine',
    message: 'Today is your opportunity to build the tomorrow you want. Make it count!',
    priority: 'low'
  },
  {
    id: 'nt-motivation-challenge',
    type: 'motivation',
    title: '🚀 Challenge Yourself',
    message: "You're stronger than you think. Push beyond your limits today!",
    priority: 'low'
  },
  
  // Achievement Notifications
  {
    id: 'nt-achievement',
    type: 'achievement',
    title: '🏆 Achievement Unlocked!',
    message: "Congratulations! You've earned: {{achievementName}}",
    action: { label: 'View Trophy', route: '/profile' },
    priority: 'high'
  }
];

// Achievement definitions
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-workout',
    name: 'First Steps',
    description: 'Complete your first workout',
    category: 'workout',
    tier: 'bronze',
    points: 10,
    requirements: [{ type: 'workouts_completed', value: 1, operator: 'equals' }]
  },
  {
    id: 'ach-week-streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    category: 'consistency',
    tier: 'silver',
    points: 50,
    requirements: [{ type: 'streak_days', value: 7, operator: 'greater' }]
  },
  {
    id: 'ach-nutrition-master',
    name: 'Nutrition Master',
    description: 'Hit your macro goals for 30 days',
    category: 'nutrition',
    tier: 'gold',
    points: 100,
    requirements: [{ type: 'nutrition_goal_days', value: 30, operator: 'greater' }]
  },
  {
    id: 'ach-100-workouts',
    name: 'Century Club',
    description: 'Complete 100 workouts',
    category: 'milestone',
    tier: 'platinum',
    points: 500,
    requirements: [{ type: 'total_workouts', value: 100, operator: 'greater' }],
    rewards: [{ type: 'badge', value: 'century-warrior' }]
  },
  {
    id: 'ach-weight-goal',
    name: 'Goal Crusher',
    description: 'Reach your target weight',
    category: 'milestone',
    tier: 'gold',
    points: 200,
    requirements: [{ type: 'weight_goal_reached', value: true, operator: 'equals' }]
  }
];

// Challenge templates
const CHALLENGES: Challenge[] = [
  {
    id: 'ch-30day-fitness',
    name: '30-Day Fitness Revolution',
    description: 'Transform your body with daily workouts for 30 days',
    type: 'personal',
    category: 'workout',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    rules: [
      'Complete at least 20 minutes of exercise daily',
      'Log all workouts in the app',
      'Rest days count with active recovery'
    ],
    progress: [],
    status: 'active'
  },
  {
    id: 'ch-hydration',
    name: 'Hydration Hero',
    description: 'Drink 8 glasses of water daily for 2 weeks',
    type: 'community',
    category: 'habit',
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    rules: ['Drink at least 8 glasses of water per day', 'Log water intake daily'],
    progress: [],
    status: 'active'
  },
  {
    id: 'ch-protein-power',
    name: 'Protein Power Week',
    description: 'Hit your protein goals every day for a week',
    type: 'personal',
    category: 'nutrition',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    rules: ['Meet or exceed daily protein target', 'Log all meals'],
    progress: [],
    status: 'upcoming'
  }
];

export class NotificationAIService {
  // Schedule smart notifications based on user preferences and habits
  static scheduleSmartNotifications(
    userId: string,
    preferences: {
      mealTimes: { breakfast: string; lunch: string; dinner: string };
      workoutTime: string;
      waterReminders: boolean;
      motivationalMessages: boolean;
    },
    userStats: any
  ): ScheduledNotification[] {
    const notifications: ScheduledNotification[] = [];
    const now = new Date();
    
    // Schedule meal reminders
    if (preferences.mealTimes) {
      ['breakfast', 'lunch', 'dinner'].forEach((meal) => {
        const time = preferences.mealTimes[meal as keyof typeof preferences.mealTimes];
        if (time) {
          const [hours, minutes] = time.split(':').map(Number);
          const scheduledTime = new Date(now);
          scheduledTime.setHours(hours, minutes, 0, 0);
          
          if (scheduledTime < now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }
          
          notifications.push({
            id: `sn-${meal}-${Date.now()}`,
            templateId: `nt-meal-${meal}`,
            scheduledTime,
            recurring: { frequency: 'daily' },
            delivered: false,
            read: false,
            userId
          });
        }
      });
    }
    
    // Schedule workout reminder
    if (preferences.workoutTime) {
      const [hours, minutes] = preferences.workoutTime.split(':').map(Number);
      const scheduledTime = new Date(now);
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      notifications.push({
        id: `sn-workout-${Date.now()}`,
        templateId: hours < 12 ? 'nt-workout-morning' : 'nt-workout-evening',
        scheduledTime,
        recurring: { frequency: 'daily' },
        delivered: false,
        read: false,
        userId
      });
    }
    
    // Schedule water reminders (every 2 hours during waking hours)
    if (preferences.waterReminders) {
      for (let hour = 9; hour <= 21; hour += 2) {
        const scheduledTime = new Date(now);
        scheduledTime.setHours(hour, 0, 0, 0);
        
        if (scheduledTime < now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
        
        notifications.push({
          id: `sn-water-${hour}-${Date.now()}`,
          templateId: 'nt-water',
          scheduledTime,
          recurring: { frequency: 'daily' },
          delivered: false,
          read: false,
          userId
        });
      }
    }
    
    // Schedule daily progress summary (9 PM)
    const progressTime = new Date(now);
    progressTime.setHours(21, 0, 0, 0);
    if (progressTime < now) {
      progressTime.setDate(progressTime.getDate() + 1);
    }
    
    notifications.push({
      id: `sn-progress-${Date.now()}`,
      templateId: 'nt-progress-daily',
      scheduledTime: progressTime,
      recurring: { frequency: 'daily' },
      delivered: false,
      read: false,
      userId
    });
    
    // Schedule motivational messages
    if (preferences.motivationalMessages) {
      const motivationTime = new Date(now);
      motivationTime.setHours(7, 0, 0, 0);
      if (motivationTime < now) {
        motivationTime.setDate(motivationTime.getDate() + 1);
      }
      
      notifications.push({
        id: `sn-motivation-${Date.now()}`,
        templateId: 'nt-motivation-morning',
        scheduledTime: motivationTime,
        recurring: { frequency: 'daily' },
        delivered: false,
        read: false,
        userId
      });
    }
    
    return notifications;
  }
  
  // Generate AI recommendations based on user data
  static generateRecommendations(
    userStats: any,
    progressData: ProgressAnalytics,
    recentActivity: any[]
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Analyze nutrition patterns
    if (progressData.metrics.nutrition.calorieGoalAdherence < 80) {
      recommendations.push({
        id: `rec-nutrition-${Date.now()}`,
        type: 'nutrition',
        title: 'Optimize Your Calorie Intake',
        description: 'Your calorie intake has been inconsistent. Try meal prepping to stay on track.',
        reason: `You're achieving only ${progressData.metrics.nutrition.calorieGoalAdherence}% of your calorie goals`,
        confidence: 0.85,
        priority: 'high',
        actionItems: [
          { label: 'View Meal Plans', action: 'navigate', data: '/meals' },
          { label: 'Set Meal Reminders', action: 'settings', data: 'notifications' }
        ],
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        basedOn: ['calorie_adherence', 'meal_consistency'],
        tags: ['nutrition', 'calories', 'meal-planning']
      });
    }
    
    // Analyze workout patterns
    if (progressData.metrics.workout.consistency < 70) {
      recommendations.push({
        id: `rec-workout-${Date.now()}`,
        type: 'workout',
        title: 'Boost Your Workout Consistency',
        description: 'You workout routine could be more consistent. Try scheduling specific workout times.',
        reason: `Workout consistency is at ${progressData.metrics.workout.consistency}%`,
        confidence: 0.9,
        priority: 'high',
        actionItems: [
          { label: 'Schedule Workouts', action: 'navigate', data: '/workouts' },
          { label: 'Join Challenge', action: 'challenge', data: 'ch-30day-fitness' }
        ],
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        basedOn: ['workout_frequency', 'schedule_gaps'],
        tags: ['workout', 'consistency', 'habits']
      });
    }
    
    // Protein intake optimization
    if (progressData.metrics.nutrition.macroBalance.protein < 25) {
      recommendations.push({
        id: `rec-protein-${Date.now()}`,
        type: 'nutrition',
        title: 'Increase Protein Intake',
        description: 'Your protein intake is below optimal levels for muscle growth and recovery.',
        reason: `Protein makes up only ${progressData.metrics.nutrition.macroBalance.protein}% of your diet`,
        confidence: 0.88,
        priority: 'medium',
        actionItems: [
          { label: 'High-Protein Recipes', action: 'filter', data: { tag: 'high-protein' } },
          { label: 'Protein Tracker', action: 'navigate', data: '/nutrition' }
        ],
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        basedOn: ['macro_distribution', 'fitness_goals'],
        tags: ['protein', 'macros', 'muscle-building']
      });
    }
    
    // Hydration improvement
    if (progressData.metrics.habits.waterIntake < 6) {
      recommendations.push({
        id: `rec-water-${Date.now()}`,
        type: 'lifestyle',
        title: 'Improve Hydration Habits',
        description: 'Proper hydration boosts performance and aids recovery.',
        reason: `Average water intake is only ${progressData.metrics.habits.waterIntake} glasses per day`,
        confidence: 0.92,
        priority: 'medium',
        actionItems: [
          { label: 'Set Water Reminders', action: 'settings', data: 'water_reminders' },
          { label: 'Join Hydration Challenge', action: 'challenge', data: 'ch-hydration' }
        ],
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        basedOn: ['water_intake', 'daily_logs'],
        tags: ['hydration', 'health', 'habits']
      });
    }
    
    // Progressive overload suggestion
    if (progressData.metrics.workout.totalWorkouts > 20) {
      recommendations.push({
        id: `rec-progression-${Date.now()}`,
        type: 'workout',
        title: 'Time to Level Up',
        description: "You've been consistent! Consider increasing workout intensity or duration.",
        reason: `You've completed ${progressData.metrics.workout.totalWorkouts} workouts`,
        confidence: 0.87,
        priority: 'low',
        actionItems: [
          { label: 'Advanced Workouts', action: 'filter', data: { difficulty: 'advanced' } },
          { label: 'Update Goals', action: 'navigate', data: '/profile' }
        ],
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        basedOn: ['workout_count', 'consistency', 'duration'],
        tags: ['progression', 'advanced', 'intensity']
      });
    }
    
    // Recovery suggestion
    if (progressData.metrics.workout.totalMinutes > 300 && progressData.metrics.habits.streaks.current > 5) {
      recommendations.push({
        id: `rec-recovery-${Date.now()}`,
        type: 'lifestyle',
        title: 'Prioritize Recovery',
        description: "You've been training hard! Schedule a recovery day or light stretching session.",
        reason: `${progressData.metrics.workout.totalMinutes} minutes trained this week`,
        confidence: 0.83,
        priority: 'medium',
        actionItems: [
          { label: 'Recovery Workouts', action: 'filter', data: { type: 'flexibility' } },
          { label: 'Rest Day Tips', action: 'navigate', data: '/learn' }
        ],
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        basedOn: ['training_volume', 'streak_length'],
        tags: ['recovery', 'rest', 'injury-prevention']
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  // Check and award achievements
  static checkAchievements(
    userStats: any,
    progressData: ProgressAnalytics
  ): Achievement[] {
    const unlockedAchievements: Achievement[] = [];
    
    ACHIEVEMENTS.forEach(achievement => {
      let unlocked = true;
      
      achievement.requirements.forEach(req => {
        switch (req.type) {
          case 'workouts_completed':
            if (req.operator === 'equals' && progressData.metrics.workout.totalWorkouts !== req.value) {
              unlocked = false;
            } else if (req.operator === 'greater' && progressData.metrics.workout.totalWorkouts <= req.value) {
              unlocked = false;
            }
            break;
            
          case 'streak_days':
            if (req.operator === 'greater' && progressData.metrics.habits.streaks.current <= req.value) {
              unlocked = false;
            }
            break;
            
          case 'nutrition_goal_days':
            // Check nutrition consistency
            if (progressData.metrics.nutrition.mealConsistency < 90) {
              unlocked = false;
            }
            break;
            
          case 'total_workouts':
            if (progressData.metrics.workout.totalWorkouts <= req.value) {
              unlocked = false;
            }
            break;
            
          default:
            break;
        }
      });
      
      if (unlocked && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date();
        unlockedAchievements.push(achievement);
      }
    });
    
    return unlockedAchievements;
  }
  
  // Get active challenges for user
  static getActiveChallenges(): Challenge[] {
    return CHALLENGES.filter(challenge => challenge.status === 'active');
  }
  
  // Update challenge progress
  static updateChallengeProgress(
    challengeId: string,
    userId: string,
    progress: number
  ): Challenge | null {
    const challenge = CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return null;
    
    const userProgress = challenge.progress.find(p => p.userId === userId);
    if (userProgress) {
      userProgress.current = progress;
    } else {
      challenge.progress.push({
        userId,
        current: progress,
        target: 100 // Default target percentage
      });
    }
    
    // Update leaderboard if community challenge
    if (challenge.type === 'community' && challenge.leaderboard) {
      challenge.leaderboard = challenge.progress
        .map(p => ({
          userId: p.userId,
          score: p.current,
          rank: 0
        }))
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
    }
    
    return challenge;
  }
  
  // Generate motivational message based on context
  static generateMotivationalMessage(
    context: 'morning' | 'pre-workout' | 'post-workout' | 'evening' | 'achievement',
    userStats?: any
  ): string {
    const messages = {
      morning: [
        "Rise and conquer! Today's efforts become tomorrow's strengths.",
        "Every sunrise is a new opportunity to become your best self.",
        "Champions are made in the morning. Let's build greatness!",
        "Your future self will thank you for starting strong today."
      ],
      'pre-workout': [
        "Time to unleash your inner warrior!",
        "Pain is temporary, but the pride of accomplishment lasts forever.",
        "Your only competition is who you were yesterday.",
        "Let's turn sweat into strength and determination into results!"
      ],
      'post-workout': [
        "Crushed it! Every rep brought you closer to your goals.",
        "That's how champions train! Recovery now, stronger tomorrow.",
        "You just proved that limits exist only in the mind.",
        "Workout complete! You're building an unstoppable version of yourself."
      ],
      evening: [
        "Reflect on today's wins and prepare for tomorrow's victories.",
        "Rest well, champion. Recovery is where the magic happens.",
        "You gave it your all today. Be proud of your dedication.",
        "Another day closer to your goals. Keep the momentum going!"
      ],
      achievement: [
        "Outstanding! You've just leveled up in your fitness journey!",
        "Achievement unlocked! Your consistency is paying off big time!",
        "Legendary performance! You're rewriting your limits!",
        "Incredible milestone! This is what dedication looks like!"
      ]
    };
    
    const contextMessages = messages[context];
    return contextMessages[Math.floor(Math.random() * contextMessages.length)];
  }
  
  // Calculate notification timing optimization
  static optimizeNotificationTiming(
    userActivity: { timestamp: Date; type: string }[],
    preferredTimes: { [key: string]: string }
  ): { [key: string]: string } {
    const optimizedTimes = { ...preferredTimes };
    
    // Analyze user activity patterns
    const activityByHour: { [hour: number]: number } = {};
    userActivity.forEach(activity => {
      const hour = activity.timestamp.getHours();
      activityByHour[hour] = (activityByHour[hour] || 0) + 1;
    });
    
    // Find peak activity hours
    const peakHours = Object.entries(activityByHour)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
    
    // Adjust notification times based on activity patterns
    if (peakHours.length > 0) {
      // Suggest workout time during peak activity
      const peakHour = peakHours[0];
      optimizedTimes.workout = `${peakHour.toString().padStart(2, '0')}:00`;
      
      // Schedule meals around peak activity
      if (peakHour < 12) {
        optimizedTimes.breakfast = `${Math.max(6, peakHour - 2).toString().padStart(2, '0')}:00`;
        optimizedTimes.lunch = '12:30';
        optimizedTimes.dinner = '18:30';
      } else if (peakHour < 17) {
        optimizedTimes.breakfast = '07:30';
        optimizedTimes.lunch = `${Math.max(12, peakHour - 1).toString().padStart(2, '0')}:00`;
        optimizedTimes.dinner = '19:00';
      } else {
        optimizedTimes.breakfast = '08:00';
        optimizedTimes.lunch = '12:30';
        optimizedTimes.dinner = `${Math.min(20, peakHour + 1).toString().padStart(2, '0')}:00`;
      }
    }
    
    return optimizedTimes;
  }
}

export default NotificationAIService;
