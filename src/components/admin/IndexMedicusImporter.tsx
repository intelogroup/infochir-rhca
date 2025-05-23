
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { createLogger } from '@/lib/error-logger';
import { BUCKET_ID_PDF } from '@/lib/analytics/download/storage/index-medicus';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const logger = createLogger('IndexMedicusImporter');

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}

export const IndexMedicusImporter: React.FC = () => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{success: string[], failed: string[]}>({
    success: [],
    failed: []
  });

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.storage
          .from(BUCKET_ID_PDF)
          .list();

        if (error) {
          toast.error('Failed to load files');
          logger.error('Error loading files:', error);
          return;
        }

        if (data) {
          setFiles(data.filter(file => !file.name.startsWith('.')));
        }
      } catch (err) {
        logger.error('Exception fetching files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const importFiles = async () => {
    setImporting(true);
    const success: string[] = [];
    const failed: string[] = [];

    try {
      for (const file of files) {
        try {
          // Get public URL for the file
          const { data } = supabase.storage
            .from(BUCKET_ID_PDF)
            .getPublicUrl(file.name);
  
          const publicUrl = data.publicUrl;
  
          // Parse filename to create a title
          let title = file.name.replace('.pdf', '');
          title = title.replace(/_/g, ' ').replace(/-/g, ' ');
          title = title.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
  
          // Check if article already exists with this PDF URL
          const { data: existingArticle } = await supabase
            .from('articles')
            .select('id')
            .eq('pdf_url', publicUrl)
            .single();
  
          if (existingArticle) {
            logger.log(`Article already exists for ${file.name}`);
            success.push(`${file.name} (already exists)`);
            continue;
          }
  
          // Create new article entry
          const { data: newArticle, error } = await supabase
            .from('articles')
            .insert({
              title: title,
              abstract: `Imported article from ${file.name}`,
              source: 'INDEX',
              pdf_url: publicUrl,
              pdf_filename: file.name,
              publication_date: new Date().toISOString(),
              status: 'published',
              authors: ['Index Medicus Author'],
              category: 'Medical Research',
              tags: ['imported', 'index-medicus']
            })
            .select('id')
            .single();
  
          if (error) {
            logger.error('Error creating article:', error);
            failed.push(file.name);
            continue;
          }
  
          success.push(file.name);
        } catch (fileError) {
          logger.error(`Error processing ${file.name}:`, fileError);
          failed.push(file.name);
        }
      }
  
      setResults({ success, failed });
  
      if (failed.length > 0) {
        toast.warning(`Imported ${success.length} articles, ${failed.length} failed`);
      } else if (success.length > 0) {
        toast.success(`Successfully imported ${success.length} articles`);
      } else {
        toast.info('No new articles to import');
      }
    } catch (err) {
      logger.error('Error during import:', err);
      toast.error('Import process failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-4">Index Medicus File Importer</h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
          <span>Loading files from storage...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="text-md font-medium mb-2">Files in Storage ({files.length})</h3>
            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files found in {BUCKET_ID_PDF} bucket</p>
            ) : (
              <ul className="max-h-48 overflow-y-auto text-sm space-y-1">
                {files.map(file => (
                  <li key={file.id} className="flex items-center">
                    <span className="truncate">{file.name}</span>
                    {results.success.includes(file.name) && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    )}
                    {results.failed.includes(file.name) && (
                      <AlertCircle className="h-4 w-4 text-red-500 ml-2" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {files.length > 0 && (
            <Button 
              onClick={importFiles} 
              disabled={importing || files.length === 0}
              className="w-full"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>Import {files.length} Files to Database</>
              )}
            </Button>
          )}

          {results.success.length > 0 && (
            <div className="border border-green-200 bg-green-50 rounded-md p-4">
              <h4 className="font-medium text-green-800 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Successfully Imported ({results.success.length})
              </h4>
              <p className="text-xs text-green-700 mt-2">
                These files have been added to the articles database and should now appear in the Index Medicus page.
              </p>
            </div>
          )}

          {results.failed.length > 0 && (
            <div className="border border-red-200 bg-red-50 rounded-md p-4">
              <h4 className="font-medium text-red-800 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Failed Imports ({results.failed.length})
              </h4>
              <ul className="text-xs text-red-700 mt-2 list-disc list-inside">
                {results.failed.map((fileName, i) => (
                  <li key={i}>{fileName}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
