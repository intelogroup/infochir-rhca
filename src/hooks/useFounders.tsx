
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createLogger } from '@/lib/error-logger';

// Create a dedicated logger for the founders hook
const logger = createLogger('useFounders');

export interface Founder {
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
        
        // Fetch founders directly from the founders table
        logger.info('Executing Supabase query: SELECT * FROM founders ORDER BY display_order, name');
        
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
            return {
              name: founder.name,
              title: founder.title,
              role: founder.role,
              image: founder.image_path || undefined,
              bio: founder.bio || undefined,
              location: founder.location || undefined,
              isDeceased: founder.is_deceased,
              specialties: founder.specialties || undefined,
              achievements: founder.achievements || undefined,
              responsibilities: founder.responsibilities || undefined,
              displayOrder: founder.display_order
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
