import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "./SearchBar";
import { TableHeader } from "./TableHeader";
import { MemberRow } from "./MemberRow";
import { FixedSizeList as List } from 'react-window';
import { useWindowSize } from "@/hooks/use-window-size";
import AutoSizer from 'react-virtualized-auto-sizer';

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
  const { height } = useWindowSize();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members', sortField, sortDirection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (error) {
        console.error('Error fetching members:', error);
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

  const ROW_HEIGHT = 80;
  const TABLE_HEADER_HEIGHT = 56;
  const SEARCH_BAR_HEIGHT = 48;
  const PADDING = 32;

  const getListHeight = () => {
    const availableHeight = height ? height - TABLE_HEADER_HEIGHT - SEARCH_BAR_HEIGHT - PADDING * 2 : 600;
    const contentHeight = filteredMembers.length * ROW_HEIGHT;
    return Math.min(availableHeight, contentHeight);
  };

  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const member = filteredMembers[index];
    if (!member) return null;
    
    return (
      <div style={style}>
        <MemberRow member={member} />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-full space-y-4"
    >
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="w-full overflow-x-auto">
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
                    <td colSpan={5} className="text-center py-6">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-primary/20 rounded-full animate-bounce" />
                        <div className="w-3 h-3 bg-primary/40 rounded-full animate-bounce [animation-delay:-.3s]" />
                        <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce [animation-delay:-.5s]" />
                      </div>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6">
                      <p className="text-gray-500">Aucun membre trouvé</p>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={5} className="p-0">
                      <div style={{ height: getListHeight() }}>
                        <AutoSizer>
                          {({ width }) => (
                            <List
                              height={getListHeight()}
                              itemCount={filteredMembers.length}
                              itemSize={ROW_HEIGHT}
                              width={width}
                              overscanCount={5}
                            >
                              {Row}
                            </List>
                          )}
                        </AutoSizer>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
};