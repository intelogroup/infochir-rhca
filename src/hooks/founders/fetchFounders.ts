
import { supabase } from '@/integrations/supabase/client';
import { createLogger } from '@/lib/error-logger';
import { Founder } from '../useFounders';
import { transformFounder } from './transformFounder';
import { fallbackFounders } from './fallbackData';

// Create a dedicated logger for the founders data fetch
const logger = createLogger('fetchFounders');

/**
 * Fetches founders data from the database
 */
export const fetchFoundersData = async (): Promise<Founder[]> => {
  logger.info('Starting founders data fetch...');
  
  try {
    // Try fetching from the database
    try {
      // First attempt with simple select
      const { data: foundersData, error: foundersError } = await supabase
        .from('founders_view')
        .select('*');

      // If we got data successfully, return it
      if (!foundersError && foundersData && foundersData.length > 0) {
        logger.info(`Successfully fetched ${foundersData.length} founders`);
        
        // Sort founders by display_order manually 
        const sortedFounders = [...foundersData].sort((a, b) => {
          return (a.display_order || 999) - (b.display_order || 999);
        });
        
        return sortedFounders.map((founder, index) => transformFounder(founder, index));
      } else {
        // Log the specific error for troubleshooting
        logger.error(foundersError || new Error('No founders data returned'), {
          endpoint: 'founders_view',
          errorCode: foundersError?.code || '',
          errorMessage: foundersError?.message || 'No data returned',
          context: 'Fetching founders data'
        });
        
        throw new Error('Failed to fetch founders data');
      }
    } catch (dbError) {
      // Database query failed, log and try direct founders table
      logger.error(dbError, {
        context: 'founders_view fetch failed, trying founders table',
        error: String(dbError)
      });
      
      // Try the direct 'founders' table as fallback
      const { data: foundersData, error: foundersError } = await supabase
        .from('founders')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (foundersError || !foundersData || foundersData.length === 0) {
        // Both attempts failed, throw error for fallback handling
        logger.error(foundersError || new Error('No founders data from direct table'), {
          endpoint: 'founders table',
          error: String(foundersError),
          context: 'Fallback founders fetch failed'
        });
        throw new Error('Failed to fetch founders data from any source');
      }
      
      // Successfully got data from direct table
      logger.info(`Success with fallback: fetched ${foundersData.length} founders from direct table`);
      
      return foundersData.map((founder, index) => {
        return transformFounder({
          ...founder,
          is_deceased: founder.is_deceased,
          image_path: founder.image_path
        }, index);
      });
    }
  } catch (err) {
    logger.error(err, {
      context: 'fetchFoundersData',
      message: String(err)
    });
    
    // Return fallback data instead of throwing
    logger.info('Using fallback founders data due to fetch error');
    return fallbackFounders;
  }
};
