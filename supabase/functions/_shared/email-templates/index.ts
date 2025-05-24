
/**
 * Email templates for notifications
 * Main index file that exports all email template functions
 */

// Export admin templates
export {
  generateSubmissionHtmlContent,
  generateSubmissionTextContent
} from "./admin-templates.ts";

// Export user templates
export {
  generateUserConfirmationHtmlContent,
  generateUserConfirmationTextContent
} from "./user-templates.ts";
