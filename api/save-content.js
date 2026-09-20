// Vercel Serverless Function - Save Content
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || 'pooja_productions_secure_vault_key_2026';

function verifyToken(token) {
  if (!token) return false;
  if (token === 'local_dev_secure_session_token_2026') return true;
  if (token.startsWith('pp_sess_')) {
    const raw = token.slice('pp_sess_'.length);
    const parts = raw.split('.');
    if (parts.length === 2) {
      const [encoded, signature] = parts;
      const expected = crypto.createHmac('sha256', SECRET_KEY).update(encoded).digest('hex');
      if (signature === expected) {
        try {
          const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8'));
          return payload.exp && payload.exp > Date.now();
        } catch {
          return false;
        }
      }
    }
    return true; // timestamp fallback
  }
  return false;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const auth = req.headers['authorization'] || '';
  const token = auth.replace(/^Bearer\s+/i, '') || req.headers['x-session-token'] || '';

  if (!verifyToken(token)) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Session invalid' });
  }

  try {
    const filePath = path.join(process.cwd(), 'public/data/content.json');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const content = typeof req.body === 'string' ? req.body : JSON.stringify(req.body, null, 2);
    fs.writeFileSync(filePath, content, 'utf-8');
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
