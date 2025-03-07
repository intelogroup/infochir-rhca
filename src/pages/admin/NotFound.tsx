
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <div className="bg-yellow-50 p-3 rounded-full mb-6">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-3">Page d'administration non trouvée</h1>
        
        <p className="text-gray-600 mb-8">
          La page d'administration que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            variant="default" 
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Retour à la page précédente
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="flex-1"
          >
            <Link to="/admin">
              Tableau de bord
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotFound;
