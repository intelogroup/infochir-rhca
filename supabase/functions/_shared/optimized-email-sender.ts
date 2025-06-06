
/**
 * Optimized email sender with queue support and rate limiting
 */
import { sendEmail } from "./email-sender.ts";
import { downloadMultipleFilesAsAttachments, validateFileForAttachment, getAttachmentsSummary, type FileAttachment } from "./file-retrieval.ts";
import { 
  getTodayEmailUsage, 
  updateEmailUsage, 
  canSendEmail, 
  queueEmail, 
  getOptimalEmailStrategy,
  EmailQueueItem 
} from "./email-queue.ts";

// Helper function to add delay between emails
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface OptimizedEmailResult {
  success: boolean;
  sent: boolean;
  queued: boolean;
  message: string;
  recipient?: string;
  attachmentsSummary?: {
    count: number;
    totalSize: number;
    skipped: number;
  };
}

/**
 * Send email with optimization and fallback to queue, with optional file attachments
 */
export async function sendOptimizedEmail(
  recipient: string,
  subject: string,
  html: string,
  text: string,
  priority: 'high' | 'medium' | 'low' = 'medium',
  emailType: 'user_confirmation' | 'admin_notification' | 'admin_secondary' = 'admin_notification',
  submissionId?: string,
  replyTo?: string,
  fileUrls?: string[]
): Promise<OptimizedEmailResult> {
  console.log(`[optimized-email] Attempting to send ${emailType} email to ${recipient}`);
  
  try {
    // Check if we can send emails today
    const { canSend, remaining } = await canSendEmail();
    
    if (!canSend) {
      console.log(`[optimized-email] Daily limit reached, queuing email for ${recipient}`);
      
      // Queue for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0); // Schedule for 9 AM tomorrow
      
      await queueEmail({
        recipient,
        subject,
        html,
        text,
        priority,
        email_type: emailType,
        submission_id: submissionId,
        reply_to: replyTo,
        retry_count: 0,
        scheduled_for: tomorrow.toISOString()
      });
      
      return {
        success: true,
        sent: false,
        queued: true,
        message: `Email queued for tomorrow (daily limit reached). ${remaining} emails remaining today.`,
        recipient
      };
    }
    
    // Process file attachments if provided with enhanced safety
    let attachments: FileAttachment[] = [];
    let skippedFiles = 0;
    
    if (fileUrls && fileUrls.length > 0) {
      console.log(`[optimized-email] Processing ${fileUrls.length} file attachments for ${recipient}`);
      
      try {
        // Download files with safety limits
        const allAttachments = await downloadMultipleFilesAsAttachments(
          fileUrls,
          10, // Max 10 files per email
          40 * 1024 * 1024 // Max 40MB total for attachments
        );
        
        // Filter out invalid attachments and count skipped files
        attachments = allAttachments.filter(att => {
          const isValid = validateFileForAttachment(att);
          if (!isValid) skippedFiles++;
          return isValid;
        });
        
        // Get summary for logging
        const summary = getAttachmentsSummary(attachments);
        console.log(`[optimized-email] Attachment summary:`, {
          processed: attachments.length,
          skipped: skippedFiles,
          totalRequested: fileUrls.length,
          totalSize: summary.totalSize,
          largestFile: summary.largestFile
        });
        
        if (skippedFiles > 0) {
          console.warn(`[optimized-email] ${skippedFiles} attachments were skipped due to validation failures`);
        }
      } catch (attachmentError) {
        console.error(`[optimized-email] Error processing attachments:`, attachmentError);
        // Continue without attachments rather than failing completely
        console.log(`[optimized-email] Continuing without attachments due to processing error`);
        skippedFiles = fileUrls.length; // All files were skipped
      }
    }
    
    // Attempt to send the email
    console.log(`[optimized-email] Sending email to ${recipient}. ${remaining} emails remaining today.`);
    const emailResult = await sendEmail(recipient, subject, html, text, replyTo, attachments);
    
    // Update usage statistics
    await updateEmailUsage(emailResult.success);
    
    if (emailResult.success) {
      console.log(`[optimized-email] Email sent successfully to ${recipient} with ${attachments.length} attachments`);
      return {
        success: true,
        sent: true,
        queued: false,
        message: `Email sent successfully with ${attachments.length} attachments`,
        recipient,
        attachmentsSummary: {
          count: attachments.length,
          totalSize: attachments.reduce((sum, att) => sum + att.size, 0),
          skipped: skippedFiles
        }
      };
    } else {
      console.error(`[optimized-email] Failed to send email to ${recipient}:`, emailResult.error);
      
      // Queue for retry later today if we still have capacity, otherwise tomorrow
      const retryTime = new Date();
      if (remaining > 1) {
        retryTime.setHours(retryTime.getHours() + 1); // Retry in 1 hour
      } else {
        retryTime.setDate(retryTime.getDate() + 1);
        retryTime.setHours(9, 0, 0, 0); // Tomorrow at 9 AM
      }
      
      await queueEmail({
        recipient,
        subject,
        html,
        text,
        priority,
        email_type: emailType,
        submission_id: submissionId,
        reply_to: replyTo,
        retry_count: 0,
        scheduled_for: retryTime.toISOString()
      });
      
      return {
        success: false,
        sent: false,
        queued: true,
        message: `Email send failed, queued for retry. Error: ${emailResult.error?.message || 'Unknown error'}`,
        recipient,
        attachmentsSummary: {
          count: attachments.length,
          totalSize: attachments.reduce((sum, att) => sum + att.size, 0),
          skipped: skippedFiles
        }
      };
    }
  } catch (error) {
    console.error(`[optimized-email] Error in sendOptimizedEmail for ${recipient}:`, error);
    
    // Queue on any error
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      await queueEmail({
        recipient,
        subject,
        html,
        text,
        priority,
        email_type: emailType,
        submission_id: submissionId,
        reply_to: replyTo,
        retry_count: 0,
        scheduled_for: tomorrow.toISOString()
      });
    } catch (queueError) {
      console.error(`[optimized-email] Failed to queue email:`, queueError);
    }
    
    return {
      success: false,
      sent: false,
      queued: true,
      message: `Email error, queued for retry. Error: ${error instanceof Error ? error.message : String(error)}`,
      recipient
    };
  }
}

/**
 * Send multiple emails with smart strategy and rate limiting, with file attachments
 */
export async function sendOptimizedBatch(
  userEmail: string,
  userSubject: string,
  userHtml: string,
  userText: string,
  adminEmails: string[],
  adminSubject: string,
  adminHtml: string,
  adminText: string,
  submissionId?: string,
  replyTo?: string,
  articleFiles?: string[],
  imageAnnexes?: string[]
): Promise<{
  userResult: OptimizedEmailResult;
  adminResults: OptimizedEmailResult[];
  strategy: string;
  usage: any;
}> {
  console.log("[optimized-email] Starting optimized batch email send with attachments");
  
  // Get optimal strategy based on current usage
  const strategy = await getOptimalEmailStrategy();
  console.log(`[optimized-email] Using strategy: ${strategy.strategy}, remaining emails: ${strategy.remaining}`);
  
  const results = {
    userResult: null as OptimizedEmailResult | null,
    adminResults: [] as OptimizedEmailResult[],
    strategy: strategy.strategy,
    usage: strategy
  };
  
  // Prepare file attachments for admin emails (combine article files and annexes)
  const adminAttachments = [...(articleFiles || []), ...(imageAnnexes || [])];
  
  // Send user confirmation (highest priority) - no attachments for user
  if (strategy.sendUserConfirmation) {
    results.userResult = await sendOptimizedEmail(
      userEmail,
      userSubject,
      userHtml,
      userText,
      'high',
      'user_confirmation',
      submissionId
    );
    
    // Add delay after user email
    await delay(600);
  } else {
    // Queue user confirmation
    results.userResult = await sendOptimizedEmail(
      userEmail,
      userSubject,
      userHtml,
      userText,
      'high',
      'user_confirmation',
      submissionId
    );
  }
  
  // Send primary admin notification with attachments
  if (strategy.sendPrimaryAdmin && adminEmails.length > 0) {
    await delay(600); // Rate limiting delay
    
    const primaryAdminResult = await sendOptimizedEmail(
      adminEmails[0],
      adminSubject,
      adminHtml,
      adminText,
      'medium',
      'admin_notification',
      submissionId,
      replyTo,
      adminAttachments // Include attachments for admin
    );
    results.adminResults.push(primaryAdminResult);
  } else if (adminEmails.length > 0) {
    // Queue primary admin
    const primaryAdminResult = await sendOptimizedEmail(
      adminEmails[0],
      adminSubject,
      adminHtml,
      adminText,
      'medium',
      'admin_notification',
      submissionId,
      replyTo,
      adminAttachments // Include attachments for admin
    );
    results.adminResults.push(primaryAdminResult);
  }
  
  // Send secondary admin notification with attachments
  if (strategy.sendSecondaryAdmin && adminEmails.length > 1) {
    await delay(600); // Rate limiting delay
    
    const secondaryAdminResult = await sendOptimizedEmail(
      adminEmails[1],
      adminSubject,
      adminHtml,
      adminText,
      'low',
      'admin_secondary',
      submissionId,
      replyTo,
      adminAttachments // Include attachments for admin
    );
    results.adminResults.push(secondaryAdminResult);
  } else if (adminEmails.length > 1) {
    // Queue secondary admin
    const secondaryAdminResult = await sendOptimizedEmail(
      adminEmails[1],
      adminSubject,
      adminHtml,
      adminText,
      'low',
      'admin_secondary',
      submissionId,
      replyTo,
      adminAttachments // Include attachments for admin
    );
    results.adminResults.push(secondaryAdminResult);
  }
  
  console.log(`[optimized-email] Batch complete. Strategy: ${strategy.strategy}, attachments: ${adminAttachments.length} files`);
  
  return {
    userResult: results.userResult!,
    adminResults: results.adminResults,
    strategy: strategy.strategy,
    usage: strategy
  };
}

// Export the original function with a note about deprecation
export { getTodayEmailUsage };
