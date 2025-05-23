
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define allowed buckets - updated to include our new bucket
const validBuckets = [
  'rhca-pdfs', 
  'indexmedicus_pdfs', 
  'indexmedicuspdf',  // This is the bucket you've created
  'igm-pdfs', 
  'article-pdfs', 
  'rhca_covers', 
  'indexmedicus_covers',
  'article_files',
  'article_annexes'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const bucketName = formData.get('bucket') || 'rhca-pdfs'

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Validate the bucket name to prevent security issues
    if (!validBuckets.includes(bucketName.toString())) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid bucket name', 
          provided: bucketName.toString(), 
          validOptions: validBuckets 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Sanitize filename - remove non-ASCII characters
    const sanitizedFileName = (file as File).name.replace(/[^\x00-\x7F]/g, '')
    
    // Upload file to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName.toString())
      .upload(sanitizedFileName, file, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'File uploaded successfully', path: sanitizedFileName, bucket: bucketName }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
