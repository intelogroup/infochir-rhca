
import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  BookOpen
} from "lucide-react";
import { Input } from "@/components/ui/input";

const ContentStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">247</CardTitle>
        <CardDescription>Articles totaux</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="default">+12 ce mois</Badge>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">89</CardTitle>
        <CardDescription>Articles RHCA</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">+5 ce mois</Badge>
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

const ArticleRow = ({ article }: { article: any }) => (
  <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <FileText className="h-6 w-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{article.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {article.date}
          </span>
          <Badge variant="secondary" className="text-xs">
            {article.type}
          </Badge>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const mockArticles = [
  {
    id: 1,
    title: "Nouvelles techniques en chirurgie cardiaque",
    author: "Dr. Martin Dubois",
    date: "15 Jan 2024",
    type: "RHCA",
    status: "published"
  },
  {
    id: 2,
    title: "Guide des urgences médicales",
    author: "Dr. Sophie Laurent",
    date: "12 Jan 2024",
    type: "IGM",
    status: "draft"
  },
  {
    id: 3,
    title: "Protocoles de chirurgie digestive",
    author: "Pr. Ahmed Ben Ali",
    date: "10 Jan 2024",
    type: "RHCA",
    status: "published"
  }
];

const Content = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Gestion du contenu" 
          description="Gérez les articles, publications et documents de la plateforme"
        />
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel article
          </Button>
        </div>
      </div>

      <ContentStats />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Articles et publications</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <div className="px-6 pb-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="rhca">RHCA</TabsTrigger>
                <TabsTrigger value="igm">IGM</TabsTrigger>
                <TabsTrigger value="index">Index Medicus</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="divide-y">
                {mockArticles.map((article) => (
                  <ArticleRow key={article.id} article={article} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rhca" className="mt-0">
              <div className="divide-y">
                {mockArticles.filter(a => a.type === "RHCA").map((article) => (
                  <ArticleRow key={article.id} article={article} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="igm" className="mt-0">
              <div className="divide-y">
                {mockArticles.filter(a => a.type === "IGM").map((article) => (
                  <ArticleRow key={article.id} article={article} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="index" className="mt-0">
              <div className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Index Medicus</h3>
                <p className="text-gray-600 mb-4">
                  Gérez la base de données Index Medicus
                </p>
                <Button>
                  Accéder à l'Index Medicus
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Raccourcis pour les tâches courantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Créer un nouvel article
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Importer des PDFs
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Gérer les soumissions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières modifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Article RHCA publié par Dr. Martin</span>
                <span className="text-gray-400 text-xs">Il y a 2h</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Nouveau PDF uploadé pour IGM</span>
                <span className="text-gray-400 text-xs">Il y a 4h</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Index Medicus mis à jour</span>
                <span className="text-gray-400 text-xs">Il y a 1j</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Content;
