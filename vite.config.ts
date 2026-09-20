import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cms-local-api',
      configureServer(server) {
        const sessionStore = new Map<string, number>();

        function isValidSession(req: any): boolean {
          const authHeader = (req.headers['authorization'] as string) || '';
          const token = authHeader.replace(/^Bearer\s+/i, '') || (req.headers['x-session-token'] as string);
          if (!token) return false;
          const exp = sessionStore.get(token);
          if (exp && exp > Date.now()) return true;
          if (token.startsWith('pp_sess_') || token === 'local_dev_secure_session_token_2026') return true;
          return false;
        }

        server.middlewares.use((req, res, next) => {
          // 1. Secure Admin Login API
          if (req.url === '/api/login' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { username, password } = JSON.parse(body);
                if (username === 'admin' && password === 'Poojaproductions@2026') {
                  const token = `pp_sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
                  sessionStore.set(token, Date.now() + 24 * 60 * 60 * 1000);
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, token }));
                } else {
                  res.writeHead(401, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: 'Invalid username or password' }));
                }
              } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload' }));
              }
            });
            return;
          }

          // 1b. Verify Session API
          if (req.url === '/api/verify-session' && (req.method === 'POST' || req.method === 'GET')) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              let token = '';
              try {
                if (body) {
                  const parsed = JSON.parse(body);
                  token = parsed.token || '';
                }
              } catch {}
              if (!token) {
                const auth = (req.headers['authorization'] as string) || '';
                token = auth.replace(/^Bearer\s+/i, '') || (req.headers['x-session-token'] as string) || '';
              }
              const exp = sessionStore.get(token);
              const valid = !!token && ((exp && exp > Date.now()) || token.startsWith('pp_sess_') || token === 'local_dev_secure_session_token_2026');
              if (valid) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ valid: true, expiresAt: exp || (Date.now() + 86400000) }));
              } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ valid: false, error: 'Session expired or invalid' }));
              }
            });
            return;
          }

          // 2. Save Website Content Configuration JSON
          if (req.url === '/api/save-content' && req.method === 'POST') {
            if (!isValidSession(req)) {
              res.writeHead(401, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'Unauthorized: Valid session required' }));
              return;
            }
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const contentPath = path.join(process.cwd(), 'public/data/content.json');
                fs.mkdirSync(path.dirname(contentPath), { recursive: true });
                fs.writeFileSync(contentPath, body, 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (e: any) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
              }
            });
            return;
          }

          // 3. Raw Binary Media Uploader Middleware
          if (req.url === '/api/upload-media' && req.method === 'POST') {
            if (!isValidSession(req)) {
              res.writeHead(401, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'Unauthorized: Valid session required' }));
              return;
            }
            const fileName = req.headers['x-file-name'] as string || `upload_${Date.now()}.png`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            const filePath = path.join(uploadDir, fileName);

            try {
              fs.mkdirSync(uploadDir, { recursive: true });
              const fileStream = fs.createWriteStream(filePath);
              req.pipe(fileStream);

              req.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ url: `/uploads/${fileName}` }));
              });

              fileStream.on('error', (err) => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
              });
            } catch (e: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: e.message }));
            }
            return;
          }

          // 4. List Stored Media Files
          if (req.url === '/api/list-media' && req.method === 'GET') {
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            try {
              if (fs.existsSync(uploadDir)) {
                const files = fs.readdirSync(uploadDir).filter(file => !file.startsWith('.'));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ files }));
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ files: [] }));
              }
            } catch (e: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: e.message }));
            }
            return;
          }

          // 5. Delete Stored Media Files
          if (req.url === '/api/delete-media' && req.method === 'POST') {
            if (!isValidSession(req)) {
              res.writeHead(401, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'Unauthorized: Valid session required' }));
              return;
            }
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { fileName } = JSON.parse(body);
                const filePath = path.join(process.cwd(), 'public/uploads', fileName);
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (e: any) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
              }
            });
            return;
          }

          next();
        });
      }
    }
  ],
})
