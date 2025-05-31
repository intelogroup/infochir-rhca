
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormErrorsProps {
  errors: { [key: string]: string };
}

export const FormErrors = ({ errors }: FormErrorsProps) => {
  const errorEntries = Object.entries(errors);
  
  if (errorEntries.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-1">
          <p className="font-medium">Veuillez corriger les erreurs suivantes :</p>
          <ul className="list-disc list-inside space-y-1">
            {errorEntries.map(([field, message]) => (
              <li key={field} className="text-sm">
                {message}
              </li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};
