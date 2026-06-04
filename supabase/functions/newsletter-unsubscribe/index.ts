import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    let token = url.searchParams.get('token');
    if (!token && (req.method === 'POST')) {
      const body = await req.json().catch(() => ({}));
      token = body?.token || null;
    }
    if (!token) {
      return new Response(JSON.stringify({ ok: false, error: 'token required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .update({ is_active: false })
      .eq('unsubscribe_token', token)
      .select('email')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid token' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, email: data.email }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
