
import { useState, useEffect } from 'react';
import { createLogger } from '@/lib/error-logger';
import { fetchFoundersData } from './useFoundersData';

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
    let isMounted = true;
    
    const loadFounders = async () => {
      try {
        setLoading(true);
        const foundersData = await fetchFoundersData();
        
        if (isMounted) {
          setFounders(foundersData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          logger.error(err, {
            context: 'useFounders hook',
            message: String(err)
          });
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFounders();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  return { founders, loading, error };
};
