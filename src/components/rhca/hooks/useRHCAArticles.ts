
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { RhcaArticle } from "../types";
import { toast } from "sonner";
import { mapToCoverImageFileName } from "@/lib/pdf-utils";

// Helper functions for URL formatting
const formatPdfUrl = (pdfPath: string | null): string | undefined => {
  if (!pdfPath) {
    console.log('[useRHCAArticles:DEBUG] No PDF path provided');
    return undefined;
  }
  
  // Check if it's already a full URL
  if (pdfPath.startsWith('http')) {
    console.log(`[useRHCAArticles:DEBUG] Using existing URL: ${pdfPath}`);
    return pdfPath;
  }
  
  try {
    // Handle relative paths by constructing proper Supabase storage URL
    if (pdfPath.startsWith('/')) {
      const fileName = pdfPath.split('/').pop();
      if (!fileName) {
        console.error(`[useRHCAArticles:ERROR] Failed to extract filename from path: ${pdfPath}`);
        return undefined;
      }
      
      console.log(`[useRHCAArticles:DEBUG] Generating URL for relative path: ${pdfPath}, fileName: ${fileName}`);
      const { data } = supabase.storage
        .from('rhca-pdfs')
        .getPublicUrl(fileName);
        
      if (!data?.publicUrl) {
        console.error(`[useRHCAArticles:ERROR] Failed to generate public URL for ${fileName}`);
      } else {
        console.log(`[useRHCAArticles:DEBUG] Generated URL: ${data.publicUrl}`);
      }
      
      return data?.publicUrl;
    }
    
    // Direct bucket path
    console.log(`[useRHCAArticles:DEBUG] Generating URL for direct path: ${pdfPath}`);
    const { data } = supabase.storage
      .from('rhca-pdfs')
      .getPublicUrl(pdfPath);
      
    if (!data?.publicUrl) {
      console.error(`[useRHCAArticles:ERROR] Failed to generate public URL for ${pdfPath}`);
    } else {
      console.log(`[useRHCAArticles:DEBUG] Generated URL: ${data.publicUrl}`);
    }
    
    return data?.publicUrl;
  } catch (error) {
    console.error(`[useRHCAArticles:ERROR] Error formatting PDF URL:`, error);
    console.error(`Error details: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
};

const formatImageUrl = (imagePath: string | null): string | undefined => {
  if (!imagePath) {
    console.log('[useRHCAArticles:DEBUG] No image path provided');
    return undefined;
  }
  
  try {
    // Check if it's already a full URL (like Unsplash)
    if (imagePath.startsWith('http')) {
      console.log(`[useRHCAArticles:DEBUG] Using existing image URL: ${imagePath}`);
      return imagePath;
    }
    
    // Construct proper Supabase storage URL
    console.log(`[useRHCAArticles:DEBUG] Generating URL for image: ${imagePath}`);
    const { data } = supabase.storage
      .from('rhca_covers')
      .getPublicUrl(imagePath);
      
    if (!data?.publicUrl) {
      console.error(`[useRHCAArticles:ERROR] Failed to generate public URL for image: ${imagePath}`);
    } else {
      console.log(`[useRHCAArticles:DEBUG] Generated image URL: ${data.publicUrl}`);
    }
    
    return data?.publicUrl;
  } catch (error) {
    console.error(`[useRHCAArticles:ERROR] Error formatting image URL:`, error);
    console.error(`Error details: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
};

// Convert string arrays or comma-separated strings to proper string arrays
const parseStringArray = (value: any): string[] => {
  if (!value) return [];
  
  try {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(',').map(item => item.trim()).filter(Boolean);
    }
    console.warn(`[useRHCAArticles:WARN] Unexpected value type for string array parsing:`, typeof value, value);
    return [];
  } catch (error) {
    console.error(`[useRHCAArticles:ERROR] Error parsing string array:`, error);
    console.error(`Value was: ${String(value)}`);
    return [];
  }
};

// Merge author fields into a single array
const mergeAuthors = (primaryAuthor: string | null, coAuthors: any): string[] => {
  try {
    const authors: string[] = [];
    
    if (primaryAuthor) {
      authors.push(primaryAuthor);
    }
    
    if (coAuthors) {
      const coAuthorsList = parseStringArray(coAuthors);
      authors.push(...coAuthorsList);
    }
    
    return authors;
  } catch (error) {
    console.error(`[useRHCAArticles:ERROR] Error merging authors:`, error);
    console.error(`Primary author: ${primaryAuthor}, co-authors: ${String(coAuthors)}`);
    return primaryAuthor ? [primaryAuthor] : [];
  }
};

export const useRHCAArticles = () => {
  console.log('[useRHCAArticles:INFO] Hook initializing');
  const startTime = Date.now();

  return useQuery({
    queryKey: ["rhca-articles"],
    queryFn: async () => {
      console.log('[useRHCAArticles:INFO] Starting data fetch at:', Date.now() - startTime, 'ms');

      try {
        // Get data from Supabase
        console.log('[useRHCAArticles:DEBUG] Executing Supabase query');
        const { data, error } = await supabase
          .from("rhca_articles_view")
          .select('*')
          .order('publication_date', { ascending: false });

        console.log('[useRHCAArticles:INFO] Supabase query completed at:', Date.now() - startTime, 'ms');

        if (error) {
          console.error("[useRHCAArticles:ERROR] Supabase query error:", {
            error,
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          toast.error("Erreur lors du chargement des articles", {
            description: error.message
          });
          throw error;
        }

        if (!data) {
          console.log('[useRHCAArticles:WARN] No data returned from Supabase');
          return [];
        }

        console.log('[useRHCAArticles:INFO] Raw data from Supabase:', {
          count: data.length,
          firstItem: data[0] ? { id: data[0].id, title: data[0].title } : null,
          lastItem: data.length > 0 ? { id: data[data.length - 1].id, title: data[data.length - 1].title } : null
        });

        const articles: RhcaArticle[] = data.map((item: any) => {
          try {
            // Convert date strings to ISO format for consistency
            const publicationDate = item.publication_date ? new Date(item.publication_date).toISOString() : new Date().toISOString();
            
            // Process authors from primary_author and co_authors fields
            const authors = mergeAuthors(item.primary_author, item.co_authors);
            
            // Use pdf_filename directly from the database
            const pdfFileName = item.pdf_filename || null;
            console.log(`[useRHCAArticles:DEBUG] Article ${item.id} has pdf_filename: ${pdfFileName}`);
            
            // Get cover image filename
            const coverImageFileName = mapToCoverImageFileName(item.volume, item.issue);
            
            // Format URLs if we have filenames
            const pdfUrl = pdfFileName ? formatPdfUrl(pdfFileName) : undefined;
            const imageUrl = coverImageFileName ? formatImageUrl(coverImageFileName) : item.image_url ? formatImageUrl(item.image_url) : undefined;
            
            if (pdfFileName) {
              console.log(`[useRHCAArticles:DEBUG] Article ${item.id} mapped to PDF: ${pdfFileName}, URL: ${pdfUrl}`);
            } else {
              console.log(`[useRHCAArticles:DEBUG] Article ${item.id} has no PDF filename`);
            }
            
            if (coverImageFileName) {
              console.log(`[useRHCAArticles:DEBUG] Article ${item.id} mapped to cover: ${coverImageFileName}, URL: ${imageUrl}`);
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
          } catch (itemError) {
            console.error(`[useRHCAArticles:ERROR] Error processing article item:`, itemError);
            console.error('Item data:', item);
            
            // Return a minimal valid article object rather than failing completely
            return {
              id: item.id || 'unknown',
              title: item.title || 'Error loading article',
              abstract: '',
              authors: [],
              publicationDate: new Date().toISOString(),
              date: new Date().toISOString(),
              specialty: '',
              category: '',
              source: 'RHCA',
              volume: '',
              issue: '',
              pageNumber: '0',
              views: 0,
              downloads: 0,
              shares: 0,
              citations: 0,
              tags: [],
              imageUrl: undefined,
              pdfUrl: undefined,
              status: 'published',
              institution: '',
              articleType: 'RHCA',
              hasError: true, // Add an error indicator
              errorMessage: itemError instanceof Error ? itemError.message : String(itemError)
            };
          }
        });

        console.log('[useRHCAArticles:INFO] Mapped articles:', {
          count: articles.length,
          timing: Date.now() - startTime,
          'ms': 'since initialization'
        });

        return articles;
      } catch (error) {
        console.error('[useRHCAArticles:ERROR] Error in query function:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timing: Date.now() - startTime
        });
        throw error;
      }
    },
    meta: {
      onError: (error: unknown) => {
        console.error('[useRHCAArticles:ERROR] Query error handler:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        toast.error("Erreur lors du chargement des articles", {
          description: error instanceof Error ? error.message : 'Une erreur est survenue'
        });
      },
      errorMessage: "Erreur lors du chargement des articles"
    }
  });
};
