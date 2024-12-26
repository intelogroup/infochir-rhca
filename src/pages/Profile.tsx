import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Camera, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "Dr. John Doe",
    email: "john.doe@example.com",
    specialty: "Chirurgie",
    hospital: "Hôpital Universitaire",
    avatarUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleAvatarUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
      
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
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <Card className="max-w-2xl mx-auto p-6 bg-white shadow-sm">
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted ring-2 ring-primary/10">
                  <img
                    src={formData.avatarUrl}
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
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpdate}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {formData.fullName}
                </h1>
                <p className="text-gray-500">{formData.specialty}</p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital</Label>
                  <Input
                    id="hospital"
                    value={formData.hospital}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, hospital: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Profile;