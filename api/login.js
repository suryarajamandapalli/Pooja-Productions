// Vercel Serverless Function - Admin Login
import crypto from 'crypto';

const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || 'pooja_productions_secure_vault_key_2026';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Poojaproductions@2026';

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const payload = {
      user: 'admin',
      exp: Date.now() + 24 * 60 * 60 * 1000
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(encoded).digest('hex');
    const token = `pp_sess_${encoded}.${signature}`;

    return res.status(200).json({
      success: true,
      token
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid username or password'
  });
}
