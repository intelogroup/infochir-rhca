
import React from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { IndexMedicusImporter } from '@/components/admin/IndexMedicusImporter';
import { IndexMedicusFileUploaders } from '@/components/index-medicus/admin/IndexMedicusFileUploaders';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const IndexMedicusAdmin: React.FC = () => {
  const handlePdfUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      toast.success(`${urls.length} PDF(s) uploaded successfully`);
    }
  };

  const handleCoverUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      toast.success(`${urls.length} cover image(s) uploaded successfully`);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Index Medicus Administration</h1>

        <Tabs defaultValue="importer" className="space-y-6">
          <TabsList>
            <TabsTrigger value="importer">Import Files</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>

          <TabsContent value="importer" className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Use this tool to import existing PDF files from the storage bucket into the articles database.
            </p>
            <IndexMedicusImporter />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Upload new PDF documents and cover images for the Index Medicus.
            </p>
            <IndexMedicusFileUploaders 
              onPdfUploadComplete={handlePdfUploadComplete}
              onCoverUploadComplete={handleCoverUploadComplete}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default IndexMedicusAdmin;
