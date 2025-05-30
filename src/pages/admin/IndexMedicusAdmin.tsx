
import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Upload, 
  Search, 
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Database
} from "lucide-react";

const IndexMedicusRow = ({ entry }: { entry: any }) => (
  <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
        <BookOpen className="h-6 w-6 text-purple-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{entry.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {entry.year}
          </span>
          <span>Vol. {entry.volume}, N° {entry.issue}</span>
          <Badge variant="secondary" className="text-xs">
            {entry.journal}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">{entry.authors}</p>
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

const mockIndexEntries = [
  {
    id: 1,
    title: "Advances in cardiac surgery techniques",
    authors: "Smith J., Johnson M., Brown K.",
    journal: "Cardiovascular Surgery",
    year: "2024",
    volume: "15",
    issue: "3",
    pages: "123-145"
  },
  {
    id: 2,
    title: "Emergency medicine protocols update",
    authors: "Davis L., Wilson R.",
    journal: "Emergency Medicine Journal",
    year: "2024",
    volume: "22",
    issue: "1",
    pages: "45-67"
  },
  {
    id: 3,
    title: "Digestive surgery innovations",
    authors: "Martin P., Garcia S., Lee T.",
    journal: "Digestive Surgery Review",
    year: "2023",
    volume: "18",
    issue: "4",
    pages: "234-256"
  }
];

const IndexMedicusAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Index Medicus" 
          description="Gestion de la base de données Index Medicus"
        />
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button>
            <BookOpen className="h-4 w-4 mr-2" />
            Nouvelle entrée
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">3,456</CardTitle>
            <CardDescription>Entrées totales</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default">Base complète</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">124</CardTitle>
            <CardDescription>Ajouts ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default">+8.5%</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">89</CardTitle>
            <CardDescription>Journaux référencés</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Actifs</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">2024</CardTitle>
            <CardDescription>Dernière année</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="bg-green-600">À jour</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Base de données Index Medicus</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher dans l'index..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <div className="px-6 pb-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Toutes les entrées</TabsTrigger>
                <TabsTrigger value="recent">Récentes</TabsTrigger>
                <TabsTrigger value="journals">Par journal</TabsTrigger>
                <TabsTrigger value="years">Par année</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="divide-y">
                {mockIndexEntries.map((entry) => (
                  <IndexMedicusRow key={entry.id} entry={entry} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="mt-0">
              <div className="divide-y">
                {mockIndexEntries.filter(e => e.year === "2024").map((entry) => (
                  <IndexMedicusRow key={entry.id} entry={entry} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="journals" className="mt-0">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["Cardiovascular Surgery", "Emergency Medicine Journal", "Digestive Surgery Review"].map((journal, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{journal}</CardTitle>
                        <CardDescription>
                          {Math.floor(Math.random() * 50) + 10} entrées
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" size="sm" className="w-full">
                          Voir les entrées
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="years" className="mt-0">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {["2024", "2023", "2022", "2021"].map((year, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{year}</CardTitle>
                        <CardDescription>
                          {Math.floor(Math.random() * 200) + 50} entrées
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" size="sm" className="w-full">
                          Parcourir {year}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Actions rapides
            </CardTitle>
            <CardDescription>Outils de gestion de l'Index Medicus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Importer un fichier CSV
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Exporter la base complète
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Ajouter une entrée manuelle
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques récentes</CardTitle>
            <CardDescription>Activité sur l'Index Medicus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">15 nouvelles entrées ajoutées</span>
                <span className="text-gray-400 text-xs">Aujourd'hui</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Base mise à jour</span>
                <span className="text-gray-400 text-xs">Il y a 2h</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Nouveau journal référencé</span>
                <span className="text-gray-400 text-xs">Il y a 1j</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexMedicusAdmin;
