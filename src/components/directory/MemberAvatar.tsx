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
      <Avatar className="h-12 w-12 ring-2 ring-[#0EA5E9]/20 hover:ring-[#0EA5E9]/40 transition-all duration-300 shadow-lg">
        <AvatarImage
          src={getPublicUrl(avatarUrl)}
          alt={name}
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
          }}
        />
        <AvatarFallback className="bg-gradient-to-br from-[#1A1F2C] to-[#243949] text-white">
          <UserRound className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};