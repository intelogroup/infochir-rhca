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

    const { coverBase64, coverFilename, bucket, articleIds } = await req.json();

    if (!coverBase64 || !coverFilename || !bucket) {
      throw new Error('coverBase64, coverFilename, bucket required');
    }

    const bytes = Uint8Array.from(atob(coverBase64), c => c.charCodeAt(0));
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(coverFilename, bytes, { contentType: 'image/png', upsert: true });
    if (upErr) throw new Error('upload: ' + upErr.message);

    const url = Deno.env.get('SUPABASE_URL')!;
    const imageUrl = `${url}/storage/v1/object/public/${bucket}/${coverFilename}`;

    let updated: unknown = null;
    if (Array.isArray(articleIds) && articleIds.length > 0) {
      const { data, error } = await supabase
        .from('articles')
        .update({ cover_image_filename: coverFilename, image_url: imageUrl })
        .in('id', articleIds)
        .select('id');
      if (error) throw new Error('update: ' + error.message);
      updated = data;
    }

    return new Response(JSON.stringify({ ok: true, imageUrl, updated }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
