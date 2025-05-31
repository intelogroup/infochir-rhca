
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Plus, 
  Search, 
  Upload,
  FolderOpen,
  Edit,
  Eye,
  Download,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  Filter,
  SortDesc,
  Grid3X3,
  List,
  BookOpen
} from "lucide-react";

// Enhanced stats with modern card design and better visual hierarchy
const ContentStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-blue-900">89</CardTitle>
        <CardDescription className="text-blue-700 font-medium">Articles RHCA</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-blue-500 text-white">+5 ce mois</Badge>
          <span className="text-xs text-blue-600">↗ 5.9%</span>
        </div>
      </CardContent>
    </Card>
    
    <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-green-600" />
          </div>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-900">158</CardTitle>
        <CardDescription className="text-green-700 font-medium">Articles IGM</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700">+7 ce mois</Badge>
          <span className="text-xs text-green-600">↗ 4.6%</span>
        </div>
      </CardContent>
    </Card>
    
    <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
          <Users className="h-4 w-4 text-purple-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-purple-900">3,456</CardTitle>
        <CardDescription className="text-purple-700 font-medium">Index Medicus</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="outline" className="border-purple-200 text-purple-700">Base complète</Badge>
      </CardContent>
    </Card>

    <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Eye className="h-5 w-5 text-orange-600" />
          </div>
          <Clock className="h-4 w-4 text-orange-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-orange-900">12.4k</CardTitle>
        <CardDescription className="text-orange-700 font-medium">Vues ce mois</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">+12% vs mois dernier</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Enhanced recent articles with better typography and spacing
const RecentArticles = () => (
  <Card className="border-0 shadow-sm">
    <CardHeader className="border-b border-gray-100 bg-gray-50/50">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Articles récents</CardTitle>
          <CardDescription className="mt-1">Derniers articles publiés et leur statut</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <SortDesc className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-0">
      <div className="divide-y divide-gray-100">
        {[
          { title: "Techniques en chirurgie cardiaque", type: "RHCA", date: "15 Jan 2024", status: "published", views: "234" },
          { title: "Guide des urgences médicales", type: "IGM", date: "12 Jan 2024", status: "draft", views: "89" },
          { title: "Protocoles de chirurgie digestive", type: "RHCA", date: "10 Jan 2024", status: "review", views: "156" }
        ].map((article, index) => (
          <div key={index} className="p-4 hover:bg-gray-50/50 transition-colors group">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge 
                      variant={article.type === "RHCA" ? "default" : "secondary"}
                      className="text-xs font-medium"
                    >
                      {article.type}
                    </Badge>
                    <span className="text-xs text-gray-500">{article.date}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{article.views}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-gray-900">
          Voir tous les articles
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Enhanced quick actions with better visual design
const QuickActions = () => (
  <Card className="border-0 shadow-sm">
    <CardHeader className="border-b border-gray-100 bg-gray-50/50">
      <CardTitle className="text-lg font-semibold">Actions rapides</CardTitle>
      <CardDescription>Raccourcis vers les tâches fréquentes</CardDescription>
    </CardHeader>
    <CardContent className="p-4 space-y-3">
      <Link to="/admin/articles/new">
        <Button className="w-full justify-start h-11 bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Plus className="h-4 w-4 mr-3" />
          <div className="text-left">
            <div className="font-medium">Créer un article</div>
            <div className="text-xs opacity-90">Nouveau contenu</div>
          </div>
        </Button>
      </Link>
      
      <Link to="/admin/files">
        <Button variant="outline" className="w-full justify-start h-11 border-gray-200 hover:bg-gray-50">
          <FolderOpen className="h-4 w-4 mr-3 text-gray-600" />
          <div className="text-left">
            <div className="font-medium text-gray-900">Gérer les fichiers</div>
            <div className="text-xs text-gray-500">Organisation des documents</div>
          </div>
        </Button>
      </Link>
      
      <Button variant="outline" className="w-full justify-start h-11 border-gray-200 hover:bg-gray-50">
        <Upload className="h-4 w-4 mr-3 text-gray-600" />
        <div className="text-left">
          <div className="font-medium text-gray-900">Import en lot</div>
          <div className="text-xs text-gray-500">Importer plusieurs fichiers</div>
        </div>
      </Button>
    </CardContent>
  </Card>
);

// Enhanced content management section
const ContentManagement = () => (
  <Card className="border-0 shadow-sm">
    <CardHeader className="border-b border-gray-100 bg-gray-50/50">
      <CardTitle className="text-lg font-semibold">Gestion du contenu</CardTitle>
      <CardDescription>Outils de publication et modération</CardDescription>
    </CardHeader>
    <CardContent className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" size="sm" className="h-9 justify-start bg-gray-100 hover:bg-gray-200 text-gray-700">
          <Grid3X3 className="h-4 w-4 mr-2" />
          Vue grille
        </Button>
        <Button variant="ghost" size="sm" className="h-9 justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <List className="h-4 w-4 mr-2" />
          Vue liste
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <Button variant="ghost" size="sm" className="w-full justify-start h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <Edit className="h-4 w-4 mr-2" />
          Brouillons (3)
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <Eye className="h-4 w-4 mr-2" />
          En révision (2)
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <BarChart3 className="h-4 w-4 mr-2" />
          Statistiques
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Content = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8">
      {/* Enhanced header with better spacing and modern design */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <PageHeader 
            title="Gestion du contenu" 
            description="Créez, organisez et publiez vos articles et documents"
          />
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/files">
            <Button variant="outline" className="h-10 border-gray-200 hover:bg-gray-50">
              <FolderOpen className="h-4 w-4 mr-2" />
              Fichiers
            </Button>
          </Link>
          <Link to="/admin/articles/new">
            <Button className="h-10 bg-primary hover:bg-primary/90 shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel article
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced stats section */}
      <ContentStats />

      {/* Enhanced search section with modern design */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">Rechercher du contenu</CardTitle>
              <CardDescription className="mt-1">Trouvez rapidement vos articles et documents</CardDescription>
            </div>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un article, auteur, tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced layout with better responsive design */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <RecentArticles />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <ContentManagement />
        </div>
      </div>
    </div>
  );
};

export default Content;
