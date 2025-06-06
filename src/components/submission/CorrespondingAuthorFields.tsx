
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { AuthorField } from "./author/AuthorField";

interface CorrespondingAuthorFieldsProps {
  form: any;
  hasSubmissionAttempt?: boolean;
}

export const CorrespondingAuthorFields = ({ form, hasSubmissionAttempt = false }: CorrespondingAuthorFieldsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold">Auteur correspondant</h3>
      <div className="grid gap-4">
        <AuthorField
          form={form}
          name="correspondingAuthor.name"
          label="Nom complet *"
          icon={User}
          placeholder="Nom et prénom"
          hasSubmissionAttempt={hasSubmissionAttempt}
        />

        <AuthorField
          form={form}
          name="correspondingAuthor.email"
          label="Email *"
          icon={Mail}
          type="email"
          placeholder="exemple@domain.com"
          hasSubmissionAttempt={hasSubmissionAttempt}
        />

        <AuthorField
          form={form}
          name="correspondingAuthor.phone"
          label="Téléphone"
          icon={Phone}
          placeholder="+1234567890"
          hasSubmissionAttempt={hasSubmissionAttempt}
        />

        <AuthorField
          form={form}
          name="correspondingAuthor.address"
          label="Adresse"
          icon={MapPin}
          placeholder="Adresse professionnelle"
          hasSubmissionAttempt={hasSubmissionAttempt}
        />
      </div>
    </motion.div>
  );
};
