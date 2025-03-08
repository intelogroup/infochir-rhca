
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface UserInfoFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  name: string;
  setName: (name: string) => void;
  emailTouched: boolean;
  setEmailTouched: (touched: boolean) => void;
  isProcessing: boolean;
}

export const UserInfoFields = ({
  email,
  setEmail,
  name,
  setName,
  emailTouched,
  setEmailTouched,
  isProcessing
}: UserInfoFieldsProps) => {
  // Email validation
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = emailTouched && !isEmailValid ? "Veuillez entrer une adresse email valide" : null;
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">
          Email <span className="text-destructive">*</span>
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          placeholder="Enter your email"
          required
          aria-invalid={emailError ? "true" : undefined}
          aria-describedby={emailError ? "email-error" : undefined}
          className={emailError ? "border-destructive" : ""}
          disabled={isProcessing}
        />
        {emailError && (
          <p id="email-error" className="text-sm text-destructive mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> 
            {emailError}
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Name (optional)</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          disabled={isProcessing}
        />
      </div>
    </motion.div>
  );
};
