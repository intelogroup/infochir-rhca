
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Founder } from '@/components/home/founders/types';
import { toast } from 'sonner';

export interface FounderFromDB {
  id: string;
  name: string;
  title: string;
  role: string;
  bio: string | null;
  location: string | null;
  image_path: string | null;
  is_deceased: boolean;
  display_order: number | null;
}

export interface FounderSpecialty {
  id: string;
  founder_id: string;
  specialty: string;
}

export interface FounderAchievement {
  id: string;
  founder_id: string;
  achievement: string;
}

export interface FounderResponsibility {
  id: string;
  founder_id: string;
  responsibility: string;
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
          .order('display_order', { ascending: true });
          
        if (foundersError) throw foundersError;
        
        // Fetch specialties
        const { data: specialtiesData, error: specialtiesError } = await supabase
          .from('founder_specialties')
          .select('*');
          
        if (specialtiesError) throw specialtiesError;
        
        // Fetch achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('founder_achievements')
          .select('*');
          
        if (achievementsError) throw achievementsError;
        
        // Fetch responsibilities
        const { data: responsibilitiesData, error: responsibilitiesError } = await supabase
          .from('founder_responsibilities')
          .select('*');
          
        if (responsibilitiesError) throw responsibilitiesError;
        
        // Map DB data to Founder type
        const transformedFounders = foundersData.map((founder: FounderFromDB) => {
          // Get specialties for this founder
          const specialties = specialtiesData
            .filter((s: FounderSpecialty) => s.founder_id === founder.id)
            .map((s: FounderSpecialty) => s.specialty);
            
          // Get achievements for this founder
          const achievements = achievementsData
            .filter((a: FounderAchievement) => a.founder_id === founder.id)
            .map((a: FounderAchievement) => a.achievement);
            
          // Get responsibilities for this founder
          const responsibilities = responsibilitiesData
            .filter((r: FounderResponsibility) => r.founder_id === founder.id)
            .map((r: FounderResponsibility) => r.responsibility);
            
          return {
            name: founder.name,
            title: founder.title,
            role: founder.role,
            image: founder.image_path,
            bio: founder.bio || undefined,
            location: founder.location || undefined,
            isDeceased: founder.is_deceased,
            specialties: specialties.length > 0 ? specialties : undefined,
            achievements: achievements.length > 0 ? achievements : undefined,
            responsibilities: responsibilities.length > 0 ? responsibilities : undefined,
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
