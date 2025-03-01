
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { RhcaGrid } from "@/components/rhca/RhcaGrid";
import BackToTop from "@/components/navigation/BackToTop";
import { RHCAHeader } from "@/components/rhca/components/RHCAHeader";
import { RHCASidebar } from "@/components/rhca/components/RHCASidebar";
import { useSearchParams } from "react-router-dom";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const RHCA: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  const handlePdfUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      toast.success(`${urls.length} fichier(s) PDF uploadé(s) avec succès`, {
        description: "N'oubliez pas de mettre à jour les références dans la base de données."
      });
      console.log('Uploaded PDF files:', urls);
    }
  };

  const handleCoverUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      toast.success(`${urls.length} image(s) de couverture uploadée(s) avec succès`);
      console.log('Uploaded cover images:', urls);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50 pt-[50px]">
        <RHCAHeader />
        
        <div className="container mx-auto px-4 py-8 md:py-12">
          {isAdmin && (
            <div className="mb-8 p-6 bg-white shadow-sm rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Admin: Upload RHCA Files</h2>
              
              <Alert className="mb-6">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Gestion des fichiers PDF</AlertTitle>
                <AlertDescription>
                  Pour que les PDFs soient correctement associés aux articles, assurez-vous que les noms des fichiers suivent le format <strong>RHCA_vol_XX_no_XX_date.pdf</strong> et correspondent aux entrées dans la base de données.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-md font-medium mb-2">Cover Images</h3>
                  <MultiFileUploader
                    bucket="rhca_covers"
                    acceptedFileTypes={{
                      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                    }}
                    maxFileSize={5}
                    maxFiles={10}
                    onUploadComplete={handleCoverUploadComplete}
                    helperText="Upload cover images for RHCA articles (PNG, JPG, WebP)"
                    type="image"
                    volumeInfo={{
                      volume: '4',
                      issue: '49'
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-md font-medium mb-2">PDF Documents</h3>
                  <MultiFileUploader
                    bucket="rhca-pdfs"
                    acceptedFileTypes={{
                      'application/pdf': ['.pdf']
                    }}
                    maxFileSize={10}
                    maxFiles={5}
                    onUploadComplete={handlePdfUploadComplete}
                    helperText="Upload PDF documents for RHCA articles"
                    type="document"
                    volumeInfo={{
                      volume: '4',
                      issue: '49'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <RhcaGrid />
            </div>
            
            <div className="lg:col-span-1">
              <RHCASidebar />
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
    </MainLayout>
  );
};

export default RHCA;
