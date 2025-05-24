
/**
 * User confirmation email templates
 */

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
