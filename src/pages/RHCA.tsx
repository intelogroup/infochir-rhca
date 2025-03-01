
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
import { useState, useEffect } from "react";
import { checkFileExistsInBucket } from "@/lib/pdf-utils";

const RHCA: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const [pdfFilesStatus, setPdfFilesStatus] = useState<Record<string, boolean>>({});
  const [coverFilesStatus, setCoverFilesStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isAdmin) {
      const checkFiles = async () => {
        const volumeIssues = ['2:47', '3:48', '4:49'];
        const pdfStatus: Record<string, boolean> = {};
        const coverStatus: Record<string, boolean> = {};
        
        // PDF file naming pattern: RHCA_vol_XX_no_XX_date.pdf
        for (const vi of volumeIssues) {
          const [volume, issue] = vi.split(':');
          const pdfFilePattern = `RHCA_vol_${volume.padStart(2, '0')}_no_${issue}`;
          const coverFilePattern = `RHCA_vol_${volume.padStart(2, '0')}_no_${issue}_cover`;
          
          // Check for PDFs
          const { data: pdfFiles } = await supabase.storage
            .from('rhca-pdfs')
            .list('', { search: pdfFilePattern });
            
          pdfStatus[vi] = pdfFiles && pdfFiles.length > 0;
          
          // Check for covers
          const { data: coverFiles } = await supabase.storage
            .from('rhca_covers')
            .list('', { search: coverFilePattern });
            
          coverStatus[vi] = coverFiles && coverFiles.length > 0;
        }
        
        setPdfFilesStatus(pdfStatus);
        setCoverFilesStatus(coverStatus);
      };
      
      checkFiles();
    }
  }, [isAdmin]);

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
                <AlertTitle>Gestion des fichiers RHCA</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>Pour que les fichiers soient correctement associés aux articles, suivez ces conventions de nommage:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>PDF:</strong> RHCA_vol_XX_no_XX_date.pdf (ex: RHCA_vol_04_no_49_11_1_2025.pdf)</li>
                    <li><strong>Couvertures:</strong> RHCA_vol_XX_no_XX_cover.jpg (ex: RHCA_vol_04_no_49_cover.jpg)</li>
                  </ul>
                  <p className="text-sm mt-2">
                    <strong>Statut des fichiers:</strong>
                    {Object.entries(pdfFilesStatus).length > 0 && (
                      <span className="block mt-1">
                        PDFs: {Object.entries(pdfFilesStatus).map(([vi, exists]) => (
                          <span key={`pdf-${vi}`} className={`inline-flex items-center mr-2 px-2 py-1 rounded-full text-xs ${exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            Vol {vi.split(':')[0]}, No {vi.split(':')[1]}: {exists ? '✓' : '✗'}
                          </span>
                        ))}
                      </span>
                    )}
                    {Object.entries(coverFilesStatus).length > 0 && (
                      <span className="block mt-1">
                        Covers: {Object.entries(coverFilesStatus).map(([vi, exists]) => (
                          <span key={`cover-${vi}`} className={`inline-flex items-center mr-2 px-2 py-1 rounded-full text-xs ${exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            Vol {vi.split(':')[0]}, No {vi.split(':')[1]}: {exists ? '✓' : '✗'}
                          </span>
                        ))}
                      </span>
                    )}
                  </p>
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
