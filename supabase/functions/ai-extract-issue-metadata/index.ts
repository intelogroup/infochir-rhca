// AI-powered extraction of journal issue metadata from a PDF first-page image.
// Uses Lovable AI Gateway (Gemini vision). Admin-only.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a metadata extractor for a Haitian medical journal archive.
Given the first page image of a journal PDF and its original filename, return STRICT JSON
matching this schema (no prose, no markdown):

{
  "source": "IGM" | "RHCA" | "ADC",
  "volume": string,
  "issue": string,
  "publication_date": string,
  "title": string,
  "abstract": string,
  "specialty": string,
  "category": string,
  "tags": string[],
  "keywords": string[],
  "primary_author": string,
  "institution": string,
  "page_number": string,
  "doi": string,
  "pdf_filename": string,
  "cover_filename": string
}

Rules:
- Volume is always 2-digit zero-padded INSIDE filenames (vol_05) but unpadded in "volume" field.
- Issue unpadded in field.
- IGM filename: IGM_vol_XX_no_YY_DD_MM_YY.pdf, cover IGM_vol_XX_no_YY_cover.png
- RHCA filename: RHCA_vol_XX_no_YY_DD_MM_YYYY.pdf, cover RHCA_vol_XX_no_YY_cover.png
- ADC filename: ADC_ch_N_<slug>.pdf, cover ADC_ch_N_<slug>.png
- Return ONLY the JSON object. No code fences.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    // --- Admin auth check ---
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
    if (!token) return json({ ok: false, error: 'Missing auth token' }, 401);

    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ ok: false, error: 'Invalid auth' }, 401);

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRow } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleRow) return json({ ok: false, error: 'Admin role required' }, 403);

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) throw new Error('LOVABLE_API_KEY missing');

    const { imageBase64, filename, sourceHint } = await req.json();
    if (!imageBase64 || !filename) return json({ ok: false, error: 'imageBase64 and filename required' }, 400);

    const userText =
      `Original filename: ${filename}` +
      (sourceHint ? `\nSource hint: ${sourceHint}` : '') +
      `\nExtract metadata as JSON.`;

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: userText },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (resp.status === 429) return json({ ok: false, error: 'Rate limit. Please retry shortly.' }, 429);
    if (resp.status === 402) return json({ ok: false, error: 'AI credits exhausted. Add credits in Workspace settings.' }, 402);
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`AI gateway ${resp.status}: ${t.slice(0, 300)}`);
    }

    const data = await resp.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '{}';
    let metadata: Record<string, unknown>;
    try {
      metadata = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      metadata = m ? JSON.parse(m[0]) : {};
    }

    return json({ ok: true, metadata });
  } catch (e) {
    return json({ ok: false, error: String((e as Error).message ?? e) }, 500);
  }
});
