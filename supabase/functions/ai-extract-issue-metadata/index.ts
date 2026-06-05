// AI-powered extraction of journal issue metadata from a PDF first-page image.
// Uses Lovable AI Gateway (Gemini vision) to read the cover/sommaire and return
// structured metadata matching the add-journal-issue skill's naming conventions.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a metadata extractor for a Haitian medical journal archive.
Given the first page image of a journal PDF and its original filename, return STRICT JSON
matching this schema (no prose, no markdown):

{
  "source": "IGM" | "RHCA" | "ADC",
  "volume": string,           // numeric, not padded ("5")
  "issue": string,            // numeric, not padded ("53"); for ADC use chapter number
  "publication_date": string, // ISO YYYY-MM-DD; infer from filename pattern <PUB>_<NN>_DD_MM_YY.pdf or cover month/year
  "title": string,            // e.g. "INFO GAZETTE MÉDICALE Vol 5 No 53 - Mai 2026"
  "abstract": string,         // 2-4 sentence summary of the sommaire / theme in French
  "specialty": string,        // main theme/specialty in French
  "category": string,         // "Médecine Générale" | "Chirurgie" | "Anesthésie" | etc.
  "tags": string[],           // 3-6 short tags in French
  "keywords": string[],       // 3-8 keywords in French
  "primary_author": string,   // chief editor if visible, else ""
  "institution": string,      // e.g. "Info Chir"
  "page_number": string,      // "1-32" if visible, else ""
  "doi": string,              // ISBN/ISSN string if visible, else ""
  "pdf_filename": string,     // strict: IGM_vol_XX_no_YY_DD_MM_YY.pdf | RHCA_vol_XX_no_YY_DD_MM_YYYY.pdf | ADC_ch_N_<slug>.pdf
  "cover_filename": string    // matching .png: IGM_vol_XX_no_YY_cover.png | RHCA_vol_XX_no_YY_cover.png | ADC_ch_N_<slug>.png
}

Rules:
- Volume is always 2-digit zero-padded INSIDE filenames (vol_05) but unpadded in the "volume" field.
- Issue is unpadded.
- If the original filename already follows the convention, preserve volume/issue/date from it.
- For ADC chapters use ADC_ch_<N>_<short-slug>.pdf.
- Return ONLY the JSON object. No code fences.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) throw new Error('LOVABLE_API_KEY missing');

    const { imageBase64, filename, sourceHint } = await req.json();
    if (!imageBase64 || !filename) throw new Error('imageBase64 and filename required');

    const userText =
      `Original filename: ${filename}` +
      (sourceHint ? `\nSource hint: ${sourceHint}` : '') +
      `\nExtract metadata as JSON.`;

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
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

    if (resp.status === 429) {
      return new Response(JSON.stringify({ ok: false, error: 'Rate limit. Please retry shortly.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ ok: false, error: 'AI credits exhausted. Add credits in Workspace settings.' }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
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

    return new Response(JSON.stringify({ ok: true, metadata }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
