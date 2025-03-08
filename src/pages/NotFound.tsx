
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Page non trouvée | Infochir-RHCA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="bg-yellow-50 p-3 rounded-full mb-6">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-3">Page non trouvée</h1>
          
          <p className="text-gray-600 mb-8">
            Il semble que vous ayez suivi un lien cassé ou entré une URL qui n'existe pas sur ce site.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              variant="default" 
              onClick={() => navigate(-1)}
              className="flex-1 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la page précédente
            </Button>
            
            <Button 
              variant="outline" 
              asChild
              className="flex-1 gap-2"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
