
/**
 * Email templates for notifications
 * Provides functions to generate HTML and text content for emails
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
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
            .email-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1E40AF, #41b06e); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .success-icon { font-size: 64px; margin-bottom: 20px; }
            .info-box { background: linear-gradient(135deg, #e8f4f8, #f0f8ff); padding: 25px; margin: 25px 0; border-radius: 10px; border-left: 5px solid #41b06e; }
            .detail-item { display: flex; margin: 12px 0; }
            .detail-label { font-weight: bold; color: #1E40AF; min-width: 140px; }
            .detail-value { flex: 1; }
            .next-steps { background: #fff8e1; border: 1px solid #ffecb3; border-radius: 8px; padding: 20px; margin: 25px 0; }
            .step-list { margin: 15px 0; padding-left: 0; }
            .step-item { display: flex; align-items: flex-start; margin: 10px 0; padding: 8px 0; }
            .step-number { background: #1E40AF; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
            .team-message { background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; border: 2px solid #41b06e; }
            .contact-info { background: #f8f9ff; border-radius: 8px; padding: 20px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="success-icon">🎉</div>
                <h1 style="margin: 0; font-size: 28px;">Soumission Reçue avec Succès !</h1>
                <p style="margin: 15px 0 0 0; opacity: 0.95; font-size: 16px;">Merci pour votre contribution à Info-Chir</p>
            </div>
            
            <div class="content">
                <div class="team-message">
                    <h2 style="color: #1E40AF; margin-top: 0;">🌟 L'équipe Info-Chir est ravie !</h2>
                    <p style="font-size: 16px; margin: 15px 0;">Nous sommes très heureux de recevoir votre contribution scientifique. Votre engagement envers l'avancement de la recherche chirurgicale nous inspire et enrichit notre communauté médicale.</p>
                    <p style="font-size: 16px; margin: 15px 0; font-weight: 500; color: #1E40AF;">Nous reviendrons vers vous très prochainement avec les prochaines étapes du processus d'évaluation.</p>
                </div>
                
                <p style="font-size: 16px;">Cher(e) <strong>${submissionData.corresponding_author_name}</strong>,</p>
                
                <p>Nous avons bien reçu votre soumission d'article intitulé "<strong>${submissionData.title}</strong>" le ${formattedDate}.</p>
                
                <div class="info-box">
                    <h3 style="margin-top: 0; color: #1E40AF;">📋 Récapitulatif de votre soumission</h3>
                    <div class="detail-item">
                        <span class="detail-label">Titre :</span>
                        <span class="detail-value">${submissionData.title}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Publication :</span>
                        <span class="detail-value">${submissionData.publication_type}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Auteur(s) :</span>
                        <span class="detail-value">${submissionData.authors}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Institution :</span>
                        <span class="detail-value">${submissionData.institution}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Mots-clés :</span>
                        <span class="detail-value">${submissionData.keywords}</span>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h3 style="margin-top: 0; color: #ff6f00;">🚀 Prochaines étapes du processus</h3>
                    <div class="step-list">
                        <div class="step-item">
                            <div class="step-number">1</div>
                            <div>
                                <strong>Accusé de réception détaillé</strong><br>
                                <span style="color: #666;">Vous recevrez une confirmation officielle dans les 48 heures</span>
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-number">2</div>
                            <div>
                                <strong>Évaluation préliminaire</strong><br>
                                <span style="color: #666;">Notre équipe éditoriale examinera votre soumission (3-5 jours)</span>
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-number">3</div>
                            <div>
                                <strong>Processus d'évaluation par les pairs</strong><br>
                                <span style="color: #666;">Révision par des experts du domaine (2-4 semaines)</span>
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-number">4</div>
                            <div>
                                <strong>Communication des résultats</strong><br>
                                <span style="color: #666;">Nous vous tiendrons informé(e) à chaque étape importante</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="contact-info">
                    <h3 style="margin-top: 0; color: #1E40AF;">📞 Besoin d'aide ?</h3>
                    <p>Si vous avez des questions concernant votre soumission ou le processus d'évaluation, n'hésitez pas à nous contacter en répondant directement à cet email. Notre équipe se fera un plaisir de vous aider.</p>
                </div>
                
                <p style="margin-top: 30px;">Nous vous remercions encore pour votre confiance et votre contribution à l'avancement de la chirurgie.</p>
                
                <p style="margin-top: 25px;">
                    Cordialement,<br>
                    <strong>L'équipe éditoriale Info-Chir</strong><br>
                    <span style="color: #666; font-style: italic;">Votre partenaire dans l'excellence chirurgicale</span>
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Info-Chir</strong> - Plateforme de Publication Scientifique</p>
                <p>Cet email de confirmation a été envoyé automatiquement. Pour toute question, répondez directement à cet email.</p>
            </div>
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
🎉 SOUMISSION REÇUE AVEC SUCCÈS !

🌟 L'ÉQUIPE INFO-CHIR EST RAVIE !
═══════════════════════════════════════

Cher(e) ${submissionData.corresponding_author_name},

Nous sommes très heureux de recevoir votre contribution scientifique. Votre engagement envers l'avancement de la recherche chirurgicale nous inspire et enrichit notre communauté médicale.

🗓️ NOUS REVIENDRONS VERS VOUS TRÈS PROCHAINEMENT avec les prochaines étapes du processus d'évaluation.

📋 RÉCAPITULATIF DE VOTRE SOUMISSION
═══════════════════════════════════════
Soumission reçue le : ${formattedDate}

• Titre : ${submissionData.title}
• Type de publication : ${submissionData.publication_type}
• Auteur(s) : ${submissionData.authors}
• Institution : ${submissionData.institution}
• Mots-clés : ${submissionData.keywords}

🚀 PROCHAINES ÉTAPES DU PROCESSUS
═══════════════════════════════════════

1️⃣ ACCUSÉ DE RÉCEPTION DÉTAILLÉ
   → Confirmation officielle dans les 48 heures

2️⃣ ÉVALUATION PRÉLIMINAIRE
   → Examen par notre équipe éditoriale (3-5 jours)

3️⃣ ÉVALUATION PAR LES PAIRS
   → Révision par des experts du domaine (2-4 semaines)

4️⃣ COMMUNICATION DES RÉSULTATS
   → Information à chaque étape importante

📞 BESOIN D'AIDE ?
═══════════════════════════════════════
Si vous avez des questions concernant votre soumission ou le processus d'évaluation, n'hésitez pas à nous contacter en répondant directement à cet email. Notre équipe se fera un plaisir de vous aider.

Nous vous remercions encore pour votre confiance et votre contribution à l'avancement de la chirurgie.

Cordialement,
L'équipe éditoriale Info-Chir
"Votre partenaire dans l'excellence chirurgicale"

───────────────────────────────────────
Info-Chir - Plateforme de Publication Scientifique
Cet email de confirmation a été envoyé automatiquement.
Pour toute question, répondez directement à cet email.
  `.trim();
}
