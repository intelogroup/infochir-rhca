
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { sendEmail } from "../_shared/email-sender.ts";

// Types for request and response data
interface SubscriptionRequest {
  name: string;
  email: string;
  phone?: string;
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  existingSubscription?: boolean;
  error?: string;
  notification?: {
    sent: boolean;
    message?: string;
  };
}

// Get environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Notification recipient email - updated to the specified email
const NOTIFICATION_EMAIL = "jimkalinov@gmail.com";

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  console.log("Newsletter subscription function called");
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight request - improved with proper handling
  const corsResponse = handleCors(req);
  if (corsResponse) {
    console.log("Returning CORS preflight response");
    return corsResponse;
  }

  try {
    // Validate method
    if (req.method !== "POST") {
      console.error(`Invalid method: ${req.method}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Method not allowed" 
        }),
        { 
          status: 405,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Parse request body
    let data: SubscriptionRequest;
    try {
      data = await req.json();
      console.log("Request data:", data);
    } catch (e) {
      console.error("Error parsing request:", e);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON in request body" 
        }),
        { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Validate required fields
    const { name, email, phone } = data;
    if (!name || !email) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Name and email are required" 
        }),
        { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Validate email format with a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid email format" 
        }),
        { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Test service role key length
    if (!serviceRoleKey || serviceRoleKey.length < 10) {
      console.error("Invalid service role key");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Configuration error: Invalid service role key" 
        }),
        { 
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Test Supabase URL format
    if (!supabaseUrl.startsWith("https://") || !supabaseUrl.includes("supabase.co")) {
      console.error("Invalid Supabase URL:", supabaseUrl);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Configuration error: Invalid Supabase URL" 
        }),
        { 
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    console.log("Creating Supabase client with URL:", supabaseUrl);
    
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if email already exists
    console.log("Checking if email already exists:", email);
    const { data: existingData, error: searchError } = await supabase
      .from("newsletter_subscriptions")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (searchError) {
      console.error("Error checking existing subscription:", searchError);
      throw new Error(`Database error: ${searchError.message}`);
    }

    let adminNotificationResult = { sent: false };
    let userConfirmationResult = { sent: false };

    // If email already exists, return success but indicate it's a duplicate
    if (existingData) {
      console.log("Existing subscription found for email:", email);
      
      // Send notifications for the duplicate subscription attempt
      adminNotificationResult = await sendAdminNotification(name, email, phone, true);
      userConfirmationResult = await sendUserConfirmation(name, email, true);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Already subscribed", 
          existingSubscription: true,
          notification: {
            admin: adminNotificationResult,
            user: userConfirmationResult
          }
        }),
        { 
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Insert new subscription
    console.log("Inserting new subscription for:", name, email);
    const { data: insertData, error: insertError } = await supabase
      .from("newsletter_subscriptions")
      .insert([
        { 
          name, 
          email, 
          phone: phone || null,
          is_active: true
        }
      ])
      .select();

    if (insertError) {
      console.error("Error inserting subscription:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("Subscription successful:", insertData);
    
    // Send both admin notification and user confirmation emails
    adminNotificationResult = await sendAdminNotification(name, email, phone, false);
    userConfirmationResult = await sendUserConfirmation(name, email, false);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed to newsletter",
        notification: {
          admin: adminNotificationResult,
          user: userConfirmationResult
        }
      }),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    // Log and return error response
    console.error("Unhandled error in newsletter subscription:", error);
    
    // Add detailed error information for debugging
    let errorDetails: any = {
      message: error instanceof Error ? error.message : "Unknown error occurred",
      type: error instanceof Error ? error.constructor.name : typeof error
    };
    
    if (error instanceof Error && 'stack' in error) {
      errorDetails.stack = error.stack;
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorDetails.message,
        errorDetails: isDebugMode() ? errorDetails : undefined
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};

// Helper function to check if we're in debug mode
function isDebugMode() {
  const debugFlag = Deno.env.get("DEBUG");
  return debugFlag === "true" || debugFlag === "1";
}

/**
 * Send notification email to admin about a new subscription
 */
async function sendAdminNotification(
  name: string, 
  email: string, 
  phone?: string, 
  isDuplicate: boolean = false
): Promise<{sent: boolean; message?: string}> {
  try {
    console.log(`Sending newsletter subscription notification to ${NOTIFICATION_EMAIL}`);
    
    const subscriptionTime = new Date().toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${isDuplicate ? 'Newsletter Subscription Attempt (Duplicate)' : 'New Newsletter Subscription'}</h2>
        <p>A ${isDuplicate ? 'user attempted to subscribe again' : 'new user has subscribed'} to the newsletter at ${subscriptionTime}.</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Subscriber Information:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Status:</strong> ${isDuplicate ? 'Already subscribed' : 'New subscription'}</p>
        </div>
        
        <p style="color: #666; font-size: 12px;">This is an automated notification from your InfoChir website.</p>
      </div>
    `;
    
    const text = `
      ${isDuplicate ? 'NEWSLETTER SUBSCRIPTION ATTEMPT (DUPLICATE)' : 'NEW NEWSLETTER SUBSCRIPTION'}
      
      A ${isDuplicate ? 'user attempted to subscribe again' : 'new user has subscribed'} to the newsletter at ${subscriptionTime}.
      
      Subscriber Information:
      Name: ${name}
      Email: ${email}
      ${phone ? `Phone: ${phone}` : ''}
      Status: ${isDuplicate ? 'Already subscribed' : 'New subscription'}
      
      This is an automated notification from your InfoChir website.
    `;
    
    const emailResult = await sendEmail(
      NOTIFICATION_EMAIL,
      `${isDuplicate ? '[DUPLICATE] ' : ''}InfoChir Newsletter Subscription: ${name}`,
      html,
      text,
      email // set reply-to as the subscriber's email
    );
    
    if (emailResult.success) {
      console.log("Admin newsletter notification email sent successfully");
      return { sent: true };
    } else {
      console.error("Failed to send admin newsletter notification email:", emailResult.error);
      return { 
        sent: false, 
        message: emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error)
      };
    }
  } catch (error) {
    console.error("Error sending admin newsletter notification:", error);
    return { 
      sent: false, 
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Send welcome confirmation email to the user
 */
async function sendUserConfirmation(
  name: string, 
  email: string, 
  isDuplicate: boolean = false
): Promise<{sent: boolean; message?: string}> {
  try {
    console.log(`Sending user confirmation email to ${email}`);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${isDuplicate ? 'Déjà abonné' : 'Bienvenue dans notre newsletter'}</title>
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
              .email-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #1E40AF, #41b06e); color: white; padding: 40px 30px; text-align: center; }
              .content { padding: 40px 30px; }
              .success-icon { font-size: 64px; margin-bottom: 20px; }
              .info-box { background: linear-gradient(135deg, #e8f4f8, #f0f8ff); padding: 25px; margin: 25px 0; border-radius: 10px; border-left: 5px solid #41b06e; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
              .team-message { background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; border: 2px solid #41b06e; }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <div class="success-icon">${isDuplicate ? '📧' : '🎉'}</div>
                  <h1 style="margin: 0; font-size: 28px;">${isDuplicate ? 'Déjà Abonné !' : 'Bienvenue dans la Newsletter Info-Chir !'}</h1>
                  <p style="margin: 15px 0 0 0; opacity: 0.95; font-size: 16px;">${isDuplicate ? 'Vous êtes déjà membre de notre communauté' : 'Merci de rejoindre notre communauté médicale'}</p>
              </div>
              
              <div class="content">
                  <div class="team-message">
                      <h2 style="color: #1E40AF; margin-top: 0;">🌟 L'équipe Info-Chir vous remercie !</h2>
                      <p style="font-size: 16px; margin: 15px 0;">${isDuplicate ? 
                        'Nous avons bien reçu votre demande d\'abonnement, mais vous êtes déjà inscrit à notre newsletter !' : 
                        'Nous sommes ravis de vous compter parmi nos abonnés. Vous recevrez désormais nos dernières actualités et avancées en chirurgie.'
                      }</p>
                  </div>
                  
                  <p style="font-size: 16px;">Bonjour <strong>${name}</strong>,</p>
                  
                  <p>${isDuplicate ? 
                    'Bonne nouvelle : vous êtes déjà abonné(e) à notre newsletter Info-Chir ! Pas besoin de vous réinscrire.' :
                    'Votre abonnement à la newsletter Info-Chir a été confirmé avec succès.'
                  }</p>
                  
                  <div class="info-box">
                      <h3 style="margin-top: 0; color: #1E40AF;">📬 Ce que vous recevrez</h3>
                      <ul style="margin: 15px 0; padding-left: 20px;">
                          <li>Les dernières actualités en chirurgie</li>
                          <li>Les nouveaux articles et publications</li>
                          <li>Les événements et formations à venir</li>
                          <li>Les innovations et avancées technologiques</li>
                      </ul>
                  </div>
                  
                  <p style="margin-top: 30px;">Nous nous engageons à respecter votre vie privée et à ne jamais partager vos informations avec des tiers.</p>
                  
                  <p style="margin-top: 25px;">
                      Cordialement,<br>
                      <strong>L'équipe Info-Chir</strong><br>
                      <span style="color: #666; font-style: italic;">Votre source d'excellence chirurgicale</span>
                  </p>
              </div>
              
              <div class="footer">
                  <p><strong>Info-Chir</strong> - Plateforme de Publication Scientifique</p>
                  <p>Si vous souhaitez vous désabonner, répondez simplement à cet email.</p>
              </div>
          </div>
      </body>
      </html>
    `;
    
    const text = `
${isDuplicate ? 'DÉJÀ ABONNÉ !' : 'BIENVENUE DANS LA NEWSLETTER INFO-CHIR !'}

Bonjour ${name},

${isDuplicate ? 
  'Nous avons bien reçu votre demande d\'abonnement, mais vous êtes déjà inscrit à notre newsletter Info-Chir ! Pas besoin de vous réinscrire.' :
  'Votre abonnement à la newsletter Info-Chir a été confirmé avec succès.'
}

📬 CE QUE VOUS RECEVREZ :
• Les dernières actualités en chirurgie
• Les nouveaux articles et publications
• Les événements et formations à venir
• Les innovations et avancées technologiques

Nous nous engageons à respecter votre vie privée et à ne jamais partager vos informations avec des tiers.

Cordialement,
L'équipe Info-Chir
"Votre source d'excellence chirurgicale"

─────────────────────────────────────
Info-Chir - Plateforme de Publication Scientifique
Si vous souhaitez vous désabonner, répondez simplement à cet email.
    `.trim();
    
    const emailResult = await sendEmail(
      email,
      `${isDuplicate ? 'Info-Chir : Déjà abonné à notre newsletter' : 'Bienvenue dans la newsletter Info-Chir !'}`,
      html,
      text
    );
    
    if (emailResult.success) {
      console.log("User confirmation email sent successfully");
      return { sent: true };
    } else {
      console.error("Failed to send user confirmation email:", emailResult.error);
      return { 
        sent: false, 
        message: emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error)
      };
    }
  } catch (error) {
    console.error("Error sending user confirmation email:", error);
    return { 
      sent: false, 
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

// Serve the handler
serve(handler);
