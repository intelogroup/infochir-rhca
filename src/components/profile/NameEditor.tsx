import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NameEditorProps {
  userId: string;
  initialName: string;
  onNameUpdate: (name: string) => void;
}

export const NameEditor = ({ userId, initialName, onNameUpdate }: NameEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(initialName);

  const handleUpdateName = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: newName })
        .eq('id', userId);

      if (error) throw error;

      onNameUpdate(newName);
      setIsEditing(false);
      toast.success("Name updated successfully");
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("Failed to update name");
    }
  };

  if (isEditing) {
    return (
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="h-8"
        />
        <Button
          size="sm"
          onClick={handleUpdateName}
        >
          Save
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <span>{initialName || "Anonymous"}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </Button>
    </div>
  );
};