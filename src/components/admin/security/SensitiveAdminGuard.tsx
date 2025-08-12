import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, AlertTriangle } from "lucide-react";
import { useAdminSecurity } from './AdminSecurityProvider';

interface SensitiveAdminGuardProps {
  children: ReactNode;
  title: string;
  description: string;
  requireConfirmation?: boolean;
  requirePassword?: boolean;
  confirmText?: string;
  level?: 'high' | 'critical';
}

export const SensitiveAdminGuard: React.FC<SensitiveAdminGuardProps> = ({
  children,
  title,
  description,
  requireConfirmation = true,
  requirePassword = false,
  confirmText,
  level = 'high'
}) => {
  const { confirmAction } = useAdminSecurity();
  const [isUnlocked, setIsUnlocked] = React.useState(!requireConfirmation);

  const handleUnlock = async () => {
    if (!requireConfirmation) {
      setIsUnlocked(true);
      return;
    }

    try {
      await confirmAction({
        title: `Accès à: ${title}`,
        description: `Cette action nécessite une confirmation. ${description}`,
        confirmText: confirmText || "Autoriser l'accès",
        requirePassword,
        variant: level === 'critical' ? 'destructive' : 'default',
        eventType: 'admin_sensitive_access',
        eventData: { 
          section: title,
          level,
          timestamp: new Date().toISOString()
        }
      });
      
      setIsUnlocked(true);
    } catch (error) {
      console.error('Access denied:', error);
    }
  };

  if (!isUnlocked) {
    return (
      <Card className="border-warning">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex">
              <Shield className="h-5 w-5 text-warning" />
              {level === 'critical' && <Lock className="h-4 w-4 text-destructive -ml-1" />}
            </div>
            <CardTitle className="text-warning">Zone Sensible</CardTitle>
          </div>
          <CardDescription>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm mt-1">{description}</p>
                {level === 'critical' && (
                  <p className="text-destructive text-sm mt-2 font-medium">
                    ⚠️ Zone critique - Accès restreint
                  </p>
                )}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleUnlock}
            variant={level === 'critical' ? 'destructive' : 'default'}
            className="w-full"
          >
            <Lock className="h-4 w-4 mr-2" />
            {confirmText || "Débloquer l'accès"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};