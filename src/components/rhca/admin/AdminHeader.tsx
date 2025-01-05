import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

export const AdminHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">RHCA Admin Panel</h2>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </DialogTrigger>
    </div>
  );
};