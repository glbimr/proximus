# GeoNet Simulator - Backend Proxy Example

This is an example of how to implement real IP changing for the GeoNet Simulator.

## Quick Start

1. Install dependencies for the proxy server:
```bash
npm install express express-http-proxy cors dotenv
```

2. Run the proxy server:
```bash
node proxy-server.js
```

3. Update your frontend to use the proxy:
```typescript
// In BrowserView.tsx
const proxyUrl = `http://localhost:3001/api/proxy?url=${encodeURIComponent(url)}&location=${config.location}`;
```

## How It Works

The proxy server intercepts requests and:
- Adds `X-Forwarded-For` headers to simulate different IP addresses
- Modifies `User-Agent` and `Accept-Language` headers based on location
- Routes requests through different proxy endpoints (in real implementation)

## Testing

Test the proxy server:
```bash
curl "http://localhost:3001/api/proxy?url=https://httpbin.org/ip&location=Delhi,%20India"
```

You should see the simulated IP in the response.

## Production Deployment

For production, replace the mock proxy with a real proxy service:

### Bright Data Integration Example:
```javascript
const response = await axios.get('https://brightdata.com/api/request', {
  params: {
    url: targetUrl,
    country: location.split(',')[1].trim(),
    api_key: process.env.BRIGHTDATA_API_KEY
  }
});
```

### Oxylabs Integration Example:
```javascript
const response = await axios.get('https://data.oxylabs.io/v1/queries', {
  auth: {
    username: process.env.OXYLABS_USERNAME,
    password: process.env.OXYLABS_PASSWORD
  },
  params: {
    query: targetUrl,
    geo_location: location
  }
});
```