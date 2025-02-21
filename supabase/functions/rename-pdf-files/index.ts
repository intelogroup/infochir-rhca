
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const targetFileNames = [
  'RHCA_2024_03_chirurgie_robotique.pdf',
  'RHCA_2023_12_retrospective_chirurgicale.pdf',
  'RHCA_2023_09_neurochirurgie.pdf',
  'RHCA_2023_06_anevrismes.pdf',
  'RHCA_2023_03_mini_invasive.pdf',
  'RHCA_2022_12_bilan_annuel.pdf'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // List all files in the bucket
    const { data: files, error: listError } = await supabase
      .storage
      .from('rhca-pdfs')
      .list()

    if (listError) {
      console.error('Error listing files:', listError)
      return new Response(
        JSON.stringify({ error: 'Failed to list files', details: listError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Current files in bucket:', files)

    const results = []

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const newName = targetFileNames[i]
      
      if (!newName) continue

      // Download the file
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('rhca-pdfs')
        .download(file.name)

      if (downloadError) {
        console.error(`Error downloading file ${file.name}:`, downloadError)
        results.push({ error: `Failed to download ${file.name}`, details: downloadError })
        continue
      }

      // Upload with new name
      const { error: uploadError } = await supabase
        .storage
        .from('rhca-pdfs')
        .upload(newName, fileData, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (uploadError) {
        console.error(`Error uploading file ${newName}:`, uploadError)
        results.push({ error: `Failed to upload ${newName}`, details: uploadError })
        continue
      }

      // Remove old file if different name
      if (file.name !== newName) {
        const { error: deleteError } = await supabase
          .storage
          .from('rhca-pdfs')
          .remove([file.name])

        if (deleteError) {
          console.error(`Error deleting old file ${file.name}:`, deleteError)
          results.push({ error: `Failed to delete old file ${file.name}`, details: deleteError })
          continue
        }
      }

      results.push({ success: `Successfully renamed ${file.name} to ${newName}` })
    }

    return new Response(
      JSON.stringify({ message: 'File renaming completed', results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
