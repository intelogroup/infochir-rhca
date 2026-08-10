import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

export interface AdminCheckResult {
  ok: boolean;
  status?: number;
  error?: string;
  userId?: string;
}

/**
 * Validates the caller's JWT and verifies they hold the `admin` role.
 * Use this in every edge function that performs privileged writes with the
 * service-role key.
 */
export async function requireAdmin(req: Request): Promise<AdminCheckResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return { ok: false, status: 401, error: 'Unauthorized' };

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: roleRow } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', userData.user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (!roleRow) return { ok: false, status: 403, error: 'Admin role required' };

  return { ok: true, userId: userData.user.id };
}

export function denyResponse(
  check: AdminCheckResult,
  corsHeaders: Record<string, string> = {},
): Response {
  return new Response(
    JSON.stringify({ success: false, ok: false, error: check.error ?? 'Unauthorized' }),
    {
      status: check.status ?? 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    },
  );
}
