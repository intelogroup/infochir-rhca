
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getFounderAvatarUrl } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createLogger } from '@/lib/error-logger';

// Create a dedicated logger for the founders hook
const logger = createLogger('useFounders');

export interface Founder {
  id: string;
  name: string;
  title: string;
  role: string;
  image?: string;
  bio?: string;
  location?: string;
  isDeceased?: boolean;
  specialties?: string[];
  achievements?: string[];
  responsibilities?: string[];
  displayOrder?: number;
}

export const useFounders = () => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the transform function to reduce function creation during render
  const transformFounder = useCallback((founder: any, index: number): Founder => {
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
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchFounders = async () => {
      try {
        logger.info('Starting founders data fetch...');
        setLoading(true);
        
        // Using the new founders_view which is already ordered
        const { data: foundersData, error: foundersError } = await supabase
          .from('founders_view')
          .select('*');
          
        if (foundersError) {
          const errorMessage = typeof foundersError.message === 'string' 
            ? foundersError.message 
            : 'Failed to fetch founders data';
            
          logger.error(foundersError, {
            endpoint: 'founders_view',
            errorCode: foundersError.code || '',
            errorMessage,
            context: 'Fetching founders data'
          });
          
          throw new Error(errorMessage);
        }
        
        if (!isMounted) return;
        
        if (!foundersData || foundersData.length === 0) {
          logger.warn('No founders data found in database');
          setFounders([]);
          return;
        }
        
        logger.info(`Successfully fetched ${foundersData.length} founders`);
        
        // Transform data with tracking
        let transformationErrors = 0;
        const transformedFounders = foundersData.map((founder, index) => {
          try {
            return transformFounder(founder, index);
          } catch (e) {
            transformationErrors++;
            return transformFounder({ 
              id: founder.id || `error-${index}`,
              name: founder.name || 'Error processing record',
              title: founder.title,
              role: founder.role
            }, index);
          }
        });
        
        if (transformationErrors > 0) {
          logger.warn(`Completed with ${transformationErrors} transformation errors`);
        }
        
        if (isMounted) {
          setFounders(transformedFounders);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
        
        logger.error(err, {
          context: 'useFounders hook',
          message: errorMessage
        });
        
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(errorMessage));
          toast.error("Erreur lors du chargement des fondateurs");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
        logger.info('Founder data fetch completed');
      }
    };

    fetchFounders();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      logger.debug('useFounders hook cleanup');
    };
  }, [transformFounder]);

  return { founders, loading, error };
};
