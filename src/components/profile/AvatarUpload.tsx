import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  userId: string;
  avatarUrl: string | null;
  fullName: string | null;
  onAvatarUpdate: (url: string) => void;
}

export const AvatarUpload = ({ userId, avatarUrl, fullName, onAvatarUpdate }: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // First, delete the existing avatar if there is one
      if (avatarUrl) {
        const existingPath = avatarUrl.split('/').pop();
        if (existingPath) {
          await supabase.storage
            .from('avatars')
            .remove([existingPath]);
        }
      }

      // Upload the new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onAvatarUpdate(publicUrl);
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to update avatar");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
        id="avatar-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="avatar-upload"
        className="w-full"
      >
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          disabled={isUploading}
          asChild
        >
          <span>
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Update avatar"}
          </span>
        </Button>
      </label>
    </div>
  );
};