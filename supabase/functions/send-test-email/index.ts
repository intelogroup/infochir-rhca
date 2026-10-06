import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { requireAdmin, denyResponse } from "../_shared/require-admin.ts";
import { sendEmail } from "../_shared/email-sender.ts";

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const check = await requireAdmin(req);
  if (!check.ok) return denyResponse(check, corsHeaders);

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const { to } = await req.json().catch(() => ({}));
  if (typeof to !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return json({ success: false, error: "Invalid recipient" }, 400);
  }

  const result = await sendEmail(
    to,
    "Test email - InfoChir admin",
    "<p>This is a test email sent from the InfoChir admin panel.</p>",
    "This is a test email sent from the InfoChir admin panel.",
  );
  if (!result.success) return json({ success: false, error: String(result.error?.message ?? result.error) }, 502);
  return json({ success: true });
});
