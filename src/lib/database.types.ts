export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          is_premium: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          is_premium?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          is_premium?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          description: string | null
          prompt_count: number
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          description?: string | null
          prompt_count?: number
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          description?: string | null
          prompt_count?: number
          display_order?: number
          created_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          description: string
          prompt_text: string
          example_output: string | null
          platform: string
          category_id: string | null
          tags: string[]
          difficulty: 'Easy' | 'Medium' | 'Hard'
          author_id: string | null
          author_name: string
          views_count: number
          copies_count: number
          favorites_count: number
          rating_avg: number
          rating_count: number
          comments_count: number
          is_premium: boolean
          is_featured: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          prompt_text: string
          example_output?: string | null
          platform: string
          category_id?: string | null
          tags?: string[]
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          author_id?: string | null
          author_name: string
          views_count?: number
          copies_count?: number
          favorites_count?: number
          rating_avg?: number
          rating_count?: number
          comments_count?: number
          is_premium?: boolean
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          prompt_text?: string
          example_output?: string | null
          platform?: string
          category_id?: string | null
          tags?: string[]
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          author_id?: string | null
          author_name?: string
          views_count?: number
          copies_count?: number
          favorites_count?: number
          rating_avg?: number
          rating_count?: number
          comments_count?: number
          is_premium?: boolean
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      prompt_comments: {
        Row: {
          id: string
          prompt_id: string
          user_id: string
          content: string
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          user_id: string
          content: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          user_id?: string
          content?: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      prompt_ratings: {
        Row: {
          id: string
          prompt_id: string
          user_id: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          user_id: string
          rating: number
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          user_id?: string
          rating?: number
          created_at?: string
        }
      }
      prompt_favorites: {
        Row: {
          id: string
          prompt_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          user_id?: string
          created_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
          prompts_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
          prompts_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          prompts_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      collection_prompts: {
        Row: {
          id: string
          collection_id: string
          prompt_id: string
          added_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          prompt_id: string
          added_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          prompt_id?: string
          added_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'free' | 'pro' | 'enterprise'
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'free' | 'pro' | 'enterprise'
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'free' | 'pro' | 'enterprise'
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          id?: string
          email: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_active?: boolean
          subscribed_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          achieved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          achieved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          achieved_at?: string
        }
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
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Prompt = Database['public']['Tables']['prompts']['Row']
export type PromptComment = Database['public']['Tables']['prompt_comments']['Row']
export type PromptRating = Database['public']['Tables']['prompt_ratings']['Row']
export type PromptFavorite = Database['public']['Tables']['prompt_favorites']['Row']
export type Collection = Database['public']['Tables']['collections']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row']
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row']

export type PromptWithCategory = Prompt & {
  categories: Category | null
}

export type PromptWithDetails = Prompt & {
  categories: Category | null
  user_rating?: number
  is_favorited?: boolean
}
