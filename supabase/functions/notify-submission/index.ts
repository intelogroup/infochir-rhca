
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Create a Resend client for sending emails
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Email notification recipient
const NOTIFICATION_EMAIL = "jayveedz19@gmail.com";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the submission data
    const submissionData = await req.json();
    
    console.log("Preparing email notification for submission:", submissionData.title);

    // Format the submission data for email
    const formattedDate = new Date().toLocaleString('fr-FR', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // Create HTML content for the email
    const htmlContent = `
      <h1>Nouvelle soumission d'article</h1>
      <p>Une nouvelle soumission d'article a été reçue le ${formattedDate}.</p>
      
      <h2>Détails de la soumission</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Champ</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Valeur</th>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Type de publication</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${submissionData.publication_type}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Titre</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${submissionData.title}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Auteurs</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${submissionData.authors}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Institution</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${submissionData.institution}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Mots-clés</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${submissionData.keywords}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Résumé</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${submissionData.abstract}</td>
        </tr>
      </table>
      
      <h3>Coordonnées de l'auteur correspondant</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Champ</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Valeur</th>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Nom</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${submissionData.corresponding_author_name}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Email</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${submissionData.corresponding_author_email}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Téléphone</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${submissionData.corresponding_author_phone}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Adresse</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${submissionData.corresponding_author_address}</td>
        </tr>
      </table>
      
      <h3>Fichiers</h3>
      <p><strong>Fichiers d'article:</strong> ${submissionData.article_files_urls ? submissionData.article_files_urls.length : 0} fichier(s)</p>
      <p><strong>Images et annexes:</strong> ${submissionData.image_annexes_urls ? submissionData.image_annexes_urls.length : 0} fichier(s)</p>
      
      <h3>Déclarations</h3>
      <ul>
        <li>Approbation éthique: ${submissionData.ethics_approval ? 'Oui' : 'Non'}</li>
        <li>Absence de conflit d'intérêt: ${submissionData.no_conflict ? 'Oui' : 'Non'}</li>
        <li>Travail original: ${submissionData.original_work ? 'Oui' : 'Non'}</li>
      </ul>
    `;

    // Send the notification email
    const { data, error } = await resend.emails.send({
      from: "InfoChir Notifications <onboarding@resend.dev>",
      to: NOTIFICATION_EMAIL,
      subject: `Nouvelle soumission d'article: ${submissionData.title}`,
      html: htmlContent,
    });

    if (error) {
      console.error("Error sending notification email:", error);
      throw new Error(`Failed to send email notification: ${error.message}`);
    }

    console.log("Email notification sent successfully:", data);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email notification sent successfully" 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    console.error("Error in notify-submission function:", err);
    
    return new Response(
      JSON.stringify({ 
        error: err.message || 'Internal server error',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
