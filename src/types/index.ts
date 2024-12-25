import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Article, ArticleWithRelations } from './article';

export interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  logo?: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at?: string;
}

export interface ArticleFormProps {
  article?: ArticleWithRelations | null;
  onSuccess: () => void;
}

export interface ArticlesListProps {
  articles: ArticleWithRelations[];
  isLoading: boolean;
  onUpdate: () => void;
}

export interface ArticleFormDialogProps {
  article: ArticleWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<ArticleWithRelations>) => Promise<void>;
  isLoading?: boolean;
  title?: string;
}