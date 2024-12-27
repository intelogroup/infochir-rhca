import { motion } from "framer-motion";

interface PublicationTypeSelectorProps {
  publicationType: "RHCA" | "IGM";
  setPublicationType: (type: "RHCA" | "IGM") => void;
}

export const PublicationTypeSelector = ({ 
  publicationType, 
  setPublicationType 
}: PublicationTypeSelectorProps) => {
  return (
    <div className="flex justify-center gap-8 mb-8">
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPublicationType("RHCA")}
        className={`relative p-4 rounded-lg border-2 transition-colors ${
          publicationType === "RHCA" 
            ? "border-primary bg-primary/5" 
            : "border-gray-200 hover:border-primary/50"
        }`}
      >
        <img 
          src="/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
          alt="RHCA Logo"
          className="h-20 w-20 object-contain"
        />
      </motion.button>

      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPublicationType("IGM")}
        className={`relative p-4 rounded-lg border-2 transition-colors ${
          publicationType === "IGM" 
            ? "border-primary bg-primary/5" 
            : "border-gray-200 hover:border-primary/50"
        }`}
      >
        <img 
          src="/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
          alt="IGM Logo"
          className="h-20 w-20 object-contain"
        />
      </motion.button>
    </div>
  );
};