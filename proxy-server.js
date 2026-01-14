const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
require('dotenv').config();

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

  // In real implementation, use a proxy service like Bright Data
  // For now, we'll simulate by adding headers
  const proxyHeaders = {
    'X-Forwarded-For': mockIPs[location] || '127.0.0.1',
    'X-Real-IP': mockIPs[location] || '127.0.0.1',
    'X-Client-IP': mockIPs[location] || '127.0.0.1',
    'User-Agent': 'Mozilla/5.0 (GeoNet Simulator)',
    'Accept-Language': location.includes('India') ? 'en-IN,en;q=0.9' : 'en-US,en;q=0.9'
  };

  // Use a proxy service or direct request
  // This is a simplified example - real implementation would use residential proxies
  proxy(targetUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Add custom headers to simulate different locations
      proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        ...proxyHeaders
      };
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      // Add custom headers to response
      userRes.setHeader('X-Proxied-Location', location);
      userRes.setHeader('X-Simulated-IP', mockIPs[location] || '127.0.0.1');
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