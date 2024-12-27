import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Mail, Phone, Search, UserRound } from "lucide-react";
import { motion } from "framer-motion";

interface Member {
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

const members: Member[] = [
  { id: 1, name: "Louis-Franck Télémaque", phone: "34013422", email: "tlmq15@gmail.com" },
  { id: 2, name: "Eunice Dérivois", phone: "37245691", email: "edme1609@yahoo.fr" },
  { id: 3, name: "Sosthène Pierre", phone: "34012345", email: "sospierre55@hotmail.com" },
  { id: 4, name: "Denise Fabien", phone: "38320862", email: "denisefabien@yahoo.fr" },
  { id: 5, name: "Jean Alouidor", phone: "37322034", email: "jalouidor@hotmail.com" },
  { id: 6, name: "Claudine Jolicoeur", phone: "32915666", email: "jolimcl@yahoo.fr" },
  { id: 7, name: "Jean Marie Eustache", phone: "37220770", email: "jemeustache@yahoo.com" },
  { id: 8, name: "Georges Beauvoir", phone: "33890347", email: "gebeauvoir@yahoo.com" },
  { id: 9, name: "Patrick Dupont", phone: "39339988", email: "orthodupont@yahoo.com" },
  { id: 10, name: "Claude Paultre", phone: "37111307", email: "uropaultre@yahoo.com" },
  // ... Add all other members here
];

export const DirectoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Rechercher un membre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead className="w-[200px]">Téléphone</TableHead>
              <TableHead className="w-[300px]">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{member.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-[#1EAEDB]" />
                    {member.name}
                  </div>
                </TableCell>
                <TableCell>
                  {member.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      {member.phone}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {member.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${member.email}`} className="hover:text-[#1EAEDB]">
                        {member.email}
                      </a>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};