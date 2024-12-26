import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface ProfileAvatarProps {
  avatarUrl: string;
  session: Session | null;
  onAvatarUpdate: (url: string) => void;
}

export const ProfileAvatar = ({ avatarUrl, session, onAvatarUpdate }: ProfileAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to update your profile picture.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      onAvatarUpdate(publicUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been successfully updated.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-muted ring-2 ring-primary/10">
        <img
          src={avatarUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <label
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 rounded-full shadow-sm cursor-pointer"
      >
        <div className={`p-2 bg-primary hover:bg-primary/90 rounded-full transition-colors ${isUploading ? 'opacity-50' : ''}`}>
          <Camera className="h-4 w-4 text-white" />
        </div>
        <input
          id="avatar-upload"
          name="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpdate}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};