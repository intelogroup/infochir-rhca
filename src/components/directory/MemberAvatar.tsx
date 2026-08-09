
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface MemberAvatarProps {
  avatarUrl?: string;
  name: string;
}

export const MemberAvatar = ({ avatarUrl, name }: MemberAvatarProps) => {
  // No placeholder: render nothing when the member has no picture.
  if (!avatarUrl) return null;

  const src = avatarUrl.startsWith("http")
    ? avatarUrl
    : supabase.storage.from("annuaire_profile_pics").getPublicUrl(avatarUrl).data.publicUrl;

  return (
    <div className="flex items-center justify-center">
      <Avatar className="h-12 w-12 ring-2 ring-ocean/20 hover:ring-ocean/40 transition-all duration-300 shadow-md">
        <AvatarImage src={src} alt={name} className="object-cover" />
      </Avatar>
    </div>
  );
};
