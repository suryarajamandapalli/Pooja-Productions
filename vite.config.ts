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
        server.middlewares.use((req, res, next) => {
          // 1. Secure Admin Login API
          if (req.url === '/api/login' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { username, password } = JSON.parse(body);
                // Securely matched on node server side; never sent to frontend client
                if (username === 'admin' && password === 'Poojaproductions@2026') {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, token: 'local_dev_secure_session_token_2026' }));
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

          // 2. Save Website Content Configuration JSON
          if (req.url === '/api/save-content' && req.method === 'POST') {
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

          // 3. Raw Binary Media Uploader Middleware (Zero external packages needed)
          if (req.url === '/api/upload-media' && req.method === 'POST') {
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
