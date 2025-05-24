
/**
 * Admin email templates for article submission notifications
 */

/**
 * Generates HTML content for article submission notification (ADMIN)
 * @param submissionData The submission data
 * @param formattedDate Formatted date string for the email
 * @returns HTML content string
 */
export function generateSubmissionHtmlContent(submissionData: any, formattedDate: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle soumission d'article</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1E40AF, #41b06e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert { background: #fef3cd; border: 1px solid #fec107; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; background: white; border-radius: 6px; overflow: hidden; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #1E40AF; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f8f9fa; }
            .section-title { color: #1E40AF; font-size: 18px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 2px solid #1E40AF; padding-bottom: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .highlight { background: #e8f4f8; padding: 15px; border-radius: 6px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1 style="margin: 0;">📝 Nouvelle Soumission d'Article</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Reçue le ${formattedDate}</p>
        </div>
        
        <div class="content">
            <div class="alert">
                <strong>🎉 Excellente nouvelle !</strong> L'équipe Info-Chir a reçu une nouvelle soumission d'article. Veuillez examiner les détails ci-dessous et procéder à l'évaluation.
            </div>
            
            <div class="section-title">📋 Détails de la Soumission</div>
            <table>
                <tr><th>Champ</th><th>Valeur</th></tr>
                <tr><td><strong>Type de publication</strong></td><td>${submissionData.publication_type}</td></tr>
                <tr><td><strong>Titre</strong></td><td>${submissionData.title}</td></tr>
                <tr><td><strong>Auteurs</strong></td><td>${submissionData.authors}</td></tr>
                <tr><td><strong>Institution</strong></td><td>${submissionData.institution}</td></tr>
                <tr><td><strong>Mots-clés</strong></td><td>${submissionData.keywords}</td></tr>
                <tr><td><strong>Résumé</strong></td><td>${submissionData.abstract}</td></tr>
            </table>
            
            <div class="section-title">👤 Coordonnées de l'Auteur Correspondant</div>
            <table>
                <tr><th>Champ</th><th>Valeur</th></tr>
                <tr><td><strong>Nom</strong></td><td>${submissionData.corresponding_author_name}</td></tr>
                <tr><td><strong>Email</strong></td><td>${submissionData.corresponding_author_email}</td></tr>
                <tr><td><strong>Téléphone</strong></td><td>${submissionData.corresponding_author_phone}</td></tr>
                <tr><td><strong>Adresse</strong></td><td>${submissionData.corresponding_author_address}</td></tr>
            </table>
            
            <div class="section-title">📁 Fichiers Joints</div>
            <div class="highlight">
                <p><strong>📄 Fichiers d'article:</strong> ${submissionData.article_files_urls ? submissionData.article_files_urls.length : 0} fichier(s)</p>
                <p><strong>🖼️ Images et annexes:</strong> ${submissionData.image_annexes_urls ? submissionData.image_annexes_urls.length : 0} fichier(s)</p>
            </div>
            
            <div class="section-title">✅ Déclarations Éthiques</div>
            <table>
                <tr><td><strong>Approbation éthique</strong></td><td>${submissionData.ethics_approval ? '✅ Oui' : '❌ Non'}</td></tr>
                <tr><td><strong>Absence de conflit d'intérêt</strong></td><td>${submissionData.no_conflict ? '✅ Oui' : '❌ Non'}</td></tr>
                <tr><td><strong>Travail original</strong></td><td>${submissionData.original_work ? '✅ Oui' : '❌ Non'}</td></tr>
            </table>
            
            <div class="highlight">
                <strong>🚀 Prochaines étapes :</strong>
                <ol>
                    <li>Examiner la soumission pour conformité</li>
                    <li>Assigner un évaluateur</li>
                    <li>Envoyer accusé de réception détaillé à l'auteur</li>
                    <li>Démarrer le processus d'évaluation par les pairs</li>
                </ol>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Info-Chir</strong> - Système de Gestion des Soumissions</p>
            <p>Cet email a été généré automatiquement par le système de soumission d'articles.</p>
        </div>
    </body>
    </html>
  `;
}

/**
 * Generates plain text content for article submission notification (ADMIN)
 * @param submissionData The submission data
 * @param formattedDate Formatted date string for the email
 * @returns Plain text content string
 */
export function generateSubmissionTextContent(submissionData: any, formattedDate: string): string {
  return `
📝 NOUVELLE SOUMISSION D'ARTICLE - INFO-CHIR

Reçue le ${formattedDate}

🎉 EXCELLENTE NOUVELLE !
L'équipe Info-Chir a reçu une nouvelle soumission d'article. Veuillez examiner les détails ci-dessous et procéder à l'évaluation.

📋 DÉTAILS DE LA SOUMISSION
═══════════════════════════════════════
Type de publication: ${submissionData.publication_type}
Titre: ${submissionData.title}
Auteurs: ${submissionData.authors}
Institution: ${submissionData.institution}
Mots-clés: ${submissionData.keywords}
Résumé: ${submissionData.abstract}

👤 COORDONNÉES DE L'AUTEUR CORRESPONDANT
═══════════════════════════════════════
Nom: ${submissionData.corresponding_author_name}
Email: ${submissionData.corresponding_author_email}
Téléphone: ${submissionData.corresponding_author_phone}
Adresse: ${submissionData.corresponding_author_address}

📁 FICHIERS JOINTS
═══════════════════════════════════════
📄 Fichiers d'article: ${submissionData.article_files_urls ? submissionData.article_files_urls.length : 0} fichier(s)
🖼️ Images et annexes: ${submissionData.image_annexes_urls ? submissionData.image_annexes_urls.length : 0} fichier(s)

✅ DÉCLARATIONS ÉTHIQUES
═══════════════════════════════════════
Approbation éthique: ${submissionData.ethics_approval ? '✅ Oui' : '❌ Non'}
Absence de conflit d'intérêt: ${submissionData.no_conflict ? '✅ Oui' : '❌ Non'}
Travail original: ${submissionData.original_work ? '✅ Oui' : '❌ Non'}

🚀 PROCHAINES ÉTAPES
═══════════════════════════════════════
1. Examiner la soumission pour conformité
2. Assigner un évaluateur
3. Envoyer accusé de réception détaillé à l'auteur
4. Démarrer le processus d'évaluation par les pairs

───────────────────────────────────────
Info-Chir - Système de Gestion des Soumissions
Cet email a été généré automatiquement par le système de soumission d'articles.
  `.trim();
}
