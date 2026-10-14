
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger("MobileDownloadHandler");

/**
 * Enhanced mobile download handler that works across different mobile browsers
 */
export const handleMobileDownload = async (
  url: string,
  fileName: string,
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<boolean> => {
  try {
    logger.log(`Starting mobile download: ${fileName}`);
    
    // Check if the URL is accessible first
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`File not accessible: ${response.status}`);
    }

    // For mobile devices, we use different strategies based on the browser
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isMobile) {
      // Strategy 1: Try to create a downloadable blob (works best on most mobile browsers)
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`File not accessible: ${response.status}`);
        }
        const blob = await response.blob();
        
        // For iOS Safari, we need to open in a new window due to restrictions
        if (isIOS) {
          const newWindow = window.open();
          if (newWindow) {
            const blobUrl = URL.createObjectURL(blob);
            newWindow.location.href = blobUrl;
            
            // Clean up after a delay
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
              newWindow.close();
            }, 1000);
            
            toast.success("PDF ouvert dans un nouvel onglet", {
              description: "Utilisez le bouton de partage pour télécharger"
            });
          } else {
            // Fallback: direct link
            window.location.href = url;
          }
        } else {
          // For Android and other mobile browsers, try the download attribute approach
          const link = document.createElement('a');
          const blobUrl = URL.createObjectURL(blob);
          
          link.href = blobUrl;
          link.download = fileName;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          
          toast.success("Téléchargement démarré", {
            description: "Vérifiez votre dossier de téléchargements"
          });
        }
        
        onSuccess?.();
        return true;
      } catch (blobError) {
        // The file itself could not be retrieved (e.g. the connection
        // dropped mid-download — Safari reports this as "Load failed").
        // Do not fake success by opening the same unreachable URL: let the
        // outer handler report the failure so the reader can retry.
        logger.error("Blob download failed", blobError);
        throw blobError;
      }
    } else {
      // Desktop fallback
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Téléchargement en cours...");
      onSuccess?.();
      return true;
    }
  } catch (error) {
    logger.error("Mobile download failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur de téléchargement";
    
    toast.error("Erreur de téléchargement", {
      // A failed fetch rejects with a TypeError (network failure); other
      // errors here are mostly "file not accessible" HTTP failures — the
      // description must not blame the connection for those.
      description: error instanceof TypeError
        ? "La connexion a été interrompue. Vérifiez votre connexion internet, puis réessayez."
        : "Le fichier n'a pas pu être récupéré. Veuillez réessayer."
    });
    
    onError?.(errorMessage);
    return false;
  }
};

/**
 * Check if we're on a mobile device
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get mobile-specific download instructions
 */
export const getMobileDownloadInstructions = (): string => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  if (isIOS) {
    return "Sur iOS: Le fichier s'ouvrira dans Safari. Utilisez le bouton de partage pour l'enregistrer.";
  } else if (isAndroid) {
    return "Sur Android: Le fichier sera téléchargé dans votre dossier Téléchargements.";
  } else {
    return "Le téléchargement va commencer automatiquement.";
  }
};
