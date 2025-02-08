
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxWithLabelProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

export const CheckboxWithLabel = ({
  checked,
  onCheckedChange,
  label,
}: CheckboxWithLabelProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={`checkbox-${label}`}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <label
        htmlFor={`checkbox-${label}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
};
