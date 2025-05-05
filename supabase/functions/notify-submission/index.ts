
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Email notification recipient - updated to the specified email
const NOTIFICATION_EMAIL = "jimkalinov@gmail.com";

// Your native email service configuration
const EMAIL_SERVICE_API_URL = "https://api.smtp2go.com/v3/email/send";
const API_KEY = Deno.env.get("SMTP2GO_API_KEY");

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
      console.log("[notify-submission] Attempting to send email notification using SMTP2GO...");
      console.log("[notify-submission] API URL:", EMAIL_SERVICE_API_URL);
      console.log("[notify-submission] API Key present:", !!API_KEY);
      console.log("[notify-submission] Recipient:", NOTIFICATION_EMAIL);
      
      // Directly send the email using SMTP2Go API
      const emailData = {
        api_key: API_KEY,
        to: [NOTIFICATION_EMAIL],
        sender: "InfoChir <submissions@infochir.org>",
        subject: `Nouvelle soumission d'article: ${submissionData.title}`,
        html_body: htmlContent,
        text_body: textContent,
        custom_headers: [
          {
            header: "Reply-To",
            value: submissionData.corresponding_author_email
          }
        ]
      };
      
      const response = await fetch(EMAIL_SERVICE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });
      
      const responseData = await response.json();
      
      console.log("[notify-submission] Email service response status:", response.status);
      console.log("[notify-submission] Email service response:", responseData);
      
      if (!response.ok) {
        throw new Error(`Email API responded with status ${response.status}: ${JSON.stringify(responseData)}`);
      }
      
      console.log("[notify-submission] Email notification sent successfully");
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Email notification sent successfully",
          service_response: responseData
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (emailErr) {
      console.error("[notify-submission] Exception while sending email:", emailErr);
      console.error("[notify-submission] Exception stack:", emailErr.stack);
      
      // Try a backup method - direct email using alternative method
      try {
        console.log("[notify-submission] Attempting backup email method...");
        
        // Implement a simpler backup method with fewer headers and options
        const backupEmailData = {
          api_key: API_KEY,
          to: [NOTIFICATION_EMAIL],
          sender: "InfoChir <no-reply@infochir.org>",
          subject: `BACKUP: Nouvelle soumission - ${submissionData.title}`,
          text_body: textContent,
        };
        
        const backupResponse = await fetch(EMAIL_SERVICE_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(backupEmailData)
        });
        
        const backupResponseData = await backupResponse.json();
        console.log("[notify-submission] Backup email response:", backupResponseData);
        
        if (!backupResponse.ok) {
          throw new Error(`Backup email also failed with status ${backupResponse.status}`);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: "Email notification sent via backup method",
            service_response: backupResponseData
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
