
import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";
import { 
  FileText, 
  BookOpen, 
  Database,
  Image,
  Upload
} from "lucide-react";

const FileManagement = () => {
  const [rhcaFiles, setRhcaFiles] = useState<string[]>([]);
  const [igmFiles, setIgmFiles] = useState<string[]>([]);
  const [indexFiles, setIndexFiles] = useState<string[]>([]);
  const [rhcaCovers, setRhcaCovers] = useState<string[]>([]);
  const [igmCovers, setIgmCovers] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des fichiers" 
        description="Gérer les uploads de fichiers par type de publication"
        backLink="/admin/content"
      />

      <Tabs defaultValue="rhca" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rhca">RHCA</TabsTrigger>
          <TabsTrigger value="igm">IGM</TabsTrigger>
          <TabsTrigger value="index">Index Medicus</TabsTrigger>
          <TabsTrigger value="general">Général</TabsTrigger>
        </TabsList>

        <TabsContent value="rhca" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Articles RHCA
                </CardTitle>
                <CardDescription>
                  Upload d'articles pour la Revue Haïtienne de Chirurgie et Anesthésiologie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiFileUploader
                  bucket="rhca-pdfs"
                  acceptedFileTypes={{
                    'application/pdf': ['.pdf'],
                    'application/msword': ['.doc'],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                  }}
                  maxFileSize={30}
                  maxFiles={10}
                  onUploadComplete={setRhcaFiles}
                  helperText="Formats: PDF, DOC, DOCX - Max: 30MB"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Couvertures RHCA
                </CardTitle>
                <CardDescription>
                  Images de couverture pour les articles RHCA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiFileUploader
                  bucket="rhca_covers"
                  acceptedFileTypes={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif']
                  }}
                  maxFileSize={5}
                  maxFiles={10}
                  onUploadComplete={setRhcaCovers}
                  helperText="Formats: PNG, JPG, JPEG, GIF - Max: 5MB"
                  type="image"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="igm" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Articles IGM
                </CardTitle>
                <CardDescription>
                  Upload d'articles pour Info Gazette Médicale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiFileUploader
                  bucket="igm-pdfs"
                  acceptedFileTypes={{
                    'application/pdf': ['.pdf'],
                    'application/msword': ['.doc'],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                  }}
                  maxFileSize={30}
                  maxFiles={10}
                  onUploadComplete={setIgmFiles}
                  helperText="Formats: PDF, DOC, DOCX - Max: 30MB"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Couvertures IGM
                </CardTitle>
                <CardDescription>
                  Images de couverture pour les articles IGM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiFileUploader
                  bucket="igm_covers"
                  acceptedFileTypes={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif']
                  }}
                  maxFileSize={5}
                  maxFiles={10}
                  onUploadComplete={setIgmCovers}
                  helperText="Formats: PNG, JPG, JPEG, GIF - Max: 5MB"
                  type="image"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="index" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Fichiers Index Medicus
              </CardTitle>
              <CardDescription>
                Upload de documents pour l'Index Medicus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultiFileUploader
                bucket="indexmedicuspdf"
                acceptedFileTypes={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                }}
                maxFileSize={50}
                maxFiles={20}
                onUploadComplete={setIndexFiles}
                helperText="Formats: PDF, DOC, DOCX - Max: 50MB"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Fichiers généraux
                </CardTitle>
                <CardDescription>
                  Upload de fichiers d'articles généraux
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiFileUploader
                  bucket="article_files"
                  acceptedFileTypes={{
                    'application/pdf': ['.pdf'],
                    'application/msword': ['.doc'],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                  }}
                  maxFileSize={30}
                  maxFiles={15}
                  onUploadComplete={() => {}}
                  helperText="Formats: PDF, DOC, DOCX - Max: 30MB"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Annexes et images
                </CardTitle>
                <CardDescription>
                  Upload d'annexes et images d'articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiFileUploader
                  bucket="article_annexes"
                  acceptedFileTypes={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
                  }}
                  maxFileSize={10}
                  maxFiles={15}
                  onUploadComplete={() => {}}
                  helperText="Formats: PNG, JPG, JPEG, GIF, WebP - Max: 10MB"
                  type="image"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileManagement;
