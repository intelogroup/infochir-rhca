import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

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
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || undefined} alt={fullName || "User avatar"} />
        <AvatarFallback>{(fullName?.[0] || "A").toUpperCase()}</AvatarFallback>
      </Avatar>
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
        className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
      >
        <Upload size={16} />
        <span>{isUploading ? "Uploading..." : "Update avatar"}</span>
      </label>
    </div>
  );
};