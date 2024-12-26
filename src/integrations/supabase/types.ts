export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          abstract: string;
          date: string;
          pdf_url: string | null;
          source: string;
          created_at: string;
          updated_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
        };
      };
      authors: {
        Row: {
          id: string;
          name: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
        };
      };
      article_authors: {
        Row: {
          id: string;
          article_id: string;
          author_id: string;
          author: {
            name: string;
          };
        };
      };
      article_tags: {
        Row: {
          id: string;
          article_id: string;
          tag_id: string;
          tag: {
            name: string;
          };
        };
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}