import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;
const API_URL = process.env.API_URL || 'http://api:8000';

// Proxy API requests
app.use(
    '/api',
    createProxyMiddleware({
        target: API_URL,
        changeOrigin: true,
        onProxyRes: (proxyRes, req, res) => {
            proxyRes.headers['access-control-allow-origin'] = '*';
            proxyRes.headers['access-control-allow-methods'] =
                'GET, POST, OPTIONS, PUT, DELETE';
            proxyRes.headers['access-control-allow-headers'] =
                'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
        },
    })
);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - fallback middleware
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Proxying /api to ${API_URL}`);
});