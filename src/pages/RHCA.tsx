
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { RhcaGrid } from "@/components/rhca/RhcaGrid";
import BackToTop from "@/components/navigation/BackToTop";
import { RHCAHeader } from "@/components/rhca/components/RHCAHeader";
import { RHCASidebar } from "@/components/rhca/components/RHCASidebar";
import { useSearchParams } from "react-router-dom";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";

const RHCA: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50 pt-[50px]">
        <RHCAHeader />
        
        <div className="container mx-auto px-4 py-8 md:py-12">
          {isAdmin && (
            <div className="mb-8 p-6 bg-white shadow-sm rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Admin: Upload RHCA Cover Images</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-md font-medium mb-2">Cover Images</h3>
                  <MultiFileUploader
                    bucket="rhca-covers"
                    acceptedFileTypes={{
                      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                    }}
                    maxFileSize={5}
                    maxFiles={10}
                    onUploadComplete={(urls) => {
                      console.log('Uploaded cover images:', urls);
                    }}
                    helperText="Upload cover images for RHCA articles (PNG, JPG, WebP)"
                    type="image"
                    volumeInfo={{
                      volume: '2',
                      issue: '48'
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
