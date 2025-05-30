
import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Content = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion du contenu" 
        description="Gérez les articles, publications et contenus de la plateforme"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Articles RHCA
            </CardTitle>
            <CardDescription>
              Gérer les articles de la Revue Haïtienne de Chirurgie et d'Anesthésiologie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Ajoutez, modifiez ou supprimez des articles RHCA.
            </p>
            <Button asChild>
              <Link to="/admin/uploads">Gérer RHCA</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Articles IGM
            </CardTitle>
            <CardDescription>
              Gérer les numéros d'Infochir-Geste & Mémoire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Ajoutez, modifiez ou supprimez des numéros IGM.
            </p>
            <Button variant="outline">Gérer IGM</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Index Medicus
            </CardTitle>
            <CardDescription>
              Gérer la base de données Index Medicus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Importez et gérez les articles de l'Index Medicus.
            </p>
            <Button asChild>
              <Link to="/admin/index-medicus">Gérer Index Medicus</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Raccourcis pour les tâches courantes de gestion de contenu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvel article
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Modifier contenu
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Nettoyer archives
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Content;
