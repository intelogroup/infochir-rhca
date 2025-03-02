
// This file is kept for backward compatibility
// It re-exports all functionality from the new module structure
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('DownloadAnalytics');
logger.log('Using deprecated import path. Consider updating imports to use @/lib/analytics/download instead.');

export * from './download';
