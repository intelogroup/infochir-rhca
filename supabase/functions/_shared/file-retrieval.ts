
/**
 * File retrieval utilities for email attachments
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { logError } from "./error-logger.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Create Supabase client with service role for file access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface FileAttachment {
  filename: string;
  content: string; // base64 encoded
  content_type: string;
  size: number;
}

/**
 * Download a file from Supabase Storage and convert to base64
 * @param bucket Storage bucket name
 * @param filePath Path to the file in the bucket
 * @returns FileAttachment object or null if failed
 */
export async function downloadFileAsAttachment(
  bucket: string, 
  filePath: string
): Promise<FileAttachment | null> {
  try {
    console.log(`[file-retrieval] Downloading file: ${bucket}/${filePath}`);
    
    // Clean up file path - remove bucket prefix if present
    let cleanPath = filePath;
    if (cleanPath.startsWith(`/${bucket}/`)) {
      cleanPath = cleanPath.substring(bucket.length + 2);
    } else if (cleanPath.startsWith(`${bucket}/`)) {
      cleanPath = cleanPath.substring(bucket.length + 1);
    }
    
    console.log(`[file-retrieval] Clean path: ${cleanPath}`);
    
    // Download file from storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(cleanPath);
    
    if (error) {
      console.error(`[file-retrieval] Storage download error:`, error);
      logError(`[file-retrieval] Failed to download ${bucket}/${cleanPath}`, error);
      return null;
    }
    
    if (!data) {
      console.error(`[file-retrieval] No data received for ${bucket}/${cleanPath}`);
      return null;
    }
    
    // Convert blob to array buffer, then to base64
    const arrayBuffer = await data.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64
    const base64Content = btoa(String.fromCharCode(...uint8Array));
    
    // Determine content type from file extension
    const extension = cleanPath.split('.').pop()?.toLowerCase() || '';
    const contentType = getContentTypeFromExtension(extension);
    
    // Extract filename from path
    const filename = cleanPath.split('/').pop() || cleanPath;
    
    console.log(`[file-retrieval] Successfully processed file: ${filename}, size: ${arrayBuffer.byteLength} bytes`);
    
    return {
      filename,
      content: base64Content,
      content_type: contentType,
      size: arrayBuffer.byteLength
    };
  } catch (error) {
    console.error(`[file-retrieval] Exception downloading file ${bucket}/${filePath}:`, error);
    logError(`[file-retrieval] Exception downloading file`, error);
    return null;
  }
}

/**
 * Download multiple files as attachments
 * @param fileUrls Array of file URLs from the database
 * @returns Array of FileAttachment objects
 */
export async function downloadMultipleFilesAsAttachments(
  fileUrls: string[]
): Promise<FileAttachment[]> {
  console.log(`[file-retrieval] Processing ${fileUrls.length} files for attachments`);
  
  const attachments: FileAttachment[] = [];
  
  for (const fileUrl of fileUrls) {
    try {
      const { bucket, path } = parseStorageUrl(fileUrl);
      if (bucket && path) {
        const attachment = await downloadFileAsAttachment(bucket, path);
        if (attachment) {
          attachments.push(attachment);
        } else {
          console.warn(`[file-retrieval] Failed to process file: ${fileUrl}`);
        }
      } else {
        console.warn(`[file-retrieval] Could not parse storage URL: ${fileUrl}`);
      }
    } catch (error) {
      console.error(`[file-retrieval] Error processing file ${fileUrl}:`, error);
      logError(`[file-retrieval] Error processing file URL`, error);
    }
  }
  
  console.log(`[file-retrieval] Successfully processed ${attachments.length}/${fileUrls.length} files`);
  return attachments;
}

/**
 * Parse a Supabase storage URL to extract bucket and path
 * @param url Storage URL
 * @returns Object with bucket and path, or null if invalid
 */
function parseStorageUrl(url: string): { bucket: string; path: string } | null {
  try {
    // Handle different URL formats
    if (url.includes('/storage/v1/object/public/')) {
      // Full public URL format
      const parts = url.split('/storage/v1/object/public/');
      if (parts.length === 2) {
        const pathParts = parts[1].split('/');
        const bucket = pathParts[0];
        const path = pathParts.slice(1).join('/');
        return { bucket, path };
      }
    } else if (url.startsWith('/') && url.includes('/')) {
      // Relative path format like "/article_files/filename.pdf"
      const pathParts = url.substring(1).split('/');
      if (pathParts.length >= 2) {
        const bucket = pathParts[0];
        const path = pathParts.slice(1).join('/');
        return { bucket, path };
      }
    } else if (url.includes('/')) {
      // Simple format like "article_files/filename.pdf"
      const pathParts = url.split('/');
      if (pathParts.length >= 2) {
        const bucket = pathParts[0];
        const path = pathParts.slice(1).join('/');
        return { bucket, path };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`[file-retrieval] Error parsing URL ${url}:`, error);
    return null;
  }
}

/**
 * Get MIME type from file extension
 * @param extension File extension (without dot)
 * @returns MIME type string
 */
function getContentTypeFromExtension(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    
    // Default
    'default': 'application/octet-stream'
  };
  
  return mimeTypes[extension] || mimeTypes['default'];
}

/**
 * Validate file for attachment (size and type)
 * @param attachment FileAttachment object
 * @returns Boolean indicating if file is valid
 */
export function validateFileForAttachment(attachment: FileAttachment): boolean {
  const maxSize = 40 * 1024 * 1024; // 40MB
  
  if (attachment.size > maxSize) {
    console.warn(`[file-retrieval] File ${attachment.filename} too large: ${attachment.size} bytes`);
    return false;
  }
  
  // Check if content type is allowed
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (!allowedTypes.includes(attachment.content_type)) {
    console.warn(`[file-retrieval] File ${attachment.filename} has unsupported type: ${attachment.content_type}`);
    return false;
  }
  
  return true;
}
