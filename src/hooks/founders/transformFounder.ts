
import { createLogger } from '@/lib/error-logger';
import { getFounderAvatarUrl } from '@/integrations/supabase/client';
import { Founder } from '../useFounders';

// Create a dedicated logger for the founder transformations
const logger = createLogger('transformFounder');

/**
 * Transforms raw founder data into the Founder type
 */
export const transformFounder = (founder: any, index: number): Founder => {
  try {
    // Validate essential fields
    if (!founder.id || !founder.name) {
      logger.warn(`Founder at index ${index} missing required fields:`, { 
        id: !!founder.id, 
        name: !!founder.name 
      });
    }
    
    // Generate image URL if path exists
    let imageUrl: string | undefined = undefined;
    if (founder.image_path) {
      imageUrl = getFounderAvatarUrl(founder.image_path);
    }
    
    // Handle array fields with proper validation
    const specialties = Array.isArray(founder.specialties) ? founder.specialties : [];
    const achievements = Array.isArray(founder.achievements) ? founder.achievements : [];
    const responsibilities = Array.isArray(founder.responsibilities) ? founder.responsibilities : [];
    
    return {
      id: founder.id,
      name: founder.name || 'Unknown Name',
      title: founder.title || 'Unknown Title',
      role: founder.role || 'Member',
      image: imageUrl,
      bio: founder.bio || undefined,
      location: founder.location || undefined,
      isDeceased: !!founder.is_deceased,
      specialties,
      achievements,
      responsibilities,
      displayOrder: founder.display_order || 999 // Default to high number to push to end
    };
  } catch (transformError) {
    // Log individual transformation errors but continue processing
    logger.error(transformError, {
      context: `Transforming founder record at index ${index}`,
      founderRecord: founder
    });
    
    // Return a minimal valid record to prevent the map from failing
    return {
      id: founder.id || `unknown-${index}`,
      name: founder.name || 'Unknown',
      title: founder.title || 'Unknown',
      role: founder.role || 'Member',
      isDeceased: !!founder.is_deceased,
      displayOrder: founder.display_order || 999
    } as Founder;
  }
};
