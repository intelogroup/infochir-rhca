import { useIsMobile } from "@/hooks/use-mobile";

interface UploadInstructionsProps {
  isDragActive: boolean;
  type?: 'document' | 'image';
  currentFileCount: number;
  maxFiles: number;
  helperText?: string;
}

export const UploadInstructions = ({
  isDragActive,
  type = 'document',
  currentFileCount,
  maxFiles,
  helperText
}: UploadInstructionsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        {isDragActive 
          ? "Déposez les fichiers ici" 
          : isMobile 
            ? type === 'image'
              ? "Appuyez pour prendre une photo ou choisir une image"
              : "Appuyez pour choisir un fichier"
            : "Cliquez ou déposez vos fichiers ici"}
      </p>
      {currentFileCount >= maxFiles && (
        <p className="text-xs text-red-500">
          Nombre maximum de fichiers atteint
        </p>
      )}
      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      <p className="text-xs text-gray-400">
        {type === 'image' 
          ? "Vous pouvez aussi coller une image depuis le presse-papier" 
          : "Vous pouvez aussi coller un fichier depuis le presse-papier"}
      </p>
    </div>
  );
};