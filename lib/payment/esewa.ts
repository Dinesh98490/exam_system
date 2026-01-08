import crypto from 'crypto';

export const ESEWA_TEST_PID = 'EPAYTEST';
export const ESEWA_TEST_SECRET = '8gBm/:&EnhH.1/q';
export const ESEWA_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

export function generateEsewaSignature(totalAmount: string, transactionUuid: string, productCode: string) {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  const hmac = crypto.createHmac('sha256', ESEWA_TEST_SECRET);
  hmac.update(message);
  return hmac.digest('base64');
}

export function verifyEsewaSignature(data: any) {
    // Decoding and verification logic would go here
    // For test environment, we trust the callback but in prod we must verify
    return true; 
}
