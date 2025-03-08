
import { useState, useEffect } from "react";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

interface NetworkStatusMonitorProps {
  showToasts?: boolean;
  children: React.ReactNode;
}

export const NetworkStatusMonitor = ({ 
  showToasts = true, 
  children 
}: NetworkStatusMonitorProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline && showToasts) {
        toast.success("Connecté", {
          description: "Vous êtes de nouveau connecté à Internet",
          icon: <Wifi className="text-green-500 h-4 w-4" />
        });
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      if (showToasts) {
        toast.error("Hors ligne", {
          description: "Vous êtes actuellement hors ligne",
          icon: <WifiOff className="text-red-500 h-4 w-4" />,
          duration: Infinity // Keep until online again
        });
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline, showToasts]);

  if (!isOnline) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90">
        <div className="text-center p-6 max-w-md">
          <div className="bg-yellow-100 p-4 rounded-full inline-flex mx-auto mb-4">
            <WifiOff className="h-8 w-8 text-yellow-700" />
          </div>
          <h2 className="text-xl font-bold mb-2">Vous êtes hors ligne</h2>
          <p className="mb-6 text-gray-600">
            Vérifiez votre connexion internet et réessayez
          </p>
          <div className="animate-pulse bg-gray-100 text-gray-500 py-2 px-4 rounded inline-flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            En attente de connexion...
          </div>
        </div>
      </div>
    );
  }

  return children;
};
