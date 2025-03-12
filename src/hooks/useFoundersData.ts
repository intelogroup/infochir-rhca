
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getFounderAvatarUrl } from '@/integrations/supabase/client';
import { createLogger } from '@/lib/error-logger';
import { Founder } from './useFounders';

// Create a dedicated logger for the founders data fetch
const logger = createLogger('useFoundersData');

// Fallback data in case the database is not accessible
export const fallbackFounders: Founder[] = [
  {
    id: "f1",
    name: "Louis-Franck TELEMAQUE",
    title: "Dr",
    role: "Fondateur",
    image: "/lovable-uploads/0878c37c-8897-4656-af02-a094357c9f8f.png",
    specialties: ["Chirurgie", "Recherche"],
    displayOrder: 1,
    isDeceased: false
  },
  {
    id: "f2",
    name: "Eunice DERIVOIS",
    title: "Dr",
    role: "Co-Fondateur",
    image: "/lovable-uploads/ade0626d-e1c8-4c08-913e-d755f1426bfd.png", 
    displayOrder: 2,
    isDeceased: false
  },
  {
    id: "f3", 
    name: "Sosthène PIERRE",
    title: "Dr",
    role: "Membre",
    image: "/lovable-uploads/6f182d14-1e9a-4570-b612-bd8bb9920805.png",
    displayOrder: 3,
    isDeceased: false
  },
  {
    id: "f4",
    name: "Jean ALOUIDOR",
    title: "Dr",
    role: "Membre",
    image: "/lovable-uploads/07f095b0-c8a1-42bd-89f8-d1618173b710.png",
    displayOrder: 4,
    isDeceased: false
  },
  {
    id: "f5",
    name: "Geissly KERNISAN",
    title: "Dr",
    role: "Membre",
    image: "/lovable-uploads/1b04ef39-161c-40a8-9706-eecbac750611.png",
    displayOrder: 5,
    isDeceased: false
  },
  {
    id: "f6",
    name: "Jean-Marie EUSTACHE",
    title: "Dr",
    role: "Membre fondateur",
    image: "/lovable-uploads/038bd7aa-3ffa-482a-bf3b-202d278f40bd.png",
    displayOrder: 6,
    isDeceased: false
  },
  {
    id: "f7",
    name: "Denise FABIEN",
    title: "Dr",
    role: "Membre fondateur",
    image: "/lovable-uploads/2d519f7b-55bf-4745-b627-f21f2d58caca.png",
    displayOrder: 7,
    isDeceased: true
  }
];

// Transformer function for founder data
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

// Function to fetch founders data
export const fetchFoundersData = async () => {
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
