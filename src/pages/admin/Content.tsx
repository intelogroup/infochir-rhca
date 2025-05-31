
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Plus, 
  Search, 
  Upload,
  FolderOpen,
  Edit,
  Eye,
  Download
} from "lucide-react";

const ContentStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">89</CardTitle>
        <CardDescription>Articles RHCA</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="default">+5 ce mois</Badge>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">158</CardTitle>
        <CardDescription>Articles IGM</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">+7 ce mois</Badge>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">3,456</CardTitle>
        <CardDescription>Index Medicus</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="outline">Base complète</Badge>
      </CardContent>
    </Card>
  </div>
);

const RecentArticles = () => (
  <Card>
    <CardHeader>
      <CardTitle>Articles récents</CardTitle>
      <CardDescription>Derniers articles publiés</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { title: "Techniques en chirurgie cardiaque", type: "RHCA", date: "15 Jan 2024" },
          { title: "Guide des urgences médicales", type: "IGM", date: "12 Jan 2024" },
          { title: "Protocoles de chirurgie digestive", type: "RHCA", date: "10 Jan 2024" }
        ].map((article, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4" />
              <div>
                <p className="font-medium">{article.title}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">{article.type}</Badge>
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Actions rapides</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Link to="/admin/articles/new">
        <Button variant="outline" className="w-full justify-start">
          <Plus className="h-4 w-4 mr-2" />
          Créer un article
        </Button>
      </Link>
      <Link to="/admin/files">
        <Button variant="outline" className="w-full justify-start">
          <FolderOpen className="h-4 w-4 mr-2" />
          Gérer les fichiers
        </Button>
      </Link>
      <Button variant="outline" className="w-full justify-start">
        <Upload className="h-4 w-4 mr-2" />
        Import en lot
      </Button>
    </CardContent>
  </Card>
);

const ContentActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Gestion du contenu</CardTitle>
      <CardDescription>Actions de gestion des publications</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <Link to="/admin/articles/new">
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel article
        </Button>
      </Link>
      <div className="grid grid-cols-2 gap-2">
        <Link to="/admin/files">
          <Button variant="secondary" className="w-full text-sm">
            <FolderOpen className="h-4 w-4 mr-1" />
            Fichiers
          </Button>
        </Link>
        <Button variant="secondary" className="w-full text-sm">
          <Edit className="h-4 w-4 mr-1" />
          Modifier
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Content = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Gestion du contenu" 
          description="Gérez les articles et publications"
        />
        <div className="flex gap-2">
          <Link to="/admin/files">
            <Button variant="outline">
              <FolderOpen className="h-4 w-4 mr-2" />
              Fichiers
            </Button>
          </Link>
          <Link to="/admin/articles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel article
            </Button>
          </Link>
        </div>
      </div>

      <ContentStats />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rechercher du contenu</CardTitle>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentArticles />
        </div>
        <div className="space-y-6">
          <ContentActions />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Content;
