
/**
 * File retrieval utilities for email attachments with enhanced error handling
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

// Enhanced safety limits with monitoring
const MAX_FILE_SIZE = 40 * 1024 * 1024; // 40MB per file
const MAX_TOTAL_SIZE = 45 * 1024 * 1024; // 45MB total
const MAX_FILES_PER_EMAIL = 10; // Reasonable attachment limit
const DOWNLOAD_TIMEOUT = 30000; // 30 seconds timeout per file
const RETRY_ATTEMPTS = 2; // Number of retry attempts for failed downloads

/**
 * Download a file from Supabase Storage with enhanced error handling and retries
 */
export async function downloadFileAsAttachment(
  bucket: string, 
  filePath: string,
  retryCount: number = 0
): Promise<FileAttachment | null> {
  try {
    console.log(`[file-retrieval] Downloading file: ${bucket}/${filePath} (attempt ${retryCount + 1})`);
    
    // Clean up file path - remove bucket prefix if present
    let cleanPath = filePath;
    if (cleanPath.startsWith(`/${bucket}/`)) {
      cleanPath = cleanPath.substring(bucket.length + 2);
    } else if (cleanPath.startsWith(`${bucket}/`)) {
      cleanPath = cleanPath.substring(bucket.length + 1);
    }
    
    console.log(`[file-retrieval] Clean path: ${cleanPath}`);
    
    // Add timeout to prevent hanging downloads
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn(`[file-retrieval] Download timeout for ${cleanPath}`);
      controller.abort();
    }, DOWNLOAD_TIMEOUT);
    
    try {
      // Download file from storage with timeout
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(cleanPath, {
          signal: controller.signal
        });
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error(`[file-retrieval] Storage download error:`, error);
        
        // Retry logic for certain types of errors
        if (retryCount < RETRY_ATTEMPTS && isRetryableError(error)) {
          console.log(`[file-retrieval] Retrying download for ${cleanPath}...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
          return downloadFileAsAttachment(bucket, filePath, retryCount + 1);
        }
        
        logError(`[file-retrieval] Failed to download ${bucket}/${cleanPath}`, error);
        return null;
      }
      
      if (!data) {
        console.error(`[file-retrieval] No data received for ${bucket}/${cleanPath}`);
        return null;
      }
      
      // Check file size before processing
      const fileSize = data.size;
      if (fileSize > MAX_FILE_SIZE) {
        console.warn(`[file-retrieval] File ${cleanPath} too large: ${fileSize} bytes (max: ${MAX_FILE_SIZE})`);
        return null;
      }
      
      if (fileSize === 0) {
        console.warn(`[file-retrieval] File ${cleanPath} is empty`);
        return null;
      }
      
      // Convert blob to array buffer, then to base64
      const arrayBuffer = await data.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert to base64 efficiently
      const base64Content = btoa(String.fromCharCode(...uint8Array));
      
      // Determine content type from file extension
      const extension = cleanPath.split('.').pop()?.toLowerCase() || '';
      const contentType = getContentTypeFromExtension(extension);
      
      // Extract filename from path
      const filename = cleanPath.split('/').pop() || cleanPath;
      
      console.log(`[file-retrieval] Successfully processed file: ${filename}, size: ${arrayBuffer.byteLength} bytes, type: ${contentType}`);
      
      return {
        filename,
        content: base64Content,
        content_type: contentType,
        size: arrayBuffer.byteLength
      };
    } catch (downloadError) {
      clearTimeout(timeoutId);
      
      // Handle timeout specifically
      if (downloadError.name === 'AbortError') {
        console.error(`[file-retrieval] Download timeout for ${cleanPath}`);
        if (retryCount < RETRY_ATTEMPTS) {
          console.log(`[file-retrieval] Retrying after timeout for ${cleanPath}...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
          return downloadFileAsAttachment(bucket, filePath, retryCount + 1);
        }
      }
      
      throw downloadError;
    }
  } catch (error) {
    console.error(`[file-retrieval] Exception downloading file ${bucket}/${filePath}:`, error);
    logError(`[file-retrieval] Exception downloading file`, error);
    return null;
  }
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: any): boolean {
  const retryableMessages = [
    'network',
    'timeout',
    'connection',
    'temporary',
    'rate limit'
  ];
  
  const errorMessage = error.message?.toLowerCase() || '';
  return retryableMessages.some(msg => errorMessage.includes(msg));
}

/**
 * Download multiple files as attachments with enhanced progress tracking
 */
export async function downloadMultipleFilesAsAttachments(
  fileUrls: string[],
  maxFiles: number = MAX_FILES_PER_EMAIL,
  maxTotalSize: number = MAX_TOTAL_SIZE
): Promise<FileAttachment[]> {
  console.log(`[file-retrieval] Processing ${fileUrls.length} files for attachments (max: ${maxFiles})`);
  
  // Limit number of files to process
  const filesToProcess = fileUrls.slice(0, maxFiles);
  if (filesToProcess.length < fileUrls.length) {
    console.warn(`[file-retrieval] Limiting to ${maxFiles} files out of ${fileUrls.length} total`);
  }
  
  const attachments: FileAttachment[] = [];
  const processingResults = {
    total: filesToProcess.length,
    successful: 0,
    failed: 0,
    skipped: 0,
    totalSize: 0
  };
  
  // Process files sequentially to avoid overwhelming the system
  for (let i = 0; i < filesToProcess.length; i++) {
    const fileUrl = filesToProcess[i];
    
    try {
      // Check if we're approaching size limit
      if (processingResults.totalSize >= maxTotalSize) {
        console.warn(`[file-retrieval] Stopping processing: total size limit reached (${processingResults.totalSize}/${maxTotalSize} bytes)`);
        processingResults.skipped += filesToProcess.length - i;
        break;
      }
      
      console.log(`[file-retrieval] Processing file ${i + 1}/${filesToProcess.length}: ${fileUrl}`);
      
      const { bucket, path } = parseStorageUrl(fileUrl);
      if (!bucket || !path) {
        console.warn(`[file-retrieval] Could not parse storage URL: ${fileUrl}`);
        processingResults.failed++;
        continue;
      }
      
      const attachment = await downloadFileAsAttachment(bucket, path);
      if (attachment) {
        // Check if adding this file would exceed total size limit
        if (processingResults.totalSize + attachment.size > maxTotalSize) {
          console.warn(`[file-retrieval] Skipping file ${attachment.filename}: would exceed total size limit`);
          processingResults.skipped++;
          continue;
        }
        
        // Validate the attachment
        if (validateFileForAttachment(attachment)) {
          attachments.push(attachment);
          processingResults.totalSize += attachment.size;
          processingResults.successful++;
          console.log(`[file-retrieval] ✅ Added attachment ${i + 1}: ${attachment.filename} (${Math.round(attachment.size / 1024)}KB)`);
        } else {
          console.warn(`[file-retrieval] File ${attachment.filename} failed validation`);
          processingResults.failed++;
        }
      } else {
        console.warn(`[file-retrieval] Failed to process file: ${fileUrl}`);
        processingResults.failed++;
      }
    } catch (error) {
      console.error(`[file-retrieval] Error processing file ${fileUrl}:`, error);
      logError(`[file-retrieval] Error processing file URL`, error);
      processingResults.failed++;
      // Continue with next file instead of failing completely
    }
  }
  
  console.log(`[file-retrieval] Processing complete:`, {
    ...processingResults,
    totalSizeMB: Math.round(processingResults.totalSize / 1024 / 1024 * 100) / 100
  });
  
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
 * Get MIME type from file extension with comprehensive mapping
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
    'rtf': 'application/rtf',
    
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
    'tif': 'image/tiff',
    
    // Archives (if needed)
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    
    // Default fallback
    'default': 'application/octet-stream'
  };
  
  return mimeTypes[extension] || mimeTypes['default'];
}

/**
 * Validate file for attachment with comprehensive checks
 * @param attachment FileAttachment object
 * @returns Boolean indicating if file is valid
 */
export function validateFileForAttachment(attachment: FileAttachment): boolean {
  // Check for required fields
  if (!attachment.filename || !attachment.content || !attachment.content_type) {
    console.warn(`[file-retrieval] File missing required fields: ${attachment.filename}`);
    return false;
  }
  
  // Check file size
  if (attachment.size > MAX_FILE_SIZE) {
    console.warn(`[file-retrieval] File ${attachment.filename} too large: ${attachment.size} bytes (max: ${MAX_FILE_SIZE})`);
    return false;
  }
  
  // Check minimum size (avoid empty files)
  if (attachment.size < 10) {
    console.warn(`[file-retrieval] File ${attachment.filename} too small: ${attachment.size} bytes`);
    return false;
  }
  
  // Check if content type is allowed
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff'
  ];
  
  if (!allowedTypes.includes(attachment.content_type)) {
    console.warn(`[file-retrieval] File ${attachment.filename} has unsupported type: ${attachment.content_type}`);
    return false;
  }
  
  // Basic base64 validation
  try {
    // Check if content is valid base64
    atob(attachment.content.substring(0, 100)); // Test first 100 chars
  } catch (error) {
    console.warn(`[file-retrieval] File ${attachment.filename} has invalid base64 content`);
    return false;
  }
  
  return true;
}

/**
 * Get file size summary for logging and monitoring
 * @param attachments Array of file attachments
 * @returns Summary object with size information
 */
export function getAttachmentsSummary(attachments: FileAttachment[]): {
  count: number;
  totalSize: number;
  averageSize: number;
  largestFile: string;
  smallestFile: string;
} {
  if (attachments.length === 0) {
    return {
      count: 0,
      totalSize: 0,
      averageSize: 0,
      largestFile: '',
      smallestFile: ''
    };
  }
  
  const totalSize = attachments.reduce((sum, att) => sum + att.size, 0);
  const sizes = attachments.map(att => ({ name: att.filename, size: att.size }));
  sizes.sort((a, b) => b.size - a.size);
  
  return {
    count: attachments.length,
    totalSize,
    averageSize: Math.round(totalSize / attachments.length),
    largestFile: sizes[0]?.name || '',
    smallestFile: sizes[sizes.length - 1]?.name || ''
  };
}
