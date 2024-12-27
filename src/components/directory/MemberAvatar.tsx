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
      <Avatar className="h-10 w-10 ring-2 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
        <AvatarImage
          src={getPublicUrl(avatarUrl)}
          alt={name}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/5">
          <UserRound className="h-5 w-5 text-primary/70" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};