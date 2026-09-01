// Re-export settings functions from db for backward compatibility
export { getSettings, updateSetting, getWhatsAppLink, getPhoneLink } from './db';
export type { Settings } from './db';
