// Vercel Serverless Function - Admin Login
// Credentials are checked server-side only — never exposed to the frontend

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'Poojaproductions@2026';

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true,
      token: 'local_dev_secure_session_token_2026'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid username or password'
  });
}
