import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "./SearchBar";
import { TableHeader } from "./TableHeader";
import { MemberRow } from "./MemberRow";
import { useToast } from "@/components/ui/use-toast";

interface Member {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
}

type SortField = 'id' | 'name' | 'email';
type SortDirection = 'asc' | 'desc';

export const DirectoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { toast } = useToast();

  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ['members', sortField, sortDirection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les membres",
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Member[];
    }
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader 
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={toggleSort}
            />
            <TableBody>
              <AnimatePresence>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-primary/20 rounded-full animate-bounce" />
                        <div className="w-3 h-3 bg-primary/40 rounded-full animate-bounce [animation-delay:-.3s]" />
                        <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce [animation-delay:-.5s]" />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <p className="text-red-500">Une erreur est survenue lors du chargement des données</p>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <p className="text-gray-500">Aucun membre trouvé</p>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <MemberRow key={member.id} member={member} />
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
};