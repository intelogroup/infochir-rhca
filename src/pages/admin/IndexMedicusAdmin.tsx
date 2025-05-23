
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { IndexMedicusImporter } from '@/components/admin/IndexMedicusImporter';
import { IndexMedicusFileUploaders } from '@/components/index-medicus/admin/IndexMedicusFileUploaders';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { BUCKET_ID_PDF, BUCKET_ID_COVERS } from '@/lib/analytics/download/storage/index-medicus';

const IndexMedicusAdmin: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handlePdfUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      toast.success(`${urls.length} PDF(s) uploaded successfully`);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleCoverUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      toast.success(`${urls.length} cover image(s) uploaded successfully`);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.info('Refreshing file list...');
  };

  return (
    <AdminLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Index Medicus Administration</h1>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Workflow Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Start by <strong>uploading PDF files</strong> in the "Upload Files" tab</li>
            <li>After uploading, go to the "Import Files" tab</li>
            <li>Use the importer to <strong>add the PDFs to the database</strong> so they appear on the Index Medicus page</li>
            <li>You can upload cover images for the articles if needed</li>
          </ol>
          <p className="mt-3 text-xs text-blue-600">
            Current storage buckets: PDF files: <code>{BUCKET_ID_PDF}</code>, Cover images: <code>{BUCKET_ID_COVERS}</code>
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="importer">Import Files</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Upload new PDF documents and cover images for the Index Medicus.
            </p>
            <IndexMedicusFileUploaders 
              onPdfUploadComplete={handlePdfUploadComplete}
              onCoverUploadComplete={handleCoverUploadComplete}
            />
          </TabsContent>

          <TabsContent value="importer" className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Use this tool to import existing PDF files from the storage bucket into the articles database.
            </p>
            <IndexMedicusImporter key={refreshKey} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default IndexMedicusAdmin;
