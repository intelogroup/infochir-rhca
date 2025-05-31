
import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Upload, 
  Search, 
  Download,
  Plus,
  Database
} from "lucide-react";

const IndexStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <Badge variant="secondary">+8.5%</Badge>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">89</CardTitle>
        <CardDescription>Journaux référencés</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="outline">Actifs</Badge>
      </CardContent>
    </Card>
  </div>
);

const RecentEntries = () => (
  <Card>
    <CardHeader>
      <CardTitle>Entrées récentes</CardTitle>
      <CardDescription>Dernières additions à l'Index Medicus</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { title: "Advances in cardiac surgery", journal: "Cardiovascular Surgery", year: "2024" },
          { title: "Emergency medicine protocols", journal: "Emergency Medicine", year: "2024" },
          { title: "Digestive surgery innovations", journal: "Surgery Review", year: "2023" }
        ].map((entry, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4" />
              <div>
                <p className="font-medium">{entry.title}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{entry.journal}</Badge>
                  <span className="text-xs text-muted-foreground">{entry.year}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const IndexActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Actions Index Medicus</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Button variant="outline" className="w-full justify-start">
        <Upload className="h-4 w-4 mr-2" />
        Importer CSV
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Download className="h-4 w-4 mr-2" />
        Exporter base
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle entrée
      </Button>
    </CardContent>
  </Card>
);

const IndexMedicusAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Index Medicus" 
          description="Gestion de la base de données médicale"
        />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle entrée
        </Button>
      </div>

      <IndexStats />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Rechercher dans l'index
            </CardTitle>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher dans l'index..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEntries />
        <IndexActions />
      </div>
    </div>
  );
};

export default IndexMedicusAdmin;
