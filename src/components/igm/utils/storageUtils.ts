
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets a public URL for an IGM cover image from the Supabase storage
 * @param filename The filename in the igm_covers bucket
 * @returns Public URL for the cover image
 */
export const getIGMCoverUrl = (filename: string): string => {
  if (!filename) return '';
  
  // If it's already a full URL, return it
  if (filename.startsWith('http')) return filename;
  
  // Clean up filename - remove any leading slashes
  const cleanFilename = filename.replace(/^\/+/, '');
  
  const { data } = supabase.storage
    .from('igm_covers')
    .getPublicUrl(cleanFilename);
    
  return data.publicUrl;
};

/**
 * Gets a public URL for an IGM PDF from the Supabase storage
 * @param filename The filename in the igm-pdfs bucket
 * @returns Public URL for the PDF file
 */
export const getIGMPdfUrl = (filename: string): string => {
  if (!filename) return '';
  
  // If it's already a full URL, return it
  if (filename.startsWith('http')) return filename;
  
  // Clean up filename - remove any leading slashes
  const cleanFilename = filename.replace(/^\/+/, '');
  
  const { data } = supabase.storage
    .from('igm-pdfs')
    .getPublicUrl(cleanFilename);
    
  return data.publicUrl;
};

/**
 * Generates a standardized IGM PDF filename based on volume and issue
 * @param volume The volume number
 * @param issue The issue number
 * @returns Standardized PDF filename
 */
export const generateIGMPdfFilename = (volume: string, issue: string): string => {
  return `IGM_vol_${volume}_no_${issue}.pdf`;
};

/**
 * Generates a standardized IGM cover filename based on volume and issue
 * @param volume The volume number
 * @param issue The issue number
 * @returns Standardized cover filename
 */
export const generateIGMCoverFilename = (volume: string, issue: string): string => {
  return `IGM_vol_${volume}_no_${issue}.jpg`;
};
