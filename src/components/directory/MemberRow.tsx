
import { TableCell, TableRow } from "@/components/ui/table";
import { Mail, Phone } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import { motion } from "framer-motion";

interface Member {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  titre?: string;
}

export const MemberRow = ({ member }: { member: Member }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="group relative hover:bg-gray-50/80 transition-colors"
    >
      <TableCell className="relative py-4 font-medium text-gray-900">
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold">
          {member.id}
        </span>
      </TableCell>
      
      <TableCell className="relative py-4">
        <div className="transform group-hover:scale-105 transition-transform duration-300">
          <MemberAvatar avatarUrl={member.avatar_url} name={member.name} />
        </div>
      </TableCell>
      
      <TableCell className="relative py-4">
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
            {member.name}
          </div>
          {member.titre && (
            <div className="text-sm text-gray-600 italic">
              {member.titre}
            </div>
          )}
          <div className="md:hidden space-y-1">
            {member.phone && (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Phone className="h-3 w-3 text-primary/70" />
                {member.phone}
              </div>
            )}
            {member.email && (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Mail className="h-3 w-3 text-primary/70" />
                <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">
                  {member.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="hidden sm:table-cell relative py-4">
        {member.phone && (
          <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-900 transition-colors">
            <Phone className="h-4 w-4 text-primary/70" />
            <span>{member.phone}</span>
          </div>
        )}
      </TableCell>
      
      <TableCell className="hidden md:table-cell relative py-4">
        {member.email && (
          <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-900 transition-colors">
            <Mail className="h-4 w-4 text-primary/70" />
            <a 
              href={`mailto:${member.email}`} 
              className="hover:text-primary transition-colors"
            >
              {member.email}
            </a>
          </div>
        )}
      </TableCell>
    </motion.tr>
  );
};
