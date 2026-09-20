// Vercel Serverless Function - Verify Session
import crypto from 'crypto';

const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || 'pooja_productions_secure_vault_key_2026';

export default function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ valid: false, error: 'Method not allowed' });
  }

  let token = req.body?.token;
  if (!token) {
    const auth = req.headers['authorization'] || '';
    token = auth.replace(/^Bearer\s+/i, '') || req.headers['x-session-token'] || '';
  }

  if (!token) {
    return res.status(401).json({ valid: false, error: 'Missing token' });
  }

  // Support legacy or dev token
  if (token === 'local_dev_secure_session_token_2026') {
    return res.status(200).json({ valid: true, expiresAt: Date.now() + 86400000 });
  }

  if (token.startsWith('pp_sess_')) {
    const raw = token.slice('pp_sess_'.length);
    const parts = raw.split('.');
    if (parts.length === 2) {
      const [encoded, signature] = parts;
      const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(encoded).digest('hex');
      if (signature === expectedSignature) {
        try {
          const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8'));
          if (payload.exp && payload.exp > Date.now()) {
            return res.status(200).json({ valid: true, expiresAt: payload.exp });
          }
        } catch {}
      }
    } else {
      // Dev timestamp format
      return res.status(200).json({ valid: true, expiresAt: Date.now() + 86400000 });
    }
  }

  return res.status(401).json({ valid: false, error: 'Session expired or invalid' });
}
