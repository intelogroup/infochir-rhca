import { TableCell, TableRow } from "@/components/ui/table";
import { Mail, Phone } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";

interface Member {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
}

export const MemberRow = ({ member }: { member: Member }) => {
  return (
    <TableRow className="hover:bg-gray-50/80 transition-colors">
      <TableCell className="font-medium text-gray-700">{member.id}</TableCell>
      <TableCell>
        <MemberAvatar avatarUrl={member.avatar_url} name={member.name} />
      </TableCell>
      <TableCell>
        <div className="font-medium text-gray-900">{member.name}</div>
        <div className="md:hidden mt-1 space-y-1">
          {member.phone && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Phone className="h-3 w-3" />
              {member.phone}
            </div>
          )}
          {member.email && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Mail className="h-3 w-3" />
              <a href={`mailto:${member.email}`} className="hover:text-primary">
                {member.email}
              </a>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {member.phone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            {member.phone}
          </div>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {member.email && (
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">
              {member.email}
            </a>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};