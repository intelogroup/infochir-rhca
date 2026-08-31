import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-ingest-secret',
};

/**
 * Storage-only ingest helper for Atlas (ADC) chapters.
 * Accepts multipart/form-data (avoids base64 payload inflation):
 *   - pdf            : File (optional)
 *   - cover          : File (optional)
 *   - pdfFilename    : string (required when pdf present)
 *   - coverFilename  : string (required when cover present)
 *   - pdfBucket      : string, default "atlas-pdfs"
 *   - coverBucket    : string, default "atlas_covers"
 *
 * Auth: shared secret header `x-ingest-secret` (NEWSLETTER_TRIGGER_SECRET).
 * Database rows are updated separately via SQL.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  const expected = Deno.env.get('NEWSLETTER_TRIGGER_SECRET');
  const provided = req.headers.get('x-ingest-secret');
  if (!expected || provided !== expected) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const admin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const form = await req.formData();
    const pdf = form.get('pdf');
    const cover = form.get('cover');
    const pdfFilename = String(form.get('pdfFilename') ?? '');
    const coverFilename = String(form.get('coverFilename') ?? '');
    const pdfBucket = String(form.get('pdfBucket') ?? 'atlas-pdfs');
    const coverBucket = String(form.get('coverBucket') ?? 'atlas_covers');

    const uploaded: string[] = [];

    if (pdf instanceof File) {
      if (!pdfFilename) return json({ ok: false, error: 'pdfFilename required' }, 400);
      const { error } = await admin.storage
        .from(pdfBucket)
        .upload(pdfFilename, new Uint8Array(await pdf.arrayBuffer()), {
          contentType: 'application/pdf',
          upsert: true,
        });
      if (error) throw new Error('pdf upload: ' + error.message);
      uploaded.push(`${pdfBucket}/${pdfFilename}`);
    }

    if (cover instanceof File) {
      if (!coverFilename) return json({ ok: false, error: 'coverFilename required' }, 400);
      const { error } = await admin.storage
        .from(coverBucket)
        .upload(coverFilename, new Uint8Array(await cover.arrayBuffer()), {
          contentType: 'image/png',
          upsert: true,
        });
      if (error) throw new Error('cover upload: ' + error.message);
      uploaded.push(`${coverBucket}/${coverFilename}`);
    }

    return json({ ok: true, uploaded });
  } catch (e) {
    console.error('ingest-atlas-chapter failed', e);
    return json({ ok: false, error: 'ingest failed' }, 500);
  }
});
