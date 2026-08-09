
import { TableCell } from "@/components/ui/table";
import { Mail, Phone, Lock } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Member {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  titre?: string;
}

interface MemberRowProps {
  member: Member;
  canViewContact?: boolean;
}

const MaskedValue = ({ value, fallback }: { value?: string; fallback: string }) => (
  <span
    className={cn("truncate select-none blur-[5px]")}
    aria-hidden="true"
    title=""
  >
    {value || fallback}
  </span>
);

export const MemberRow = ({ member, canViewContact = false }: MemberRowProps) => {
  const hasPhone = Boolean(member.phone);
  const hasEmail = Boolean(member.email);

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
        <div className="space-y-1 min-w-0 max-w-full">
          <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 truncate">
            {member.name}
          </div>
          {member.titre && (
            <div className="text-sm text-gray-600 italic truncate">{member.titre}</div>
          )}
          <div className="md:hidden space-y-1">
            {hasPhone && (
              <div className="flex items-center gap-2 text-gray-600 text-sm min-w-0">
                <Phone className="h-3 w-3 text-primary/70 flex-shrink-0" />
                {canViewContact ? (
                  <span className="truncate">{member.phone}</span>
                ) : (
                  <MaskedValue value={member.phone} fallback="+000 0000 0000" />
                )}
              </div>
            )}
            {hasEmail && (
              <div className="flex items-center gap-2 text-gray-600 text-sm min-w-0">
                <Mail className="h-3 w-3 text-primary/70 flex-shrink-0" />
                {canViewContact ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:text-primary transition-colors truncate"
                  >
                    {member.email}
                  </a>
                ) : (
                  <MaskedValue value={member.email} fallback="membre@exemple.com" />
                )}
              </div>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell relative py-4">
        {hasPhone && (
          <div className="flex items-center gap-2 text-gray-600 min-w-0">
            <Phone className="h-4 w-4 text-primary/70 flex-shrink-0" />
            {canViewContact ? (
              <span className="truncate">{member.phone}</span>
            ) : (
              <MaskedValue value={member.phone} fallback="+000 0000 0000" />
            )}
          </div>
        )}
      </TableCell>

      <TableCell className="hidden md:table-cell relative py-4">
        {hasEmail && (
          <div className="flex items-center gap-2 text-gray-600 min-w-0">
            {canViewContact ? (
              <>
                <Mail className="h-4 w-4 text-primary/70 flex-shrink-0" />
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-primary transition-colors truncate"
                >
                  {member.email}
                </a>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-primary/70 flex-shrink-0" />
                <MaskedValue value={member.email} fallback="membre@exemple.com" />
              </>
            )}
          </div>
        )}
      </TableCell>
    </motion.tr>
  );
};
