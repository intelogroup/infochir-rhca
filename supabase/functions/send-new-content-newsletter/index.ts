import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TODO: Replace once you verify your domain in Resend (e.g. "Info Chir <newsletter@infochir.org>")
const FROM_ADDRESS = 'Info Chir <onboarding@resend.dev>';
const SITE_URL = 'https://infochir-rhca.lovable.app';
const REPLY_TO = 'jimkalinov@gmail.com';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const sourceLabel = (source: string) => {
  switch ((source || '').toLowerCase()) {
    case 'rhca': return 'RHCA';
    case 'igm': return 'IGM';
    case 'adc':
    case 'atlas': return 'Atlas';
    case 'index-medicus':
    case 'indexmedicus': return 'Index Medicus';
    default: return 'Info Chir';
  }
};

const sourcePath = (source: string) => {
  switch ((source || '').toLowerCase()) {
    case 'rhca': return '/rhca';
    case 'igm': return '/igm';
    case 'adc':
    case 'atlas': return '/adc';
    default: return '/index-medicus';
  }
};

function emailHtml(opts: {
  title: string;
  label: string;
  abstract?: string | null;
  coverUrl?: string | null;
  ctaUrl: string;
  unsubscribeUrl: string;
}) {
  const abstractHtml = opts.abstract
    ? `<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 24px;">${opts.abstract.slice(0, 400)}${opts.abstract.length > 400 ? '…' : ''}</p>`
    : '';
  const coverHtml = opts.coverUrl
    ? `<img src="${opts.coverUrl}" alt="" style="max-width:100%;border-radius:8px;margin-bottom:24px;" />`
    : '';
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
        <tr><td style="background:#1d4ed8;padding:24px 32px;color:#ffffff;">
          <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.85;">Nouvelle publication ${opts.label}</div>
          <div style="font-size:20px;font-weight:bold;margin-top:4px;">Info Chir</div>
        </td></tr>
        <tr><td style="padding:32px;">
          ${coverHtml}
          <h1 style="font-size:22px;line-height:1.3;color:#111827;margin:0 0 16px;">${opts.title}</h1>
          ${abstractHtml}
          <a href="${opts.ctaUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:15px;">Lire maintenant</a>
        </td></tr>
        <tr><td style="padding:24px 32px;background:#f3f4f6;color:#6b7280;font-size:12px;line-height:1.5;text-align:center;">
          Vous recevez cet email car vous êtes abonné à la newsletter Info Chir.<br/>
          <a href="${opts.unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;">Se désabonner</a>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { contentId, contentType } = await req.json();
    if (!contentId) {
      return new Response(JSON.stringify({ ok: false, error: 'contentId required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Fetch article
    const { data: article, error: artErr } = await supabase
      .from('articles')
      .select('id, title, abstract, image_url, source')
      .eq('id', contentId)
      .single();

    if (artErr || !article) {
      return new Response(JSON.stringify({ ok: false, error: 'article not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const source = (contentType || article.source || '').toString();
    const label = sourceLabel(source);
    const ctaUrl = `${SITE_URL}${sourcePath(source)}`;

    // Subscribers
    const { data: subs, error: subErr } = await supabase
      .from('newsletter_subscriptions')
      .select('email, unsubscribe_token')
      .eq('is_active', true);
    if (subErr) throw subErr;

    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ ok: true, sent: 0, failed: 0, skipped: 0, message: 'no subscribers' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Filter out already-sent
    const { data: alreadySent } = await supabase
      .from('newsletter_send_log')
      .select('recipient_email')
      .eq('content_id', contentId);
    const sentSet = new Set((alreadySent || []).map((r: any) => r.recipient_email.toLowerCase()));
    const pending = subs.filter(s => s.email && !sentSet.has(s.email.toLowerCase()));

    let sent = 0, failed = 0;
    // Resend free tier: 2 req/sec safe. Send one-by-one with 600ms delay.
    for (const sub of pending) {
      const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe?token=${sub.unsubscribe_token}`;
      const html = emailHtml({
        title: article.title,
        label,
        abstract: article.abstract,
        coverUrl: article.image_url || null,
        ctaUrl,
        unsubscribeUrl,
      });

      try {
        const resp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_ADDRESS,
            to: [sub.email],
            reply_to: REPLY_TO,
            subject: `Nouvelle publication ${label}: ${article.title}`,
            html,
          }),
        });
        const body = await resp.json().catch(() => ({}));
        if (resp.ok) {
          sent++;
          await supabase.from('newsletter_send_log').insert({
            content_id: contentId,
            content_type: source,
            content_title: article.title,
            recipient_email: sub.email,
            status: 'sent',
            resend_message_id: body?.id || null,
          });
        } else {
          failed++;
          await supabase.from('newsletter_send_log').insert({
            content_id: contentId,
            content_type: source,
            content_title: article.title,
            recipient_email: sub.email,
            status: 'failed',
            error_message: JSON.stringify(body).slice(0, 500),
          });
        }
      } catch (e) {
        failed++;
        await supabase.from('newsletter_send_log').insert({
          content_id: contentId,
          content_type: source,
          content_title: article.title,
          recipient_email: sub.email,
          status: 'failed',
          error_message: String(e).slice(0, 500),
        });
      }
      await new Promise(r => setTimeout(r, 600));
    }

    return new Response(JSON.stringify({
      ok: true, sent, failed, skipped: subs.length - pending.length, total: subs.length,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('[send-new-content-newsletter] error', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
