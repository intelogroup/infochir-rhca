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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      article_authors: {
        Row: {
          article_id: string
          member_id: number
        }
        Insert: {
          article_id: string
          member_id: number
        }
        Update: {
          article_id?: string
          member_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "article_authors_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "adc_articles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_authors_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_authors_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "igm_articles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_authors_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "igm_issues_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_authors_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "igm_unified_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_authors_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "popular_articles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_authors_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "rhca_articles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_authors_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_authors_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      article_submissions: {
        Row: {
          abstract: string
          article_files_urls: string[] | null
          authors: string
          corresponding_author_address: string
          corresponding_author_email: string
          corresponding_author_name: string
          corresponding_author_phone: string
          created_at: string
          ethics_approval: boolean
          id: string
          image_annexes_urls: string[] | null
          institution: string
          keywords: string
          no_conflict: boolean
          notes: string | null
          original_work: boolean
          publication_type: string
          reviewer_comments: string | null
          status: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          abstract: string
          article_files_urls?: string[] | null
          authors: string
          corresponding_author_address: string
          corresponding_author_email: string
          corresponding_author_name: string
          corresponding_author_phone: string
          created_at?: string
          ethics_approval?: boolean
          id?: string
          image_annexes_urls?: string[] | null
          institution: string
          keywords: string
          no_conflict?: boolean
          notes?: string | null
          original_work?: boolean
          publication_type: string
          reviewer_comments?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          abstract?: string
          article_files_urls?: string[] | null
          authors?: string
          corresponding_author_address?: string
          corresponding_author_email?: string
          corresponding_author_name?: string
          corresponding_author_phone?: string
          created_at?: string
          ethics_approval?: boolean
          id?: string
          image_annexes_urls?: string[] | null
          institution?: string
          keywords?: string
          no_conflict?: boolean
          notes?: string | null
          original_work?: boolean
          publication_type?: string
          reviewer_comments?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          abstract: string
          article_files: string[] | null
          article_type: string | null
          author_affiliations: string[] | null
          authors: string[]
          category: string
          citations: number | null
          co_authors: string[] | null
          cover_image_filename: string | null
          created_at: string | null
          doi: string | null
          downloads: number | null
          funding_source: string | null
          id: string
          image_url: string
          institution: string | null
          issue: string | null
          keywords: string[] | null
          page_number: string | null
          pdf_filename: string | null
          pdf_url: string
          primary_author: string | null
          publication_date: string | null
          shares: number | null
          source: string
          specialty: string | null
          status: string
          supplementary_files: string[] | null
          tags: string[]
          title: string
          updated_at: string | null
          user_id: string | null
          views: number | null
          volume: string | null
        }
        Insert: {
          abstract: string
          article_files?: string[] | null
          article_type?: string | null
          author_affiliations?: string[] | null
          authors?: string[]
          category: string
          citations?: number | null
          co_authors?: string[] | null
          cover_image_filename?: string | null
          created_at?: string | null
          doi?: string | null
          downloads?: number | null
          funding_source?: string | null
          id?: string
          image_url?: string
          institution?: string | null
          issue?: string | null
          keywords?: string[] | null
          page_number?: string | null
          pdf_filename?: string | null
          pdf_url?: string
          primary_author?: string | null
          publication_date?: string | null
          shares?: number | null
          source: string
          specialty?: string | null
          status?: string
          supplementary_files?: string[] | null
          tags?: string[]
          title: string
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          volume?: string | null
        }
        Update: {
          abstract?: string
          article_files?: string[] | null
          article_type?: string | null
          author_affiliations?: string[] | null
          authors?: string[]
          category?: string
          citations?: number | null
          co_authors?: string[] | null
          cover_image_filename?: string | null
          created_at?: string | null
          doi?: string | null
          downloads?: number | null
          funding_source?: string | null
          id?: string
          image_url?: string
          institution?: string | null
          issue?: string | null
          keywords?: string[] | null
          page_number?: string | null
          pdf_filename?: string | null
          pdf_url?: string
          primary_author?: string | null
          publication_date?: string | null
          shares?: number | null
          source?: string
          specialty?: string | null
          status?: string
          supplementary_files?: string[] | null
          tags?: string[]
          title?: string
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          volume?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          read: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          read?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          read?: boolean
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          checkout_session_id: string | null
          completed_at: string | null
          created_at: string
          currency: string
          donor_email: string | null
          donor_name: string | null
          id: string
          is_anonymous: boolean | null
          message: string | null
          payment_intent_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          checkout_session_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          payment_intent_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          checkout_session_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          payment_intent_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      download_events: {
        Row: {
          created_at: string | null
          document_id: string
          document_type: string
          error_details: string | null
          file_name: string
          id: string
          ip_address: string | null
          referrer: string | null
          screen_size: string | null
          status: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          document_id: string
          document_type: string
          error_details?: string | null
          file_name: string
          id?: string
          ip_address?: string | null
          referrer?: string | null
          screen_size?: string | null
          status: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string
          document_type?: string
          error_details?: string | null
          file_name?: string
          id?: string
          ip_address?: string | null
          referrer?: string | null
          screen_size?: string | null
          status?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      download_stats_monitoring: {
        Row: {
          count: number | null
          document_type: string
          latest_download: string | null
          status: string
        }
        Insert: {
          count?: number | null
          document_type: string
          latest_download?: string | null
          status: string
        }
        Update: {
          count?: number | null
          document_type?: string
          latest_download?: string | null
          status?: string
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          created_at: string | null
          email_type: string
          html: string
          id: string
          priority: string | null
          recipient: string
          reply_to: string | null
          retry_count: number | null
          scheduled_for: string
          subject: string
          submission_id: string | null
          text: string
        }
        Insert: {
          created_at?: string | null
          email_type: string
          html: string
          id?: string
          priority?: string | null
          recipient: string
          reply_to?: string | null
          retry_count?: number | null
          scheduled_for: string
          subject: string
          submission_id?: string | null
          text: string
        }
        Update: {
          created_at?: string | null
          email_type?: string
          html?: string
          id?: string
          priority?: string | null
          recipient?: string
          reply_to?: string | null
          retry_count?: number | null
          scheduled_for?: string
          subject?: string
          submission_id?: string | null
          text?: string
        }
        Relationships: []
      }
      email_usage_tracking: {
        Row: {
          created_at: string | null
          date: string
          emails_sent: number | null
          failed_sends: number | null
          successful_sends: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          emails_sent?: number | null
          failed_sends?: number | null
          successful_sends?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          emails_sent?: number | null
          failed_sends?: number | null
          successful_sends?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      error_events: {
        Row: {
          component: string | null
          created_at: string
          error_type: string
          id: string
          message: string
          metadata: Json | null
          route: string | null
          session_id: string
          stack: string | null
          timestamp: string
          url: string
          user_agent: string | null
        }
        Insert: {
          component?: string | null
          created_at?: string
          error_type: string
          id?: string
          message: string
          metadata?: Json | null
          route?: string | null
          session_id: string
          stack?: string | null
          timestamp?: string
          url: string
          user_agent?: string | null
        }
        Update: {
          component?: string | null
          created_at?: string
          error_type?: string
          id?: string
          message?: string
          metadata?: Json | null
          route?: string | null
          session_id?: string
          stack?: string | null
          timestamp?: string
          url?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      founders: {
        Row: {
          achievements: string[] | null
          bio: string | null
          created_at: string | null
          display_order: number
          id: string
          image_path: string | null
          is_deceased: boolean | null
          location: string | null
          name: string
          responsibilities: string[] | null
          role: string
          specialties: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string | null
          display_order: number
          id?: string
          image_path?: string | null
          is_deceased?: boolean | null
          location?: string | null
          name: string
          responsibilities?: string[] | null
          role: string
          specialties?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          image_path?: string | null
          is_deceased?: boolean | null
          location?: string | null
          name?: string
          responsibilities?: string[] | null
          role?: string
          specialties?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: number
          name: string
          phone: string | null
          titre: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name: string
          phone?: string | null
          titre?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name?: string
          phone?: string | null
          titre?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: number
          is_active: boolean
          name: string
          phone: string | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: never
          is_active?: boolean
          name: string
          phone?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: never
          is_active?: boolean
          name?: string
          phone?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          connection_type: string | null
          created_at: string
          id: string
          memory_heap_size: number | null
          memory_heap_used: number | null
          navigation_metrics: Json | null
          page_url: string
          resource_metrics: Json | null
          route: string | null
          screen_size: string | null
          session_id: string
          timestamp: string
          user_agent: string | null
          web_vitals: Json | null
        }
        Insert: {
          connection_type?: string | null
          created_at?: string
          id?: string
          memory_heap_size?: number | null
          memory_heap_used?: number | null
          navigation_metrics?: Json | null
          page_url: string
          resource_metrics?: Json | null
          route?: string | null
          screen_size?: string | null
          session_id: string
          timestamp?: string
          user_agent?: string | null
          web_vitals?: Json | null
        }
        Update: {
          connection_type?: string | null
          created_at?: string
          id?: string
          memory_heap_size?: number | null
          memory_heap_used?: number | null
          navigation_metrics?: Json | null
          page_url?: string
          resource_metrics?: Json | null
          route?: string | null
          screen_size?: string | null
          session_id?: string
          timestamp?: string
          user_agent?: string | null
          web_vitals?: Json | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      unified_collections: {
        Row: {
          article_count: number | null
          category: string | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          id: string
          issue: string | null
          publication_date: string | null
          share_count: number | null
          source: string
          title: string
          updated_at: string | null
          volume: string | null
        }
        Insert: {
          article_count?: number | null
          category?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          id?: string
          issue?: string | null
          publication_date?: string | null
          share_count?: number | null
          source: string
          title: string
          updated_at?: string | null
          volume?: string | null
        }
        Update: {
          article_count?: number | null
          category?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          id?: string
          issue?: string | null
          publication_date?: string | null
          share_count?: number | null
          source?: string
          title?: string
          updated_at?: string | null
          volume?: string | null
        }
        Relationships: []
      }
      unified_content: {
        Row: {
          abstract: string
          authors: string[] | null
          category: string | null
          citations: number | null
          cover_image_filename: string | null
          created_at: string | null
          downloads: number | null
          id: string
          image_url: string | null
          institution: string | null
          issue: string | null
          page_number: string | null
          pdf_filename: string | null
          pdf_url: string | null
          publication_date: string | null
          shares: number | null
          source: string
          specialty: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
          volume: string | null
        }
        Insert: {
          abstract: string
          authors?: string[] | null
          category?: string | null
          citations?: number | null
          cover_image_filename?: string | null
          created_at?: string | null
          downloads?: number | null
          id?: string
          image_url?: string | null
          institution?: string | null
          issue?: string | null
          page_number?: string | null
          pdf_filename?: string | null
          pdf_url?: string | null
          publication_date?: string | null
          shares?: number | null
          source: string
          specialty?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
          volume?: string | null
        }
        Update: {
          abstract?: string
          authors?: string[] | null
          category?: string | null
          citations?: number | null
          cover_image_filename?: string | null
          created_at?: string | null
          downloads?: number | null
          id?: string
          image_url?: string | null
          institution?: string | null
          issue?: string | null
          page_number?: string | null
          pdf_filename?: string | null
          pdf_url?: string | null
          publication_date?: string | null
          shares?: number | null
          source?: string
          specialty?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
          volume?: string | null
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string | null
          document_id: string | null
          document_type: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          document_type?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          document_type?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      adc_articles_view: {
        Row: {
          abstract: string | null
          article_files: string[] | null
          article_type: string | null
          author_affiliations: string[] | null
          authors: string[] | null
          category: string | null
          citations: number | null
          co_authors: string[] | null
          cover_image_filename: string | null
          created_at: string | null
          doi: string | null
          downloads: number | null
          funding_source: string | null
          id: string | null
          image_url: string | null
          institution: string | null
          issue: string | null
          keywords: string[] | null
          page_number: string | null
          pdf_filename: string | null
          pdf_url: string | null
          primary_author: string | null
          publication_date: string | null
          shares: number | null
          source: string | null
          specialty: string | null
          status: string | null
          supplementary_files: string[] | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          views: number | null
          volume: string | null
        }
        Insert: {
          abstract?: string | null
          article_files?: string[] | null
          article_type?: string | null
          author_affiliations?: string[] | null
          authors?: string[] | null
          category?: string | null
          citations?: number | null
          co_authors?: string[] | null
          cover_image_filename?: string | null
          created_at?: string | null
          doi?: string | null
          downloads?: number | null
          funding_source?: string | null
          id?: string | null
          image_url?: string | null
          institution?: string | null
          issue?: string | null
          keywords?: string[] | null
          page_number?: string | null
          pdf_filename?: string | null
          pdf_url?: string | null
          primary_author?: string | null
          publication_date?: string | null
          shares?: number | null
          source?: string | null
          specialty?: string | null
          status?: string | null
          supplementary_files?: string[] | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          volume?: string | null
        }
        Update: {
          abstract?: string | null
          article_files?: string[] | null
          article_type?: string | null
          author_affiliations?: string[] | null
          authors?: string[] | null
          category?: string | null
          citations?: number | null
          co_authors?: string[] | null
          cover_image_filename?: string | null
          created_at?: string | null
          doi?: string | null
          downloads?: number | null
          funding_source?: string | null
          id?: string | null
          image_url?: string | null
          institution?: string | null
          issue?: string | null
          keywords?: string[] | null
          page_number?: string | null
          pdf_filename?: string | null
          pdf_url?: string | null
          primary_author?: string | null
          publication_date?: string | null
          shares?: number | null
          source?: string | null
          specialty?: string | null
          status?: string | null
          supplementary_files?: string[] | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          volume?: string | null
        }
        Relationships: []
      }
      admin_analytics_summary: {
        Row: {
          monthly_page_views: number | null
          monthly_unique_sessions: number | null
          total_downloads: number | null
          total_igm_articles: number | null
          total_index_medicus: number | null
          total_members: number | null
          total_rhca_articles: number | null
          total_shares: number | null
          total_views: number | null
        }
        Relationships: []
      }
      analytics_dashboard: {
        Row: {
          day: string | null
          document_type: string | null
          event_count: number | null
          event_type: string | null
        }
        Relationships: []
      }
      daily_activity_view: {
        Row: {
          day: string | null
          event_count: number | null
          unique_sessions: number | null
        }
        Relationships: []
      }
      download_stats_view: {
        Row: {
          document_type: string | null
          failed_downloads: number | null
          latest_download_time: string | null
          successful_downloads: number | null
          total_downloads: number | null
        }
        Relationships: []
      }
      founders_view: {
        Row: {
          achievements: string[] | null
          bio: string | null
          created_at: string | null
          display_order: number | null
          id: string | null
          image_path: string | null
          is_deceased: boolean | null
          location: string | null
          name: string | null
          responsibilities: string[] | null
          role: string | null
          specialties: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          image_path?: string | null
          is_deceased?: boolean | null
          location?: string | null
          name?: string | null
          responsibilities?: string[] | null
          role?: string | null
          specialties?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          image_path?: string | null
          is_deceased?: boolean | null
          location?: string | null
          name?: string | null
          responsibilities?: string[] | null
          role?: string | null
          specialties?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      igm_articles_view: {
        Row: {
          abstract: string | null
          article_files: string[] | null
          article_type: string | null
          author_affiliations: string[] | null
          authors: string[] | null
          category: string | null
          citations: number | null
          co_authors: string[] | null
          cover_image_filename: string | null
          created_at: string | null
          doi: string | null
          downloads: number | null
          funding_source: string | null
          id: string | null
          image_url: string | null
          institution: string | null
          issue: string | null
          keywords: string[] | null
          page_number: string | null
          pdf_filename: string | null
          pdf_url: string | null
          primary_author: string | null
          publication_date: string | null
          shares: number | null
          source: string | null
          specialty: string | null
          status: string | null
          supplementary_files: string[] | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          views: number | null
          volume: string | null
        }
        Insert: {
          abstract?: string | null
          article_files?: string[] | null
          article_type?: string | null
          author_affiliations?: string[] | null
          authors?: string[] | null
          category?: string | null
          citations?: number | null
          co_authors?: string[] | null
          cover_image_filename?: string | null
          created_at?: string | null
          doi?: string | null
          downloads?: number | null
          funding_source?: string | null
          id?: string | null
          image_url?: string | null
          institution?: string | null
          issue?: string | null
          keywords?: string[] | null
          page_number?: string | null
          pdf_filename?: string | null
          pdf_url?: string | null
          primary_author?: string | null
          publication_date?: string | null
          shares?: number | null
          source?: string | null
          specialty?: string | null
          status?: string | null
          supplementary_files?: string[] | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          volume?: string | null
        }
        Update: {
          abstract?: string | null
          article_files?: string[] | null
          article_type?: string | null
          author_affiliations?: string[] | null
          authors?: string[] | null
          category?: string | null
          citations?: number | null
          co_authors?: string[] | null
          cover_image_filename?: string | null
          created_at?: string | null
          doi?: string | null
          downloads?: number | null
          funding_source?: string | null
          id?: string | null
          image_url?: string | null
          institution?: string | null
          issue?: string | null
          keywords?: string[] | null
          page_number?: string | null
          pdf_filename?: string | null
          pdf_url?: string | null
          primary_author?: string | null
          publication_date?: string | null
          shares?: number | null
          source?: string | null
          specialty?: string | null
          status?: string | null
          supplementary_files?: string[] | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          volume?: string | null
        }
        Relationships: []
      }
      igm_issues_view: {
        Row: {
          abstract: string | null
          article_files: string[] | null
          category: string | null
          co_authors: string[] | null
          cover_image: string | null
          downloads: number | null
          id: string | null
          issue: string | null
          pdf_url: string | null
          primary_author: string | null
          publication_date: string | null
          shares: number | null
          status: string | null
          tags: string[] | null
          title: string | null
          volume: string | null
        }
        Insert: {
          abstract?: string | null
          article_files?: string[] | null
          category?: string | null
          co_authors?: string[] | null
          cover_image?: string | null
          downloads?: number | null
          id?: string | null
          issue?: string | null
          pdf_url?: string | null
          primary_author?: string | null
          publication_date?: string | null
          shares?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          volume?: string | null
        }
        Update: {
          abstract?: string | null
          article_files?: string[] | null
          category?: string | null
          co_authors?: string[] | null
          cover_image?: string | null
          downloads?: number | null
          id?: string | null
          issue?: string | null
          pdf_url?: string | null
          primary_author?: string | null
          publication_date?: string | null
          shares?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          volume?: string | null
        }
        Relationships: []
      }
      igm_unified_view: {
        Row: {
          abstract: string | null
          article_count: number | null
          articles: Json | null
          cover_image: string | null
          downloads: number | null
          id: string | null
          issue: string | null
          publication_date: string | null
          shares: number | null
          title: string | null
          volume: string | null
        }
        Relationships: []
      }
      members_public_view: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: number | null
          name: string | null
          titre: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: number | null
          name?: string | null
          titre?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: number | null
          name?: string | null
          titre?: string | null
        }
        Relationships: []
      }
      overall_download_stats_view: {
        Row: {
          document_types_stats: Json | null
          failed_downloads: number | null
          successful_downloads: number | null
          total_downloads: number | null
        }
        Relationships: []
      }
      popular_articles_view: {
        Row: {
          downloads: number | null
          id: string | null
          shares: number | null
          source: string | null
          title: string | null
          views: number | null
        }
        Relationships: []
      }
      rhca_articles_view: {
        Row: {
          abstract: string | null
          article_files: string[] | null
          article_type: string | null
          author_affiliations: string[] | null
          authors: string[] | null
          category: string | null
          citations: number | null
          co_authors: string[] | null
          cover_image_filename: string | null
          created_at: string | null
          doi: string | null
          downloads: number | null
          funding_source: string | null
          id: string | null
          image_url: string | null
          institution: string | null
          issue: string | null
          keywords: string[] | null
          page_number: string | null
          pdf_filename: string | null
          pdf_url: string | null
          primary_author: string | null
          publication_date: string | null
          shares: number | null
          source: string | null
          specialty: string | null
          status: string | null
          supplementary_files: string[] | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          views: number | null
          volume: string | null
        }
        Insert: {
          abstract?: string | null
          article_files?: string[] | null
          article_type?: string | null
          author_affiliations?: string[] | null
          authors?: string[] | null
          category?: string | null
          citations?: number | null
          co_authors?: string[] | null
          cover_image_filename?: string | null
          created_at?: string | null
          doi?: string | null
          downloads?: number | null
          funding_source?: string | null
          id?: string | null
          image_url?: string | null
          institution?: string | null
          issue?: string | null
          keywords?: string[] | null
          page_number?: string | null
          pdf_filename?: string | null
          pdf_url?: string | null
          primary_author?: string | null
          publication_date?: string | null
          shares?: number | null
          source?: string | null
          specialty?: string | null
          status?: string | null
          supplementary_files?: string[] | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          volume?: string | null
        }
        Update: {
          abstract?: string | null
          article_files?: string[] | null
          article_type?: string | null
          author_affiliations?: string[] | null
          authors?: string[] | null
          category?: string | null
          citations?: number | null
          co_authors?: string[] | null
          cover_image_filename?: string | null
          created_at?: string | null
          doi?: string | null
          downloads?: number | null
          funding_source?: string | null
          id?: string | null
          image_url?: string | null
          institution?: string | null
          issue?: string | null
          keywords?: string[] | null
          page_number?: string | null
          pdf_filename?: string | null
          pdf_url?: string | null
          primary_author?: string | null
          publication_date?: string | null
          shares?: number | null
          source?: string | null
          specialty?: string | null
          status?: string | null
          supplementary_files?: string[] | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          volume?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_admin_role_by_email: { Args: { _email: string }; Returns: boolean }
      can_access_analytics: { Args: never; Returns: boolean }
      check_email_limit_and_notify: { Args: never; Returns: undefined }
      cleanup_failed_emails: { Args: never; Returns: undefined }
      cleanup_old_email_usage: { Args: never; Returns: undefined }
      create_payment_intent: {
        Args: { amount: number; currency: string }
        Returns: Json
      }
      get_daily_downloads: {
        Args: { days_back?: number }
        Returns: {
          date: string
          failed_downloads: number
          successful_downloads: number
          total_downloads: number
        }[]
      }
      get_document_download_stats: {
        Args: { doc_id: string }
        Returns: {
          failed_downloads: number
          last_download_time: string
          successful_downloads: number
          total_downloads: number
        }[]
      }
      get_document_events: {
        Args: { doc_id: string; event_types?: string[] }
        Returns: {
          event_count: number
          event_type: string
          last_event_time: string
        }[]
      }
      get_download_statistics: {
        Args: never
        Returns: {
          document_types: Json
          failed_downloads: number
          successful_downloads: number
          total_downloads: number
        }[]
      }
      get_download_stats_by_type: {
        Args: { doc_type: string }
        Returns: {
          failed_downloads: number
          successful_downloads: number
          total_downloads: number
          unique_documents: number
        }[]
      }
      get_downloads_by_type: { Args: { doc_type: string }; Returns: number }
      get_total_downloads: { Args: never; Returns: number }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      increment_count: {
        Args: { column_name: string; row_id: string; table_name: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_valid_email: { Args: { email_text: string }; Returns: boolean }
      log_security_event: {
        Args: {
          event_data_param?: Json
          event_type_param: string
          ip_address_param?: string
          user_agent_param?: string
        }
        Returns: string
      }
      track_user_event: {
        Args: {
          p_document_id?: string
          p_document_type?: string
          p_event_data?: Json
          p_event_type: string
          p_ip_address?: string
          p_page_url?: string
          p_referrer?: string
          p_session_id?: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
