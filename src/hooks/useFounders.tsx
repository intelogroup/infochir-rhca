
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        logger.info('Starting founders data fetch...');
        setLoading(true);
        
        // Log the query we're about to execute with the display_order column
        logger.info('Executing Supabase query: SELECT * FROM founders ORDER BY display_order, name');
        
        // Fetch founders - order by display_order as primary, name as secondary sort
        const { data: foundersData, error: foundersError } = await supabase
          .from('founders')
          .select('*')
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });
          
        if (foundersError) {
          // Enhanced error logging
          logger.error(foundersError, {
            endpoint: 'founders',
            query: 'SELECT * FROM founders ORDER BY display_order, name',
            errorCode: foundersError.code,
            errorMessage: foundersError.message,
            context: 'Fetching founders data'
          });
          throw foundersError;
        }
        
        if (!foundersData || foundersData.length === 0) {
          logger.warn('No founders data found in database');
          setFounders([]);
          return;
        }
        
        logger.info(`Successfully fetched ${foundersData.length} founders`);
        logger.debug('Fetched founders data:', foundersData);
        
        // Map DB data to Founder type
        logger.info('Transforming database records to Founder type...');
        
        // Track transformation success/failure
        let transformationErrors = 0;
        
        const transformedFounders = foundersData.map((founder, index) => {
          try {
            // Validate essential fields
            if (!founder.id || !founder.name) {
              logger.warn(`Founder at index ${index} missing required fields:`, { 
                id: !!founder.id, 
                name: !!founder.name 
              });
            }
            
            // Log image URL generation
            let imageUrl: string | undefined = undefined;
            if (founder.image_path) {
              logger.debug(`Generating image URL for founder ${founder.name} with path: ${founder.image_path}`);
              imageUrl = getFounderAvatarUrl(founder.image_path);
              logger.debug(`Generated image URL: ${imageUrl}`);
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
              specialties: specialties,
              achievements: achievements,
              responsibilities: responsibilities,
              displayOrder: founder.display_order || 999 // Default to high number to push to end
            } as Founder;
          } catch (transformError) {
            // Log individual transformation errors but continue processing
            transformationErrors++;
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
              displayOrder: founder.display_order || 999 // High number for error cases to push to end
            } as Founder;
          }
        });
        
        if (transformationErrors > 0) {
          logger.warn(`Completed with ${transformationErrors} transformation errors`);
        } else {
          logger.info('Successfully transformed all founder records');
        }
        
        setFounders(transformedFounders);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error(err, {
          context: 'useFounders hook',
          stackTrace: err instanceof Error ? err.stack : undefined,
          message: errorMessage
        });
        
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("Erreur lors du chargement des fondateurs");
      } finally {
        setLoading(false);
        logger.info('Founder data fetch completed');
      }
    };

    fetchFounders();
    
    return () => {
      logger.debug('useFounders hook cleanup');
    };
  }, []);

  // Log state changes
  useEffect(() => {
    if (founders.length > 0) {
      logger.info(`State updated with ${founders.length} founders`);
      logger.debug('Founder order check', founders.map(f => ({ name: f.name, order: f.displayOrder })));
    }
  }, [founders]);
  
  useEffect(() => {
    if (error) {
      logger.error(error, { context: 'Error state changed' });
    }
  }, [error]);

  return { founders, loading, error };
};
