
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DonorInformationProps {
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  message: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onAnonymousChange: (checked: boolean) => void;
  onMessageChange: (value: string) => void;
}

export const DonorInformation = ({
  donorName,
  donorEmail,
  isAnonymous,
  message,
  onNameChange,
  onEmailChange,
  onAnonymousChange,
  onMessageChange,
}: DonorInformationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Information</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={donorName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name"
            disabled={isAnonymous}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={donorEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={onAnonymousChange}
          />
          <Label htmlFor="anonymous" className="text-sm text-gray-600">
            Make my donation anonymous
          </Label>
        </div>
        <div>
          <Label htmlFor="message">Message (optional)</Label>
          <Input
            id="message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Add a message to your donation"
          />
        </div>
      </div>
    </div>
  );
};
