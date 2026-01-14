# GeoNet Simulator - Backend Proxy Example

This is an example of how to implement real IP changing for the GeoNet Simulator using open source proxy services.

## Quick Start with CORS Anywhere

CORS Anywhere is an open source proxy service that can bypass CORS restrictions and provide basic proxying.

1. Install dependencies for the proxy server:
```bash
npm install express express-http-proxy cors dotenv
```
Or use the provided package.json:
```bash
npm install --package-lock-only proxy-package.json
```

2. Run the proxy server:
```bash
node proxy-server.js
```
Or:
```bash
npm start
```

3. The server will proxy requests through CORS Anywhere (https://cors-anywhere.herokuapp.com)

## Testing the Proxy

Test the proxy server:
```bash
curl "http://localhost:3001/api/proxy?url=https://httpbin.org/ip&location=Delhi,%20India"
```

You should see the response proxied through CORS Anywhere with simulated headers.

## Limitations of CORS Anywhere

- **No Real IP Changing**: CORS Anywhere runs on a single server, so all requests come from the same IP
- **Rate Limiting**: Free service may have rate limits
- **CORS Bypassing**: Primarily designed for CORS issues, not IP geolocation

## For Real IP Changing

For actual IP changing with different geographic locations, use commercial proxy services:

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

## Alternative Open Source Options

1. **AllOrigins** (https://api.allorigins.win/):
   - Returns JSON responses
   - Good for API proxying

2. **CodeTabs Proxy** (https://api.codetabs.com/v1/proxy?quest=):
   - Simple GET proxy
   - Limited to GET requests

3. **CORS Proxy** (https://corsproxy.org/):
   - Similar to CORS Anywhere
   - May have different rate limits