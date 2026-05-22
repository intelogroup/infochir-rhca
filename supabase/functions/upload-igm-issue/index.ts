import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json();
    const { pdfBase64, coverBase64, pdfFilename, coverFilename, article } = body;

    const b64ToBytes = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

    if (pdfBase64) {
      const { error: e1 } = await supabase.storage
        .from('igm-pdfs')
        .upload(pdfFilename, b64ToBytes(pdfBase64), { contentType: 'application/pdf', upsert: true });
      if (e1) throw new Error('pdf upload: ' + e1.message);
    }

    if (coverBase64) {
      const { error: e2 } = await supabase.storage
        .from('igm_covers')
        .upload(coverFilename, b64ToBytes(coverBase64), { contentType: 'image/png', upsert: true });
      if (e2) throw new Error('cover upload: ' + e2.message);
    }

    let articleResult = null;
    if (article) {
      const url = Deno.env.get('SUPABASE_URL')!;
      const articleData = {
        ...article,
        pdf_url: `${url}/storage/v1/object/public/igm-pdfs/${pdfFilename}`,
        image_url: `${url}/storage/v1/object/public/igm_covers/${coverFilename}`,
        pdf_filename: pdfFilename,
        cover_image_filename: coverFilename,
      };
      const { data, error } = await supabase.from('articles').insert(articleData).select().single();
      if (error) throw new Error('insert: ' + error.message);
      articleResult = data;
    }

    return new Response(JSON.stringify({ ok: true, article: articleResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
