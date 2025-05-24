/**
 * Email templates for notifications
 * Provides functions to generate HTML and text content for emails
 */

/**
 * Generates HTML content for article submission notification
 * @param submissionData The submission data
 * @param formattedDate Formatted date string for the email
 * @returns HTML content string
 */
export function generateSubmissionHtmlContent(submissionData: any, formattedDate: string): string {
  return `
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
}

/**
 * Generates plain text content for article submission notification
 * @param submissionData The submission data
 * @param formattedDate Formatted date string for the email
 * @returns Plain text content string
 */
export function generateSubmissionTextContent(submissionData: any, formattedDate: string): string {
  return `
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
}

/**
 * Generate HTML content for user confirmation email
 */
export function generateUserConfirmationHtmlContent(submissionData: any, formattedDate: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de soumission</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1E40AF, #41b06e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #41b06e; }
            .label { font-weight: bold; color: #1E40AF; margin-bottom: 5px; }
            .value { margin-bottom: 15px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .success-icon { color: #41b06e; font-size: 48px; text-align: center; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="success-icon">✓</div>
            <h1 style="margin: 0;">Soumission reçue avec succès</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Merci pour votre soumission</p>
        </div>
        
        <div class="content">
            <p>Cher(e) <strong>${submissionData.corresponding_author_name}</strong>,</p>
            
            <p>Nous avons bien reçu votre soumission d'article intitulé "<strong>${submissionData.title}</strong>" le ${formattedDate}.</p>
            
            <div class="info-box">
                <div class="label">Détails de votre soumission :</div>
                <div class="value">
                    <strong>Titre :</strong> ${submissionData.title}<br>
                    <strong>Type de publication :</strong> ${submissionData.publication_type}<br>
                    <strong>Auteur(s) :</strong> ${submissionData.authors}<br>
                    <strong>Institution :</strong> ${submissionData.institution}<br>
                    <strong>Mots-clés :</strong> ${submissionData.keywords}
                </div>
            </div>
            
            <p><strong>Prochaines étapes :</strong></p>
            <ul>
                <li>Notre équipe éditoriale va examiner votre soumission</li>
                <li>Vous recevrez une confirmation de réception dans les 48 heures</li>
                <li>Le processus d'évaluation prendra environ 2-4 semaines</li>
                <li>Nous vous tiendrons informé(e) de l'avancement du processus</li>
            </ul>
            
            <p>Si vous avez des questions concernant votre soumission, n'hésitez pas à nous contacter en répondant à cet email.</p>
            
            <p>Cordialement,<br>
            <strong>L'équipe éditoriale</strong><br>
            Info-Chir</p>
        </div>
        
        <div class="footer">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas répondre directement à cet email si vous n'avez pas de questions spécifiques.</p>
        </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text content for user confirmation email
 */
export function generateUserConfirmationTextContent(submissionData: any, formattedDate: string): string {
  return `
CONFIRMATION DE SOUMISSION

Cher(e) ${submissionData.corresponding_author_name},

Nous avons bien reçu votre soumission d'article intitulé "${submissionData.title}" le ${formattedDate}.

DÉTAILS DE VOTRE SOUMISSION :
- Titre : ${submissionData.title}
- Type de publication : ${submissionData.publication_type}
- Auteur(s) : ${submissionData.authors}
- Institution : ${submissionData.institution}
- Mots-clés : ${submissionData.keywords}

PROCHAINES ÉTAPES :
- Notre équipe éditoriale va examiner votre soumission
- Vous recevrez une confirmation de réception dans les 48 heures
- Le processus d'évaluation prendra environ 2-4 semaines
- Nous vous tiendrons informé(e) de l'avancement du processus

Si vous avez des questions concernant votre soumission, n'hésitez pas à nous contacter en répondant à cet email.

Cordialement,
L'équipe éditoriale
Info-Chir

---
Cet email a été envoyé automatiquement. Merci de ne pas répondre directement à cet email si vous n'avez pas de questions spécifiques.
  `.trim();
}
