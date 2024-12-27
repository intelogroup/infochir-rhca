import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MemberAvatarProps {
  avatarUrl?: string;
  name: string;
}

export const MemberAvatar = ({ avatarUrl, name }: MemberAvatarProps) => {
  const getPublicUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${supabase.storage.from('annuaire_profile_pics').getPublicUrl(url).data.publicUrl}`;
  };

  return (
    <div className="flex items-center justify-center">
      <Avatar className="h-24 w-24 ring-4 ring-[#1EAEDB]/20 hover:ring-[#1EAEDB]/30 transition-all duration-300">
        <AvatarImage
          src={getPublicUrl(avatarUrl)}
          alt={name}
          className="object-cover"
        />
        <AvatarFallback className="bg-[#1EAEDB]/10">
          <UserRound className="h-12 w-12 text-[#1EAEDB]" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};