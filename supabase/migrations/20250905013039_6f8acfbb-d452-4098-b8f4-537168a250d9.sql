-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  age INTEGER,
  weight_kg DECIMAL(5,2),
  height_cm INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  fitness_goal TEXT CHECK (fitness_goal IN ('weight_loss', 'muscle_gain', 'endurance', 'general_health')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active')),
  dietary_preference TEXT CHECK (dietary_preference IN ('vegetarian', 'vegan', 'keto', 'paleo', 'no_restrictions')),
  food_allergies TEXT[],
  workout_equipment TEXT CHECK (workout_equipment IN ('none', 'basic', 'gym_access', 'home_gym')),
  workout_preferences TEXT[],
  bmr DECIMAL(7,2),
  tdee DECIMAL(7,2),
  target_calories DECIMAL(7,2),
  target_protein_g DECIMAL(6,2),
  target_carbs_g DECIMAL(6,2),
  target_fat_g DECIMAL(6,2),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create progress tracking table
CREATE TABLE public.progress_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for progress entries
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for progress entries
CREATE POLICY "Users can view their own progress" 
ON public.progress_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress entries" 
ON public.progress_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress entries" 
ON public.progress_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress entries" 
ON public.progress_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create workout sessions table
CREATE TABLE public.workout_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_name TEXT NOT NULL,
  workout_type TEXT CHECK (workout_type IN ('strength', 'cardio', 'yoga', 'mixed')),
  duration_minutes INTEGER,
  calories_burned INTEGER,
  exercises JSONB,
  completed BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for workout sessions
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for workout sessions
CREATE POLICY "Users can view their own workouts" 
ON public.workout_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workouts" 
ON public.workout_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" 
ON public.workout_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create meal plans table
CREATE TABLE public.meal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  breakfast JSONB,
  lunch JSONB,
  dinner JSONB,
  snacks JSONB,
  total_calories DECIMAL(7,2),
  total_protein_g DECIMAL(6,2),
  total_carbs_g DECIMAL(6,2),
  total_fat_g DECIMAL(6,2),
  meals_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for meal plans
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for meal plans
CREATE POLICY "Users can view their own meal plans" 
ON public.meal_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal plans" 
ON public.meal_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans" 
ON public.meal_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at
BEFORE UPDATE ON public.meal_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();