
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
  Database,
  FileText,
  Users
} from "lucide-react";

const IndexStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">3,456</CardTitle>
        <CardDescription>Total Index Entries</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="default">Complete Database</Badge>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">1,234</CardTitle>
        <CardDescription>RHCA Articles</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">Active</Badge>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">987</CardTitle>
        <CardDescription>IGM Articles</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">Active</Badge>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">543</CardTitle>
        <CardDescription>ADC Articles</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">Active</Badge>
      </CardContent>
    </Card>
  </div>
);

const RecentEntries = () => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Index Entries</CardTitle>
      <CardDescription>Latest additions across all journals</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { title: "Advances in cardiac surgery", journal: "RHCA", year: "2024", type: "Research" },
          { title: "Emergency medicine protocols", journal: "IGM", year: "2024", type: "Guidelines" },
          { title: "Digestive surgery innovations", journal: "ADC", year: "2023", type: "Review" },
          { title: "Index medicus compilation", journal: "INDEX", year: "2024", type: "Compilation" }
        ].map((entry, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4" />
              <div>
                <p className="font-medium">{entry.title}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{entry.journal}</Badge>
                  <Badge variant="secondary">{entry.type}</Badge>
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
      <CardTitle>Index Management</CardTitle>
      <CardDescription>Manage the unified medical index</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <Button variant="outline" className="w-full justify-start">
        <Upload className="h-4 w-4 mr-2" />
        Import CSV Data
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Download className="h-4 w-4 mr-2" />
        Export Database
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Plus className="h-4 w-4 mr-2" />
        Add Index Entry
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <FileText className="h-4 w-4 mr-2" />
        Sync Journals
      </Button>
    </CardContent>
  </Card>
);

const IndexMedicus = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Index Medicus Administration" 
          description="Unified medical database reflecting RHCA, IGM, ADC journals and Index Medicus entries"
        />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Index Entry
        </Button>
      </div>

      <IndexStats />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Search Unified Index
            </CardTitle>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search across all journals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          <CardDescription>
            Comprehensive search across RHCA, IGM, ADC journals and Index Medicus specific entries
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEntries />
        <IndexActions />
      </div>
    </div>
  );
};

export default IndexMedicus;
