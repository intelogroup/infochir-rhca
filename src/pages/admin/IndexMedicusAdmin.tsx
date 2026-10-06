
import * as React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const useIndexEntries = () =>
  useQuery({
    queryKey: ['admin-index-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, category, publication_date, created_at')
        .eq('source', 'INDEX')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

const IndexStats = () => {
  const { data: entries = [] } = useIndexEntries();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const addedThisMonth = entries.filter((e) => (e.created_at ?? '') >= monthStart).length;
  const categories = new Set(entries.map((e) => e.category).filter(Boolean)).size;
  const items = [
    { value: entries.length, label: 'Entrées totales', badge: 'default', badgeText: 'Index Medicus' },
    { value: addedThisMonth, label: 'Ajouts ce mois', badge: 'secondary', badgeText: 'Ce mois' },
    { value: categories, label: 'Catégories', badge: 'outline', badgeText: 'Distinctes' },
  ] as const;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {items.map((i) => (
        <Card key={i.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{i.value.toLocaleString('fr-FR')}</CardTitle>
            <CardDescription>{i.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={i.badge}>{i.badgeText}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const RecentEntries = () => {
  const { data: entries = [] } = useIndexEntries();
  return (
  <Card>
    <CardHeader>
      <CardTitle>Entrées récentes</CardTitle>
      <CardDescription>Dernières additions à l'Index Medicus</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {entries.slice(0, 5).map((entry) => (
          <div key={entry.id} className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4" />
              <div>
                <p className="font-medium">{entry.title}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{entry.category}</Badge>
                  <span className="text-xs text-muted-foreground">{entry.publication_date?.slice(0, 4)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
  );
};

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
