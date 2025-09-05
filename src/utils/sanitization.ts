import DOMPurify from 'dompurify';

/**
 * Security utility for sanitizing user inputs to prevent XSS attacks
 */

// Configure DOMPurify for different contexts
const basicConfig = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

const richTextConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
  ALLOWED_ATTR: [],
};

/**
 * Sanitize plain text input (removes all HTML)
 */
export const sanitizeText = (input: string): string => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, basicConfig);
};

/**
 * Sanitize rich text content (allows basic formatting)
 */
export const sanitizeRichText = (input: string): string => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, richTextConfig);
};

/**
 * Sanitize URL to prevent javascript: and data: URLs
 */
export const sanitizeUrl = (url: string): string => {
  if (typeof url !== 'string') return '';
  
  // Remove any javascript: or data: protocols
  const cleanUrl = url.replace(/^(javascript|data|vbscript):/i, '');
  
  // Basic URL validation
  try {
    new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
    return cleanUrl;
  } catch {
    return '';
  }
};

/**
 * Sanitize array of strings
 */
export const sanitizeStringArray = (arr: string[]): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => sanitizeText(item)).filter(Boolean);
};

/**
 * Sanitize object with string values
 */
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = { ...data } as any;
  
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      // Apply different sanitization based on field type
      if (key.includes('url') || key.includes('link')) {
        sanitized[key] = sanitizeUrl(value);
      } else if (key.includes('content') || key.includes('description')) {
        sanitized[key] = sanitizeRichText(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }
    } else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
      sanitized[key] = sanitizeStringArray(value);
    }
  }
  
  return sanitized as T;
};