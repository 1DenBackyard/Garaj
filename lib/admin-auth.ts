import crypto from 'crypto';

const COOKIE_NAME = 'admin_auth';

function getPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function createAdminToken(password: string) {
  return crypto.createHash('sha256').update(`garaj-admin:${password}`).digest('hex');
}

export function isPasswordConfigured() {
  return getPassword().length > 0;
}

export function isValidAdminPassword(password: string) {
  const configured = getPassword();
  return configured.length > 0 && password === configured;
}

export function getExpectedAdminToken() {
  return createAdminToken(getPassword());
}

export function isValidAdminToken(token: string | undefined) {
  if (!token || !isPasswordConfigured()) {
    return false;
  }

  return token === getExpectedAdminToken();
}
