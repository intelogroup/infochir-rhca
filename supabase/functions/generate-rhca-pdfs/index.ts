
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as pdfMake from 'https://esm.sh/pdfmake@0.2.7'
import pdfFonts from 'https://esm.sh/pdfmake@0.2.7/build/vfs_fonts.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Set up pdfMake with fonts
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  try {
    // Define the PDFs to generate
    const pdfsToGenerate = [
      {
        filename: 'RHCA_2021_12_bilan_annuel.pdf',
        title: 'Bilan annuel de la chirurgie 2021',
        authors: ['Dr. Marc Antoine', 'Dr. Julie Pierre'],
        content: 'Revue des avancées majeures en chirurgie au cours de l'année 2021...'
      },
      {
        filename: 'RHCA_2021_12_innovations_robotique.pdf',
        title: 'Innovations en chirurgie robotique 2021',
        authors: ['Dr. Sophie Martin', 'Dr. Paul Dubois'],
        content: 'État des lieux des avancées en chirurgie robotique...'
      },
      {
        filename: 'RHCA_2021_01_protocoles_urgence.pdf',
        title: 'Protocoles en chirurgie d'urgence',
        authors: ['Dr. Pierre Louis', 'Dr. Marie Joseph'],
        content: 'Mise à jour des protocoles de prise en charge en chirurgie d'urgence...'
      },
      {
        filename: 'RHCA_2021_01_traumatologie_urgence.pdf',
        title: 'Traumatologie en urgence : approche actualisée',
        authors: ['Dr. Jean Dupont', 'Dr. Claire Martin'],
        content: 'Nouvelles approches dans la prise en charge des traumatismes en urgence...'
      }
    ];

    for (const pdf of pdfsToGenerate) {
      const docDefinition = {
        content: [
          { text: pdf.title, style: 'header' },
          { text: pdf.authors.join(', '), style: 'authors' },
          { text: '\n\n' },
          { text: pdf.content, style: 'content' }
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          authors: {
            fontSize: 14,
            italic: true,
            color: '#666666'
          },
          content: {
            fontSize: 12,
            alignment: 'justify',
            lineHeight: 1.5
          }
        }
      };

      // Generate PDF
      const pdfDoc = pdfMake.createPdf(docDefinition);
      const pdfBytes = await new Promise<Uint8Array>((resolve) => {
        pdfDoc.getBuffer((buffer) => {
          resolve(new Uint8Array(buffer));
        });
      });

      // Upload to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('rhca-pdfs')
        .upload(pdf.filename, pdfBytes, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${pdf.filename}:`, error);
        throw error;
      }

      console.log(`Successfully uploaded ${pdf.filename}`);
    }

    return new Response(
      JSON.stringify({ message: 'All PDFs generated and uploaded successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})
