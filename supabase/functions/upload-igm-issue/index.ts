import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey);

    // --- Admin auth check ---
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return json({ ok: false, error: 'Missing auth token' }, 401);

    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ ok: false, error: 'Invalid auth' }, 401);

    const { data: roleRow } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleRow) return json({ ok: false, error: 'Admin role required' }, 403);

    const body = await req.json();
    const {
      pdfBase64,
      coverBase64,
      pdfFilename,
      coverFilename,
      article,
      pdfBucket = 'igm-pdfs',
      coverBucket = 'igm_covers',
      overwrite = false,
    } = body;

    if (!pdfFilename || !coverFilename) {
      return json({ ok: false, error: 'pdfFilename and coverFilename required' }, 400);
    }

    // --- Duplicate check ---
    if (!overwrite) {
      const { data: existing } = await admin
        .from('articles')
        .select('id, title')
        .eq('pdf_filename', pdfFilename)
        .maybeSingle();
      if (existing) {
        return json({
          ok: false,
          error: 'duplicate',
          message: `An article with filename "${pdfFilename}" already exists. Re-submit with overwrite=true to replace.`,
          existingId: existing.id,
        }, 409);
      }
    }

    const b64ToBytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

    // Track what we uploaded so we can clean up on failure
    const uploaded: Array<{ bucket: string; path: string }> = [];

    if (pdfBase64) {
      const { error: e1 } = await admin.storage
        .from(pdfBucket)
        .upload(pdfFilename, b64ToBytes(pdfBase64), {
          contentType: 'application/pdf',
          upsert: true,
        });
      if (e1) throw new Error('pdf upload: ' + e1.message);
      uploaded.push({ bucket: pdfBucket, path: pdfFilename });
    }

    if (coverBase64) {
      const { error: e2 } = await admin.storage
        .from(coverBucket)
        .upload(coverFilename, b64ToBytes(coverBase64), {
          contentType: 'image/png',
          upsert: true,
        });
      if (e2) {
        // rollback pdf
        for (const u of uploaded) await admin.storage.from(u.bucket).remove([u.path]);
        throw new Error('cover upload: ' + e2.message);
      }
      uploaded.push({ bucket: coverBucket, path: coverFilename });
    }

    let articleResult = null;
    if (article) {
      const articleData = {
        ...article,
        pdf_url: `${supabaseUrl}/storage/v1/object/public/${pdfBucket}/${pdfFilename}`,
        image_url: `${supabaseUrl}/storage/v1/object/public/${coverBucket}/${coverFilename}`,
        pdf_filename: pdfFilename,
        cover_image_filename: coverFilename,
      };
      const { data, error } = await admin
        .from('articles')
        .insert(articleData)
        .select()
        .single();
      if (error) {
        // rollback uploaded files to avoid orphans
        for (const u of uploaded) await admin.storage.from(u.bucket).remove([u.path]);
        throw new Error('insert: ' + error.message);
      }
      articleResult = data;
    }

    return json({ ok: true, article: articleResult });
  } catch (e) {
    return json({ ok: false, error: String((e as Error).message ?? e) }, 500);
  }
});
