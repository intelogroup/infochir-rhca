/**
 * Security utilities for input validation and sanitization
 */

// Input validation patterns
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{7,20}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s\-'\.]{1,100}$/;

// Content sanitization - remove potentially dangerous HTML/script content
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object[^>]*>.*?<\/object>/gi, '') // Remove object tags
    .replace(/<embed[^>]*>.*?<\/embed>/gi, '') // Remove embed tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 10000); // Limit length
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email) && email.length <= 254;
};

// Validate phone format
export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone) && phone.length <= 20;
};

// Validate name format
export const isValidName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  return NAME_REGEX.test(name) && name.length >= 1 && name.length <= 100;
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Rate limiting utilities
export const createRateLimit = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get or create request history for this identifier
    const userRequests = requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    
    return true;
  };
};

// Content validation for article submissions
export const validateSubmissionContent = (data: any): string[] => {
  const errors: string[] = [];
  
  // Title validation
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required');
  } else if (data.title.length > 500) {
    errors.push('Title must be less than 500 characters');
  }
  
  // Abstract validation
  if (!data.abstract || typeof data.abstract !== 'string') {
    errors.push('Abstract is required');
  } else if (data.abstract.length > 5000) {
    errors.push('Abstract must be less than 5000 characters');
  }
  
  // Author email validation
  if (!data.corresponding_author_email) {
    errors.push('Corresponding author email is required');
  } else if (!isValidEmail(data.corresponding_author_email)) {
    errors.push('Invalid email format');
  }
  
  // Author name validation
  if (!data.corresponding_author_name) {
    errors.push('Corresponding author name is required');
  } else if (!isValidName(data.corresponding_author_name)) {
    errors.push('Invalid author name format');
  }
  
  // Phone validation (if provided)
  if (data.corresponding_author_phone && !isValidPhone(data.corresponding_author_phone)) {
    errors.push('Invalid phone number format');
  }
  
  // Publication type validation
  const allowedTypes = ['research_article', 'review', 'case_study', 'editorial', 'letter'];
  if (!data.publication_type || !allowedTypes.includes(data.publication_type)) {
    errors.push(`Invalid publication type. Allowed: ${allowedTypes.join(', ')}`);
  }
  
  // File URLs validation
  if (data.article_files_urls && Array.isArray(data.article_files_urls)) {
    if (data.article_files_urls.length > 10) {
      errors.push('Maximum 10 article files allowed');
    }
    for (const url of data.article_files_urls) {
      if (url && !isValidUrl(url)) {
        errors.push('Invalid article file URL format');
        break;
      }
    }
  }
  
  if (data.image_annexes_urls && Array.isArray(data.image_annexes_urls)) {
    if (data.image_annexes_urls.length > 20) {
      errors.push('Maximum 20 image annexes allowed');
    }
    for (const url of data.image_annexes_urls) {
      if (url && !isValidUrl(url)) {
        errors.push('Invalid image annex URL format');
        break;
      }
    }
  }
  
  return errors;
};

// Security headers for responses
export const getSecurityHeaders = () => ({
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com; " +
    "frame-src 'self' https://js.stripe.com; " +
    "object-src 'none'; " +
    "base-uri 'self';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
});

// Error logging with sanitization
export const logSecurityEvent = async (
  eventType: string, 
  eventData: any, 
  supabase: any
): Promise<void> => {
  try {
    // Sanitize event data to prevent log injection
    const sanitizedData = {
      ...eventData,
      userAgent: eventData.userAgent ? sanitizeText(eventData.userAgent) : undefined,
      referer: eventData.referer ? sanitizeText(eventData.referer) : undefined,
      message: eventData.message ? sanitizeText(eventData.message) : undefined,
    };
    
    await supabase.rpc('log_security_event', {
      event_type_param: eventType,
      event_data_param: sanitizedData,
      ip_address_param: eventData.ipAddress,
      user_agent_param: sanitizedData.userAgent
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};