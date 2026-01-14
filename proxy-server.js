import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock IP database - in real implementation, use actual proxy service
const mockIPs = {
  'Delhi, India': '122.160.22.15',
  'Mumbai, India': '122.170.11.45',
  'Bangalore, India': '49.32.112.55',
  'Hyderabad, India': '49.35.201.12',
  // Add more locations as needed
};

// Proxy route that routes through different IPs
app.use('/api/proxy', (req, res, next) => {
  const targetUrl = req.query.url;
  const location = req.query.location;

  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // Use CORS Anywhere as the proxy service
  // Note: CORS Anywhere doesn't change IP addresses, but provides proxying
  // For real IP changing, use commercial services like Bright Data or Oxylabs
  const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com';

  proxy(corsAnywhereUrl, {
    proxyReqPathResolver: (proxyReq) => {
      // CORS Anywhere expects the target URL as a path
      return `/${encodeURIComponent(targetUrl)}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Add custom headers to simulate different locations
      const proxyHeaders = {
        'X-Forwarded-For': mockIPs[location] || '127.0.0.1',
        'X-Real-IP': mockIPs[location] || '127.0.0.1',
        'X-Client-IP': mockIPs[location] || '127.0.0.1',
        'User-Agent': 'Mozilla/5.0 (GeoNet Simulator)',
        'Accept-Language': location && location.includes('India') ? 'en-IN,en;q=0.9' : 'en-US,en;q=0.9',
        'X-Requested-With': 'XMLHttpRequest' // Required by CORS Anywhere
      };

      proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        ...proxyHeaders
      };
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      // Add custom headers to response
      userRes.setHeader('X-Proxied-Location', location || 'Unknown');
      userRes.setHeader('X-Simulated-IP', mockIPs[location] || '127.0.0.1');
      userRes.setHeader('X-Proxy-Service', 'CORS Anywhere (Open Source)');
      return proxyResData;
    }
  })(req, res, next);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Proxy server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Example: http://localhost:${PORT}/api/proxy?url=https://httpbin.org/ip&location=Delhi,%20India`);
});