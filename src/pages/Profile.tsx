import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "Dr. John Doe",
    email: "john.doe@example.com",
    specialty: "Chirurgie",
    hospital: "Hôpital Universitaire",
    avatarUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <Card className="max-w-2xl mx-auto p-6 bg-white shadow-sm">
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <ProfileAvatar 
                avatarUrl={formData.avatarUrl}
                onAvatarUpdate={(url) => setFormData(prev => ({ ...prev, avatarUrl: url }))}
              />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {formData.fullName}
                </h1>
                <p className="text-gray-500">{formData.specialty}</p>
              </div>
            </div>

            <ProfileForm 
              initialData={formData}
              onSave={(data) => setFormData({ ...data, avatarUrl: formData.avatarUrl })}
            />
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Profile;