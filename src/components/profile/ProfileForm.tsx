import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ProfileFormData {
  fullName: string;
  email: string;
  specialty: string;
  hospital: string;
}

interface ProfileFormProps {
  initialData: ProfileFormData;
  onSave: (data: ProfileFormData) => void;
}

export const ProfileForm = ({ initialData, onSave }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            disabled={!isEditing}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            disabled={!isEditing}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty</Label>
          <Input
            id="specialty"
            name="specialty"
            value={formData.specialty}
            disabled={!isEditing}
            onChange={(e) =>
              setFormData({ ...formData, specialty: e.target.value })
            }
            autoComplete="organization-title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hospital">Hospital</Label>
          <Input
            id="hospital"
            name="hospital"
            value={formData.hospital}
            disabled={!isEditing}
            onChange={(e) =>
              setFormData({ ...formData, hospital: e.target.value })
            }
            autoComplete="organization"
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
  );
};