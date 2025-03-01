
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { RhcaArticle } from "../types";
import { toast } from "sonner";

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

// Map volume/issue to actual existing PDF files
const mapToPdfFileName = (volume: string, issue: string): string | undefined => {
  // This mapping matches the actual files in storage to the article records
  // Modify this mapping based on your actual files
  const volumeIssueMap: Record<string, string> = {
    // Map volume+issue combinations to actual filenames in storage
    "2:47": "RHCA_vol_02_no_47_19_7_2024.pdf",
    "3:48": "RHCA_vol_03_no_48_18_10_2024.pdf", 
    "4:49": "RHCA_vol_04_no_49_11_1_2025.pdf"
  };
  
  const key = `${volume}:${issue}`;
  return volumeIssueMap[key];
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
          
          // Format URLs for images
          const imageUrl = formatImageUrl(item.image_url);
          
          // Get the appropriate PDF filename based on volume and issue
          const pdfFileName = mapToPdfFileName(item.volume, item.issue);
          
          // Format PDF URL if we have a filename
          const pdfUrl = pdfFileName ? formatPdfUrl(pdfFileName) : undefined;
          
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
            pageNumber: parseInt(item.page_number) || 0,
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
            pdfFileName: pdfFileName
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
