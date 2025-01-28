import { Table, TableBody } from "@/components/ui/table";
import { SearchBar } from "./SearchBar";
import { TableHeader } from "./TableHeader";
import { MemberRow } from "./MemberRow";
import { useState, useMemo, useCallback, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="w-full h-16" />
    ))}
  </div>
);

const DirectoryList = memo(() => {
  console.time('DirectoryList Render');
  const [searchTerm, setSearchTerm] = useState("");

  const { data: members, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      console.time('Fetch Members');
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name');

      console.timeEnd('Fetch Members');
      
      if (error) throw error;
      return data || [];
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

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  console.timeEnd('DirectoryList Render');

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <SearchBar value={searchTerm} onChange={handleSearch} />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Table>
          <TableHeader />
          <TableBody>
            {filteredMembers.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

DirectoryList.displayName = 'DirectoryList';

export { DirectoryList };