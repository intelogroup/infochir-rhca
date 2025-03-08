
import React from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  RefreshCw, 
  Home,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  XCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { parseError } from '@/utils/errorHandling';
import { useNavigate } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type ErrorSeverity = 'fatal' | 'critical' | 'error' | 'warning' | 'info';

interface ErrorDisplayProps {
  error: Error;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showHomeButton?: boolean;
  showDetails?: boolean;
  severity?: ErrorSeverity;
  context?: string;
  className?: string;
  actions?: React.ReactNode;
  detailsUrl?: string;
}

/**
 * Enhanced error display component with support for different severity levels,
 * technical details, and actions like retry or navigation
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title,
  description,
  onRetry,
  onDismiss,
  showHomeButton = true,
  showDetails = true,
  severity = 'error',
  context,
  className,
  actions,
  detailsUrl
}) => {
  const navigate = useNavigate();
  const parsedError = parseError(error);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  
  // Determine appropriate icon based on severity
  const Icon = {
    fatal: XCircle,
    critical: XCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: AlertCircle
  }[severity];
  
  // Determine variant based on severity
  const variant = {
    fatal: 'destructive',
    critical: 'destructive',
    error: 'destructive',
    warning: 'default',
    info: 'default'
  }[severity] as 'default' | 'destructive';
  
  // Get badge color
  const badgeVariant = {
    fatal: 'destructive',
    critical: 'destructive',
    error: 'destructive',
    warning: 'default',
    info: 'secondary'
  }[severity] as 'default' | 'destructive' | 'secondary';
  
  // Get formatted error title
  const errorTitle = title || parsedError.title;
  
  // Get formatted error description
  const errorDescription = description || parsedError.message;
  
  return (
    <Alert 
      variant={variant} 
      className={cn("my-4", className)}
    >
      <div className="flex items-start gap-2">
        <Icon className="h-5 w-5 mt-0.5" />
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <AlertTitle className="text-lg font-semibold">
              {errorTitle}
            </AlertTitle>
            
            <div className="flex flex-wrap gap-2">
              {context && (
                <Badge variant={badgeVariant} className="text-xs">
                  {context}
                </Badge>
              )}
              
              {severity && (
                <Badge variant={badgeVariant} className="text-xs capitalize">
                  {severity}
                </Badge>
              )}
            </div>
          </div>
          
          <AlertDescription className="space-y-4">
            <p className="text-base leading-relaxed">{errorDescription}</p>
            
            {parsedError.details && (
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {parsedError.details.split('\n').map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            )}
            
            {/* Actions section */}
            <div className="flex flex-wrap gap-2 pt-1">
              {onRetry && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onRetry}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Réessayer
                </Button>
              )}
              
              {showHomeButton && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-1"
                >
                  <Home className="h-3.5 w-3.5 mr-1" />
                  Accueil
                </Button>
              )}
              
              {detailsUrl && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(detailsUrl, '_blank')}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Documentation
                </Button>
              )}
              
              {onDismiss && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onDismiss}
                  className="flex items-center gap-1"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Fermer
                </Button>
              )}
              
              {actions}
            </div>
            
            {/* Technical details section */}
            {showDetails && error.stack && (
              <Collapsible 
                open={detailsOpen} 
                onOpenChange={setDetailsOpen}
                className="pt-2"
              >
                <div className="flex items-center">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                      {detailsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      Détails techniques
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent>
                  <Separator className="my-2" />
                  <div className="bg-muted/50 p-2 rounded text-xs font-mono whitespace-pre-wrap overflow-auto max-h-64">
                    {error.stack}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};
