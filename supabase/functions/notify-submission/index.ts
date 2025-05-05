
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Email notification recipient - updated to the specified email
const NOTIFICATION_EMAIL = "jimkalinov@gmail.com";

// Initialize Resend email client
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the submission data
    const submissionData = await req.json();
    
    console.log("[notify-submission] Received data for notification:", {
      title: submissionData.title,
      type: submissionData.publication_type,
      author: submissionData.corresponding_author_name
    });
    
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

    const textContent = `
      Nouvelle soumission d'article

      Une nouvelle soumission d'article a été reçue le ${formattedDate}.
      
      Détails de la soumission
      Type de publication: ${submissionData.publication_type}
      Titre: ${submissionData.title}
      Auteurs: ${submissionData.authors}
      Institution: ${submissionData.institution}
      Mots-clés: ${submissionData.keywords}
      Résumé: ${submissionData.abstract}
      
      Coordonnées de l'auteur correspondant
      Nom: ${submissionData.corresponding_author_name}
      Email: ${submissionData.corresponding_author_email}
      Téléphone: ${submissionData.corresponding_author_phone}
      Adresse: ${submissionData.corresponding_author_address}
      
      Fichiers
      Fichiers d'article: ${submissionData.article_files_urls ? submissionData.article_files_urls.length : 0} fichier(s)
      Images et annexes: ${submissionData.image_annexes_urls ? submissionData.image_annexes_urls.length : 0} fichier(s)
      
      Déclarations
      Approbation éthique: ${submissionData.ethics_approval ? 'Oui' : 'Non'}
      Absence de conflit d'intérêt: ${submissionData.no_conflict ? 'Oui' : 'Non'}
      Travail original: ${submissionData.original_work ? 'Oui' : 'Non'}
    `;

    try {
      console.log("[notify-submission] Attempting to send email notification using Resend...");
      console.log("[notify-submission] Recipient:", NOTIFICATION_EMAIL);
      
      // Send email using Resend
      const emailResponse = await resend.emails.send({
        from: "InfoChir <submissions@infochir.org>",
        to: [NOTIFICATION_EMAIL],
        subject: `Nouvelle soumission d'article: ${submissionData.title}`,
        html: htmlContent,
        text: textContent,
        reply_to: submissionData.corresponding_author_email
      });
      
      console.log("[notify-submission] Email service response:", emailResponse);
      
      if (emailResponse.error) {
        throw new Error(`Email API responded with error: ${JSON.stringify(emailResponse.error)}`);
      }
      
      console.log("[notify-submission] Email notification sent successfully");
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Email notification sent successfully",
          service_response: emailResponse
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (emailErr) {
      console.error("[notify-submission] Exception while sending email:", emailErr);
      console.error("[notify-submission] Exception stack:", emailErr.stack);
      
      // Try a backup method using the same Resend API but with a simpler email
      try {
        console.log("[notify-submission] Attempting backup email method...");
        
        // Implement a simpler backup method with fewer headers and options
        const backupEmailResponse = await resend.emails.send({
          from: "InfoChir <no-reply@infochir.org>",
          to: [NOTIFICATION_EMAIL],
          subject: `BACKUP: Nouvelle soumission - ${submissionData.title}`,
          text: textContent,
        });
        
        console.log("[notify-submission] Backup email response:", backupEmailResponse);
        
        if (backupEmailResponse.error) {
          throw new Error(`Backup email also failed with error: ${JSON.stringify(backupEmailResponse.error)}`);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: "Email notification sent via backup method",
            service_response: backupEmailResponse
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (backupErr) {
        console.error("[notify-submission] Backup email method also failed:", backupErr);
        throw emailErr; // Re-throw the original error
      }
    }
  } catch (err) {
    console.error("[notify-submission] Error in notify-submission function:", err);
    console.error("[notify-submission] Error stack:", err.stack);
    
    return new Response(
      JSON.stringify({ 
        error: err.message || 'Internal server error',
        errorStack: err.stack,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
