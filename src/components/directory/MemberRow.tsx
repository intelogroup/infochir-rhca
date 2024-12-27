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
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium">{member.id}</TableCell>
      <TableCell>
        <MemberAvatar avatarUrl={member.avatar_url} name={member.name} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
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
  );
};