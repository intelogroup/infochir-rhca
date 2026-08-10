import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { sendEmail } from "../_shared/email-sender.ts";

const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #1a56db;">Résolution du problème de spam sur InfoChir</h2>
  <p>Bonjour Dr Alouidor et Dr Derivois,</p>
  <p>Vous avez peut-être remarqué une hausse de courriels suspects récemment — fausses inscriptions à l'infolettre et faux messages de contact. Soyez rassurés : <strong>le site n'a pas été piraté et aucune donnée n'a été compromise.</strong> Il s'agissait de bots exploitant l'absence de protection sur nos formulaires publics.</p>
  <p><strong>Ce que nous avons corrigé :</strong></p>
  <ul>
    <li>Champ leurre et temps minimum de remplissage pour bloquer les soumissions automatisées</li>
    <li>Détection des noms aléatoires et adresses courriel obfuscées</li>
    <li>Limite de 3 soumissions/heure et 8/jour par adresse IP, avec journal d'audit</li>
    <li>Suppression des faux abonnés déjà enregistrés</li>
    <li>Assainissement HTML de tous les champs utilisateur</li>
  </ul>
  <p>Les véritables visiteurs ne sont pas affectés. Nous surveillons activement la situation et ajusterons si nécessaire. N'hésitez pas à me signaler toute activité suspecte.</p>
  <p>Cordialement,<br><br>
  <strong>Jim Kalinov</strong><br>
  InfoChir<br>
  info-chir.org</p>
</div>
`;

const text = `Résolution du problème de spam sur InfoChir

Bonjour Dr Alouidor et Dr Derivois,

Vous avez peut-être remarqué une hausse de courriels suspects récemment — fausses inscriptions à l'infolettre et faux messages de contact. Soyez rassurés : le site n'a pas été piraté et aucune donnée n'a été compromise. Il s'agissait de bots exploitant l'absence de protection sur nos formulaires publics.

Ce que nous avons corrigé :
- Champ leurre et temps minimum de remplissage pour bloquer les soumissions automatisées
- Détection des noms aléatoires et adresses courriel obfuscées
- Limite de 3 soumissions/heure et 8/jour par adresse IP, avec journal d'audit
- Suppression des faux abonnés déjà enregistrés
- Assainissement HTML de tous les champs utilisateur

Les véritables visiteurs ne sont pas affectés. Nous surveillons activement la situation et ajusterons si nécessaire. N'hésitez pas à me signaler toute activité suspecte.

Cordialement,

Jim Kalinov
InfoChir
info-chir.org`;

const RECIPIENTS = [
  "jalouidor@hotmail.com",
  "eunicederivoismerisier@gmail.com",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const results = [];
  for (const to of RECIPIENTS) {
    const result = await sendEmail(
      to,
      "Résolution du problème de spam sur InfoChir",
      html,
      text,
    );
    results.push({ to, success: result.success, error: result.error });
    // Small delay between sends
    await new Promise((r) => setTimeout(r, 600));
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
