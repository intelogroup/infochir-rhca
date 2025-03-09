
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getFounderAvatarUrl } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
}

export const useFounders = () => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        setLoading(true);
        
        // Fetch founders
        const { data: foundersData, error: foundersError } = await supabase
          .from('founders')
          .select('*')
          .order('name');
          
        if (foundersError) throw foundersError;
        
        if (!foundersData || foundersData.length === 0) {
          setFounders([]);
          return;
        }
        
        // Map DB data to Founder type
        const transformedFounders = foundersData.map((founder) => {
          return {
            name: founder.name,
            title: founder.title,
            role: founder.role,
            image: founder.image_path ? getFounderAvatarUrl(founder.image_path) : undefined,
            bio: founder.bio || undefined,
            location: founder.location || undefined,
            isDeceased: founder.is_deceased,
            specialties: founder.specialties || undefined,
            achievements: founder.achievements || undefined,
            responsibilities: founder.responsibilities || undefined,
          } as Founder;
        });
        
        setFounders(transformedFounders);
      } catch (err) {
        console.error('Error fetching founders:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("Erreur lors du chargement des fondateurs");
      } finally {
        setLoading(false);
      }
    };

    fetchFounders();
  }, []);

  return { founders, loading, error };
};
