
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { RhcaArticle } from "../types";
import { toast } from "sonner";
import { mapToCoverImageFileName } from "@/lib/pdf-utils";

// Helper functions for URL formatting
const formatPdfUrl = (pdfPath: string | null): string | undefined => {
  if (!pdfPath) return undefined;
  
  // Check if it's already a full URL
  if (pdfPath.startsWith('http')) return pdfPath;
  
  // Handle relative paths by constructing proper Supabase storage URL
  if (pdfPath.startsWith('/')) {
    const fileName = pdfPath.split('/').pop();
    if (!fileName) return undefined;
    
    const { data } = supabase.storage
      .from('rhca-pdfs')
      .getPublicUrl(fileName);
      
    return data.publicUrl;
  }
  
  // Direct bucket path
  const { data } = supabase.storage
    .from('rhca-pdfs')
    .getPublicUrl(pdfPath);
    
  return data.publicUrl;
};

const formatImageUrl = (imagePath: string | null): string | undefined => {
  if (!imagePath) return undefined;
  
  // Check if it's already a full URL (like Unsplash)
  if (imagePath.startsWith('http')) return imagePath;
  
  // Construct proper Supabase storage URL
  const { data } = supabase.storage
    .from('rhca_covers')
    .getPublicUrl(imagePath);
    
  return data.publicUrl;
};

// Convert string arrays or comma-separated strings to proper string arrays
const parseStringArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
};

// Merge author fields into a single array
const mergeAuthors = (primaryAuthor: string | null, coAuthors: any): string[] => {
  const authors: string[] = [];
  
  if (primaryAuthor) {
    authors.push(primaryAuthor);
  }
  
  if (coAuthors) {
    const coAuthorsList = parseStringArray(coAuthors);
    authors.push(...coAuthorsList);
  }
  
  return authors;
};

export const useRHCAArticles = () => {
  console.log('[useRHCAArticles] Hook initializing');
  const startTime = Date.now();

  return useQuery({
    queryKey: ["rhca-articles"],
    queryFn: async () => {
      console.log('[useRHCAArticles] Starting data fetch at:', Date.now() - startTime, 'ms');

      try {
        // Get data from Supabase
        const { data, error } = await supabase
          .from("rhca_articles_view")
          .select('*')
          .order('publication_date', { ascending: false });

        console.log('[useRHCAArticles] Supabase query completed at:', Date.now() - startTime, 'ms');

        if (error) {
          console.error("[useRHCAArticles] Supabase error:", {
            error,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          toast.error("Erreur lors du chargement des articles", {
            description: error.message
          });
          throw error;
        }

        if (!data) {
          console.log('[useRHCAArticles] No data returned from Supabase');
          return [];
        }

        console.log('[useRHCAArticles] Raw data from Supabase:', {
          count: data.length,
          firstItem: data[0],
          lastItem: data[data.length - 1]
        });

        const articles: RhcaArticle[] = data.map((item: any) => {
          // Convert date strings to ISO format for consistency
          const publicationDate = new Date(item.publication_date).toISOString();
          
          // Process authors from primary_author and co_authors fields
          const authors = mergeAuthors(item.primary_author, item.co_authors);
          
          // Use pdf_filename directly from the database
          const pdfFileName = item.pdf_filename || null;
          console.log(`[useRHCAArticles] Article ${item.id} has pdf_filename: ${pdfFileName}`);
          
          // Get cover image filename
          const coverImageFileName = mapToCoverImageFileName(item.volume, item.issue);
          
          // Format URLs if we have filenames
          const pdfUrl = pdfFileName ? formatPdfUrl(pdfFileName) : undefined;
          const imageUrl = coverImageFileName ? formatImageUrl(coverImageFileName) : item.image_url ? formatImageUrl(item.image_url) : undefined;
          
          if (pdfFileName) {
            console.log(`[useRHCAArticles] Article ${item.id} mapped to PDF: ${pdfFileName}, URL: ${pdfUrl}`);
          } else {
            console.log(`[useRHCAArticles] Article ${item.id} has no PDF filename`);
          }
          
          if (coverImageFileName) {
            console.log(`[useRHCAArticles] Article ${item.id} mapped to cover: ${coverImageFileName}, URL: ${imageUrl}`);
          }
          
          return {
            id: item.id,
            title: item.title,
            abstract: item.abstract || "",
            authors: authors,
            publicationDate: publicationDate,
            date: publicationDate, // Use publicationDate for date field
            specialty: item.specialty || "",
            category: item.category || "",
            source: item.source || "RHCA",
            volume: item.volume || "",
            issue: item.issue || "",
            pageNumber: item.page_number ? String(item.page_number) : "0", // Ensure this is a string
            views: item.views || 0,
            downloads: item.downloads || 0,
            shares: item.shares || 0,
            citations: item.citations || 0,
            tags: parseStringArray(item.tags),
            imageUrl: imageUrl,
            pdfUrl: pdfUrl,
            status: item.status || "published",
            institution: item.institution || "",
            userId: item.user_id || undefined,
            articleType: item.article_type || "RHCA",
            pdfFileName: pdfFileName,
            coverImageFileName: coverImageFileName
          };
        });

        console.log('[useRHCAArticles] Mapped articles:', {
          count: articles.length,
          timing: Date.now() - startTime,
          'ms': 'since initialization'
        });

        return articles;
      } catch (error) {
        console.error('[useRHCAArticles] Error in query function:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timing: Date.now() - startTime
        });
        throw error;
      }
    },
    meta: {
      errorMessage: "Erreur lors du chargement des articles"
    }
  });
};
