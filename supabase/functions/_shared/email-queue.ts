
/**
 * Email queue and rate limiting system for Resend free plan optimization
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

// Get environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Email usage limits for Resend free plan
const DAILY_EMAIL_LIMIT = 100;
const PRIMARY_ADMIN_EMAIL = "jimkalinov@gmail.com"; // Primary admin gets priority
const SECONDARY_ADMIN_EMAIL = "jalouidor@hotmail.com";

interface EmailQueueItem {
  id?: string;
  recipient: string;
  subject: string;
  html: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  email_type: 'user_confirmation' | 'admin_notification' | 'admin_secondary';
  submission_id?: string;
  reply_to?: string;
  retry_count: number;
  scheduled_for: string;
  created_at?: string;
}

interface EmailUsage {
  date: string;
  emails_sent: number;
  successful_sends: number;
  failed_sends: number;
}

/**
 * Get today's email usage statistics
 */
export async function getTodayEmailUsage(): Promise<EmailUsage> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data, error } = await supabase
      .from('email_usage_tracking')
      .select('*')
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error("[email-queue] Error fetching email usage:", error);
      throw error;
    }

    return data || {
      date: today,
      emails_sent: 0,
      successful_sends: 0,
      failed_sends: 0
    };
  } catch (error) {
    console.error("[email-queue] Error in getTodayEmailUsage:", error);
    return {
      date: today,
      emails_sent: 0,
      successful_sends: 0,
      failed_sends: 0
    };
  }
}

/**
 * Update email usage statistics
 */
export async function updateEmailUsage(successful: boolean): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const currentUsage = await getTodayEmailUsage();
    
    const updatedUsage = {
      date: today,
      emails_sent: currentUsage.emails_sent + 1,
      successful_sends: currentUsage.successful_sends + (successful ? 1 : 0),
      failed_sends: currentUsage.failed_sends + (successful ? 0 : 1)
    };

    const { error } = await supabase
      .from('email_usage_tracking')
      .upsert(updatedUsage, { onConflict: 'date' });

    if (error) {
      console.error("[email-queue] Error updating email usage:", error);
    }
  } catch (error) {
    console.error("[email-queue] Error in updateEmailUsage:", error);
  }
}

/**
 * Check if we can send more emails today
 */
export async function canSendEmail(): Promise<{ canSend: boolean; remaining: number; usage: EmailUsage }> {
  const usage = await getTodayEmailUsage();
  const remaining = DAILY_EMAIL_LIMIT - usage.emails_sent;
  
  return {
    canSend: remaining > 0,
    remaining,
    usage
  };
}

/**
 * Add email to queue for later processing
 */
export async function queueEmail(emailItem: Omit<EmailQueueItem, 'id' | 'created_at'>): Promise<void> {
  try {
    const { error } = await supabase
      .from('email_queue')
      .insert({
        ...emailItem,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error("[email-queue] Error queuing email:", error);
      throw error;
    }

    console.log(`[email-queue] Email queued for ${emailItem.recipient} (priority: ${emailItem.priority})`);
  } catch (error) {
    console.error("[email-queue] Error in queueEmail:", error);
    throw error;
  }
}

/**
 * Get priority-ordered emails from queue ready to be sent
 */
export async function getQueuedEmails(limit: number = 10): Promise<EmailQueueItem[]> {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('email_queue')
      .select('*')
      .lte('scheduled_for', now)
      .lt('retry_count', 3) // Don't retry more than 3 times
      .order('priority', { ascending: false }) // high, medium, low
      .order('created_at', { ascending: true }) // oldest first within same priority
      .limit(limit);

    if (error) {
      console.error("[email-queue] Error fetching queued emails:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("[email-queue] Error in getQueuedEmails:", error);
    return [];
  }
}

/**
 * Remove email from queue after successful send
 */
export async function removeFromQueue(emailId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('email_queue')
      .delete()
      .eq('id', emailId);

    if (error) {
      console.error("[email-queue] Error removing email from queue:", error);
    }
  } catch (error) {
    console.error("[email-queue] Error in removeFromQueue:", error);
  }
}

/**
 * Update retry count for failed email
 */
export async function incrementRetryCount(emailId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('email_queue')
      .update({ 
        retry_count: supabase.raw('retry_count + 1'),
        scheduled_for: new Date(Date.now() + 60 * 60 * 1000).toISOString() // Retry in 1 hour
      })
      .eq('id', emailId);

    if (error) {
      console.error("[email-queue] Error incrementing retry count:", error);
    }
  } catch (error) {
    console.error("[email-queue] Error in incrementRetryCount:", error);
  }
}

/**
 * Smart email strategy based on current usage
 */
export async function getOptimalEmailStrategy(): Promise<{
  sendUserConfirmation: boolean;
  sendPrimaryAdmin: boolean;
  sendSecondaryAdmin: boolean;
  remaining: number;
  strategy: string;
}> {
  const { canSend, remaining, usage } = await canSendEmail();
  
  if (!canSend) {
    return {
      sendUserConfirmation: false,
      sendPrimaryAdmin: false,
      sendSecondaryAdmin: false,
      remaining: 0,
      strategy: 'queue_all'
    };
  }

  // Priority strategy based on remaining emails
  if (remaining >= 3) {
    // Plenty of emails left - send all
    return {
      sendUserConfirmation: true,
      sendPrimaryAdmin: true,
      sendSecondaryAdmin: true,
      remaining,
      strategy: 'send_all'
    };
  } else if (remaining >= 2) {
    // Limited emails - send user confirmation + primary admin only
    return {
      sendUserConfirmation: true,
      sendPrimaryAdmin: true,
      sendSecondaryAdmin: false,
      remaining,
      strategy: 'user_and_primary_admin'
    };
  } else if (remaining >= 1) {
    // Very limited - user confirmation only
    return {
      sendUserConfirmation: true,
      sendPrimaryAdmin: false,
      sendSecondaryAdmin: false,
      remaining,
      strategy: 'user_only'
    };
  } else {
    // No emails left - queue everything
    return {
      sendUserConfirmation: false,
      sendPrimaryAdmin: false,
      sendSecondaryAdmin: false,
      remaining: 0,
      strategy: 'queue_all'
    };
  }
}
