// Vercel Serverless Function - List Media
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir).filter(f => !f.startsWith('.'));
      return res.status(200).json({ files });
    }
    return res.status(200).json({ files: [] });
  } catch (err) {
    return res.status(500).json({ files: [], error: err.message });
  }
}
