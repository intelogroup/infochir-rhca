import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

/**
 * Shared anti-spam guard for the public forms (newsletter + contact).
 * Bots hitting these endpoints are ordinary form-spam bots, so we combine
 * cheap signals: honeypot field, submit timing, gibberish/obfuscation checks,
 * link stuffing and a per-IP throttle backed by public.form_submission_log.
 */

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const admin = () => createClient(supabaseUrl, serviceRoleKey);

export interface GuardInput {
  form: "newsletter" | "contact";
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  /** Honeypot field value - must be empty for humans */
  hp?: string;
  /** Client timestamp (ms) of when the form was rendered */
  t?: number;
}

export interface GuardResult {
  ok: boolean;
  reason?: string;
}

/** Escape user content before embedding it into notification emails. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return (fwd.split(",")[0] || req.headers.get("cf-connecting-ip") || "unknown").trim();
}

/** Random-looking single token, e.g. "YsyCCViufDfJHpoyPq" */
function looksLikeGibberish(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.includes(" ")) return false;
  if (trimmed.length < 10) return false;
  const letters = trimmed.replace(/[^A-Za-z]/g, "");
  if (letters.length < 10) return false;
  const vowelRatio = (letters.match(/[aeiouyAEIOUY]/g)?.length || 0) / letters.length;
  const caseSwitches = letters.split("").filter((c, i, arr) =>
    i > 0 && /[A-Z]/.test(c) !== /[A-Z]/.test(arr[i - 1])
  ).length;
  return vowelRatio < 0.32 || caseSwitches >= 5;
}

/** Dot-obfuscated Gmail-style addresses used to evade duplicate detection. */
function looksObfuscated(email: string): boolean {
  const local = email.split("@")[0] || "";
  return (local.match(/\./g)?.length || 0) >= 4;
}

function countLinks(text: string): number {
  return (text.match(/https?:\/\/|www\.|\[url|<a\s/gi) || []).length;
}

const MAX = { name: 120, email: 254, phone: 40, message: 4000 };

export async function guardSubmission(req: Request, input: GuardInput): Promise<GuardResult> {
  const ip = getClientIp(req);
  const name = (input.name || "").trim();
  const email = (input.email || "").trim().toLowerCase();
  const message = (input.message || "").trim();

  const fail = async (reason: string): Promise<GuardResult> => {
    try {
      await admin().from("form_submission_log").insert({
        form: input.form, ip, email: email || null, outcome: "blocked", reason,
      });
    } catch (_e) { /* logging must never break the request */ }
    console.warn(`[anti-spam] blocked ${input.form} from ${ip}: ${reason}`);
    return { ok: false, reason };
  };

  // 1. Honeypot
  if (input.hp && input.hp.trim().length > 0) return await fail("honeypot");

  // 2. Submitted too fast to be typed by a human
  if (typeof input.t === "number" && Number.isFinite(input.t)) {
    const elapsed = Date.now() - input.t;
    if (elapsed >= 0 && elapsed < 2500) return await fail("too_fast");
  }

  // 3. Length limits
  if (name.length > MAX.name || email.length > MAX.email ||
      (input.phone || "").length > MAX.phone || message.length > MAX.message) {
    return await fail("too_long");
  }

  // 4. Content heuristics
  if (/[\r\n]/.test(name) || /[\r\n]/.test(email)) return await fail("header_injection");
  if (looksLikeGibberish(name)) return await fail("gibberish_name");
  if (looksObfuscated(email)) return await fail("obfuscated_email");
  if (input.form === "contact" && countLinks(message) >= 3) return await fail("link_stuffing");
  if (input.form === "newsletter" && countLinks(name) > 0) return await fail("link_in_name");

  // 5. Per-IP throttle: max 3 submissions per hour, 8 per day
  try {
    const client = admin();
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    if (ip && ip !== "unknown") {
      const { count: hourCount } = await client
        .from("form_submission_log")
        .select("id", { count: "exact", head: true })
        .eq("ip", ip)
        .gte("created_at", hourAgo);
      if ((hourCount || 0) >= 3) return await fail("rate_limited_hour");

      const { count: dayCount } = await client
        .from("form_submission_log")
        .select("id", { count: "exact", head: true })
        .eq("ip", ip)
        .gte("created_at", dayAgo);
      if ((dayCount || 0) >= 8) return await fail("rate_limited_day");
    }

    await client.from("form_submission_log").insert({
      form: input.form, ip, email: email || null, outcome: "accepted",
    });
  } catch (e) {
    console.error("[anti-spam] throttle check failed, allowing request:", e);
  }

  return { ok: true };
}

export function blockedResponse(corsHeaders: Record<string, string>): Response {
  // Deliberately vague so bots learn nothing useful.
  return new Response(
    JSON.stringify({ success: false, error: "Votre demande n'a pas pu être traitée. Veuillez réessayer plus tard." }),
    { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
}
