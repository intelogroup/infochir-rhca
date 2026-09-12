
import { Table, TableBody } from "@/components/ui/table";
import { SearchBar } from "./SearchBar";
import { TableHeader } from "./TableHeader";
import { MemberRow } from "./MemberRow";
import { useState, useMemo, useCallback, useEffect, FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const LoadingSkeleton: FC = () => (
  <div className="space-y-4">
    <div className="flex justify-center py-8">
      <LoadingSpinner size="lg" variant="primary" text="Chargement de l'annuaire..." />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="w-full h-16 bg-muted" />
    ))}
  </div>
);

LoadingSkeleton.displayName = 'LoadingSkeleton';

interface DirectoryListProps {}

const DirectoryList: FC<DirectoryListProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<'id' | 'name' | 'email'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (active) setIsAdmin(false);
        return;
      }
      const { data } = await supabase.rpc('has_role', { _role: 'admin' });
      if (active) setIsAdmin(Boolean(data));
    };
    checkAdmin();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);


  const { data: members, isLoading } = useQuery({
    queryKey: ['members', isAdmin],
    queryFn: async () => {
      // Only admins receive full records (contact info included).
      // Everyone else — visitors and signed-in members alike — only ever
      // receives the redacted public view: no email, no phone leaves the database.
      if (isAdmin) {
        const { data, error } = await supabase.from('members').select('*').order('name');
        if (!error && data && data.length > 0) return data as any[];
      }

      const { data, error } = await supabase
        .from('members_public_view' as any)
        .select('id, name, titre, avatar_url')
        .order('name');

      if (error) throw error;
      return (data as any[]) || [];
    },
  });


  const filteredMembers = useMemo(() => {
    console.time('Filter Members');
    if (!members) return [];
    
    const filtered = searchTerm
      ? members.filter(member =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : members;
    
    console.timeEnd('Filter Members');
    return filtered;
  }, [members, searchTerm]);

  const sortedMembers = useMemo(() => {
    console.time('Sort Members');
    const sorted = [...filteredMembers].sort((a, b) => {
      if (sortField === 'id') {
        const aValue = a[sortField] || 0;
        const bValue = b[sortField] || 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aValue = String(a[sortField] || '').toLowerCase();
      const bValue = String(b[sortField] || '').toLowerCase();
      
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    
    console.timeEnd('Sort Members');
    return sorted;
  }, [filteredMembers, sortField, sortDirection]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSort = useCallback((field: 'id' | 'name' | 'email') => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <SearchBar value={searchTerm} onChange={handleSearch} />

      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground text-center">
          Les coordonnées des membres sont masquées. Connectez-vous pour y accéder.
        </p>
      )}

      <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
        <Table>
          <TableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableBody>
            {sortedMembers.map((member) => (
              <MemberRow key={member.id} member={member} canViewContact={isAuthenticated} />
            ))}
          </TableBody>
        </Table>

        
        {sortedMembers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Aucun membre trouvé</p>
          </div>
        )}
      </div>
      
      <div className="text-right text-sm text-muted-foreground">
        {sortedMembers.length} membre{sortedMembers.length !== 1 ? 's' : ''} trouvé{sortedMembers.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

DirectoryList.displayName = 'DirectoryList';

export { DirectoryList };
