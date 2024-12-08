import crypto from 'crypto';

export const generateCertificateNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(4).toString('hex');
  return `CERT-${timestamp}-${random}`.toUpperCase();
};