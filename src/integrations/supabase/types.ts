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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          email: string
          favorite_music: string | null
          gear_capacity: number | null
          gear_storage: string | null
          id: string
          license_plate: string | null
          major: string | null
          name: string
          passenger_capacity: number | null
          phone: string | null
          rating: number | null
          role: string
          school: string
          signup_waiver_accepted_at: string | null
          sport_preference: string | null
          total_rides: number | null
          updated_at: string
          user_id: string
          vehicle_color: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_year: number | null
          year_in_school: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email: string
          favorite_music?: string | null
          gear_capacity?: number | null
          gear_storage?: string | null
          id?: string
          license_plate?: string | null
          major?: string | null
          name: string
          passenger_capacity?: number | null
          phone?: string | null
          rating?: number | null
          role?: string
          school: string
          signup_waiver_accepted_at?: string | null
          sport_preference?: string | null
          total_rides?: number | null
          updated_at?: string
          user_id: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: number | null
          year_in_school?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          favorite_music?: string | null
          gear_capacity?: number | null
          gear_storage?: string | null
          id?: string
          license_plate?: string | null
          major?: string | null
          name?: string
          passenger_capacity?: number | null
          phone?: string | null
          rating?: number | null
          role?: string
          school?: string
          signup_waiver_accepted_at?: string | null
          sport_preference?: string | null
          total_rides?: number | null
          updated_at?: string
          user_id?: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: number | null
          year_in_school?: string | null
        }
        Relationships: []
      }
      ride_notifications: {
        Row: {
          acknowledged_at: string | null
          id: string
          notification_type: string
          ride_id: string
          sent_at: string
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          id?: string
          notification_type: string
          ride_id: string
          sent_at?: string
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          id?: string
          notification_type?: string
          ride_id?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_notifications_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_requests: {
        Row: {
          confirmed_present: boolean | null
          created_at: string
          id: string
          marked_no_show: boolean | null
          message: string | null
          no_show_action: string | null
          ride_id: string
          rider_id: string
          rider_waiver_accepted_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          confirmed_present?: boolean | null
          created_at?: string
          id?: string
          marked_no_show?: boolean | null
          message?: string | null
          no_show_action?: string | null
          ride_id: string
          rider_id: string
          rider_waiver_accepted_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          confirmed_present?: boolean | null
          created_at?: string
          id?: string
          marked_no_show?: boolean | null
          message?: string | null
          no_show_action?: string | null
          ride_id?: string
          rider_id?: string
          rider_waiver_accepted_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_requests_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          actual_return_time: string | null
          cost_per_rider: number
          created_at: string
          departure_date: string
          departure_location: string
          departure_time: string
          destination: string
          driver_id: string
          driver_waiver_accepted_at: string | null
          gear_capacity: number
          id: string
          lifecycle_status: Database["public"]["Enums"]["ride_lifecycle_status"]
          notes: string | null
          pickup_confirmed_at: string | null
          return_date: string
          return_ended_at: string | null
          return_started_at: string | null
          return_time: string
          ride_ended_at: string | null
          ride_started_at: string | null
          seats_available: number
          seats_total: number
          status: string
          updated_at: string
        }
        Insert: {
          actual_return_time?: string | null
          cost_per_rider?: number
          created_at?: string
          departure_date: string
          departure_location: string
          departure_time: string
          destination: string
          driver_id: string
          driver_waiver_accepted_at?: string | null
          gear_capacity?: number
          id?: string
          lifecycle_status?: Database["public"]["Enums"]["ride_lifecycle_status"]
          notes?: string | null
          pickup_confirmed_at?: string | null
          return_date: string
          return_ended_at?: string | null
          return_started_at?: string | null
          return_time: string
          ride_ended_at?: string | null
          ride_started_at?: string | null
          seats_available?: number
          seats_total?: number
          status?: string
          updated_at?: string
        }
        Update: {
          actual_return_time?: string | null
          cost_per_rider?: number
          created_at?: string
          departure_date?: string
          departure_location?: string
          departure_time?: string
          destination?: string
          driver_id?: string
          driver_waiver_accepted_at?: string | null
          gear_capacity?: number
          id?: string
          lifecycle_status?: Database["public"]["Enums"]["ride_lifecycle_status"]
          notes?: string | null
          pickup_confirmed_at?: string | null
          return_date?: string
          return_ended_at?: string | null
          return_started_at?: string | null
          return_time?: string
          ride_ended_at?: string | null
          ride_started_at?: string | null
          seats_available?: number
          seats_total?: number
          status?: string
          updated_at?: string
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
      ride_lifecycle_status:
        | "scheduled"
        | "pickup_window"
        | "in_progress"
        | "return_window"
        | "completed"
        | "cancelled"
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
    Enums: {
      ride_lifecycle_status: [
        "scheduled",
        "pickup_window",
        "in_progress",
        "return_window",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
