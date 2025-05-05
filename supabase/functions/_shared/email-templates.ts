
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
