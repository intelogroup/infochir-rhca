
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// This function uploads founder profile images from the public folder to Supabase storage
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    // Initialize the Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Map of source file paths to destination files in storage
    const imageMap = [
      { source: '/lovable-uploads/0878c37c-8897-4656-af02-a094357c9f8f.png', destFile: 'telemaque.png', founderName: 'Louis-Franck TELEMAQUE' },
      { source: '/lovable-uploads/ade0626d-e1c8-4c08-913e-d755f1426bfd.png', destFile: 'derivois.png', founderName: 'Eunice DERIVOIS' },
      { source: '/lovable-uploads/6f182d14-1e9a-4570-b612-bd8bb9920805.png', destFile: 'pierre.png', founderName: 'Sosthène PIERRE' },
      { source: '/lovable-uploads/07f095b0-c8a1-42bd-89f8-d1618173b710.png', destFile: 'alouidor.png', founderName: 'Jean ALOUIDOR' },
      { source: '/lovable-uploads/1b04ef39-161c-40a8-9706-eecbac750611.png', destFile: 'kernisan.png', founderName: 'Geissly KERNISAN' },
      { source: '/lovable-uploads/038bd7aa-3ffa-482a-bf3b-202d278f40bd.png', destFile: 'eustache.png', founderName: 'Jean-Marie EUSTACHE' },
      { source: '/lovable-uploads/2d519f7b-55bf-4745-b627-f21f2d58caca.png', destFile: 'fabien.png', founderName: 'Denise FABIEN' },
    ];

    const results = [];

    // For each image in the map
    for (const image of imageMap) {
      try {
        // Fetch the image from the public URL
        const sourceUrl = `${supabaseUrl}/storage/v1/object/public/founder_avatars/${image.destFile}`;
        const checkResponse = await fetch(sourceUrl);
        
        // Skip if the image already exists in the bucket
        if (checkResponse.ok) {
          console.log(`Image ${image.destFile} already exists in storage.`);
          
          // Update the founder record to ensure the path is correct
          const { error: updateError } = await supabase
            .from('founders')
            .update({ image_path: `/founder_avatars/${image.destFile}` })
            .eq('name', image.founderName);
            
          if (updateError) {
            console.error(`Error updating founder record for ${image.founderName}:`, updateError);
          }
          
          results.push({
            source: image.source,
            destination: image.destFile,
            status: 'skipped',
            message: 'Image already exists'
          });
          continue;
        }
        
        // If the image doesn't exist, fetch it from its current location
        const response = await fetch(`${supabaseUrl}${image.source}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image from ${image.source}: ${response.statusText}`);
        }
        
        // Get the image data as a Blob
        const imageBlob = await response.blob();
        
        // Upload the image to the founder_avatars bucket
        const { error } = await supabase
          .storage
          .from('founder_avatars')
          .upload(image.destFile, imageBlob, {
            contentType: 'image/png',
            upsert: true
          });
          
        if (error) {
          throw error;
        }
        
        // Update the founder record with the new image path
        const { error: updateError } = await supabase
          .from('founders')
          .update({ image_path: `/founder_avatars/${image.destFile}` })
          .eq('name', image.founderName);
          
        if (updateError) {
          console.error(`Error updating founder record for ${image.founderName}:`, updateError);
        }
        
        results.push({
          source: image.source,
          destination: image.destFile,
          status: 'success',
          message: 'Successfully uploaded'
        });
        
      } catch (error) {
        console.error(`Error processing image ${image.destFile}:`, error);
        
        results.push({
          source: image.source,
          destination: image.destFile,
          status: 'error',
          message: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Founder images upload completed', results }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error handling request:', error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});
