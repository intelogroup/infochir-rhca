
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RenamePDFFiles } from "./admin/RenamePDFFiles";

export const AdminPanel: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Administration RHCA</CardTitle>
        <CardDescription>
          Gérez les articles, volumes et autres fonctionnalités de la RHCA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="files">
          <TabsList className="mb-4">
            <TabsTrigger value="files">Fichiers</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="volumes">Volumes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="files" className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <RenamePDFFiles />
            </div>
          </TabsContent>
          
          <TabsContent value="articles">
            <p>Gestion des articles - Fonctionnalité à venir</p>
          </TabsContent>
          
          <TabsContent value="volumes">
            <p>Gestion des volumes - Fonctionnalité à venir</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
