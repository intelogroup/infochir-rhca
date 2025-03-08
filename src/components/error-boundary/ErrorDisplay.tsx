import React from 'react';
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Bug,
  Home,
  MailWarning,
  MessageCircleWarning,
} from "lucide-react";
import { Link } from 'react-router-dom';

interface ErrorResponse {
  status?: number;
  statusText?: string;
  message?: string;
  name?: string;
  code?: string;
  detail?: string;
  hint?: string;
  // Making sure we have the title property
  title?: string;
}

interface Props {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  resetErrorBoundary: (...args: any[]) => void;
}

const ErrorDisplay: React.FC<Props> = ({ error, errorInfo, resetErrorBoundary }) => {
  const errorResponse = (error as any) as ErrorResponse;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-md rounded-md max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Oops! Une erreur est survenue.</h2>
        </div>

        {errorResponse?.title && (
          <div className="mb-4">
            <h3 className="text-xl font-medium text-gray-700">
              {errorResponse.title}
            </h3>
          </div>
        )}

        {errorResponse?.message && (
          <div className="mb-4">
            <p className="text-gray-600">
              <strong>Message:</strong> {errorResponse.message}
            </p>
          </div>
        )}

        {errorResponse?.detail && (
          <div className="mb-4">
            <p className="text-gray-600">
              <strong>Détails:</strong> {errorResponse.detail}
            </p>
          </div>
        )}

        {errorResponse?.hint && (
          <div className="mb-4">
            <p className="text-gray-600">
              <strong>Conseil:</strong> {errorResponse.hint}
            </p>
          </div>
        )}

        {errorInfo?.componentStack && (
          <details className="mb-4">
            <summary className="text-gray-700 cursor-pointer">
              <span className="flex items-center">
                <Bug className="h-5 w-5 mr-1" />
                Détails du Stack
              </span>
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded-md overflow-auto">
              {errorInfo.componentStack}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <Button onClick={resetErrorBoundary} variant="outline">
            <MessageCircleWarning className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
          <Link to="/">
            <Button variant="secondary">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <a href="mailto:support@example.com">
            <Button variant="default">
              <MailWarning className="h-4 w-4 mr-2" />
              Contacter le support
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
