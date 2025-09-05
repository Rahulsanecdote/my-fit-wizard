export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      meal_plans: {
        Row: {
          breakfast: Json | null
          created_at: string
          dinner: Json | null
          id: string
          lunch: Json | null
          meals_completed: number | null
          plan_date: string
          snacks: Json | null
          total_calories: number | null
          total_carbs_g: number | null
          total_fat_g: number | null
          total_protein_g: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          breakfast?: Json | null
          created_at?: string
          dinner?: Json | null
          id?: string
          lunch?: Json | null
          meals_completed?: number | null
          plan_date: string
          snacks?: Json | null
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_protein_g?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          breakfast?: Json | null
          created_at?: string
          dinner?: Json | null
          id?: string
          lunch?: Json | null
          meals_completed?: number | null
          plan_date?: string
          snacks?: Json | null
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_protein_g?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          bmr: number | null
          created_at: string
          dietary_preference: string | null
          first_name: string | null
          fitness_goal: string | null
          food_allergies: string[] | null
          gender: string | null
          height_cm: number | null
          id: string
          last_name: string | null
          onboarding_completed: boolean | null
          target_calories: number | null
          target_carbs_g: number | null
          target_fat_g: number | null
          target_protein_g: number | null
          tdee: number | null
          updated_at: string
          user_id: string
          weight_kg: number | null
          workout_equipment: string | null
          workout_preferences: string[] | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          bmr?: number | null
          created_at?: string
          dietary_preference?: string | null
          first_name?: string | null
          fitness_goal?: string | null
          food_allergies?: string[] | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          target_calories?: number | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          target_protein_g?: number | null
          tdee?: number | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
          workout_equipment?: string | null
          workout_preferences?: string[] | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          bmr?: number | null
          created_at?: string
          dietary_preference?: string | null
          first_name?: string | null
          fitness_goal?: string | null
          food_allergies?: string[] | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          target_calories?: number | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          target_protein_g?: number | null
          tdee?: number | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
          workout_equipment?: string | null
          workout_preferences?: string[] | null
        }
        Relationships: []
      }
      progress_entries: {
        Row: {
          body_fat_percentage: number | null
          created_at: string
          id: string
          muscle_mass_kg: number | null
          notes: string | null
          recorded_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          created_at?: string
          id?: string
          muscle_mass_kg?: number | null
          notes?: string | null
          recorded_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          created_at?: string
          id?: string
          muscle_mass_kg?: number | null
          notes?: string | null
          recorded_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          calories_burned: number | null
          completed: boolean | null
          completed_at: string | null
          created_at: string
          duration_minutes: number | null
          exercises: Json | null
          id: string
          scheduled_for: string | null
          user_id: string
          workout_name: string
          workout_type: string | null
        }
        Insert: {
          calories_burned?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          exercises?: Json | null
          id?: string
          scheduled_for?: string | null
          user_id: string
          workout_name: string
          workout_type?: string | null
        }
        Update: {
          calories_burned?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          exercises?: Json | null
          id?: string
          scheduled_for?: string | null
          user_id?: string
          workout_name?: string
          workout_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
