import { createHmac } from 'crypto';
import { CONFIG } from '../../config/env.js';

export function verifyTelegramWebAppData(initData: string): { valid: boolean; user?: any } {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  
  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(CONFIG.TELEGRAM_BOT_TOKEN).digest();
  const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (hash !== calculatedHash) {
    return { valid: false };
  }

  const userParam = urlParams.get('user');
  if (!userParam) return { valid: false };

  try {
    const user = JSON.parse(userParam);
    return { valid: true, user };
  } catch {
    return { valid: false };
  }
}
