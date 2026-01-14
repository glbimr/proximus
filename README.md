<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1RU-A9Qp3ovJMb42SPdnVmFDUSl4hXFnh

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set your Gemini API key:
   `cp .env.example .env`
   Then edit `.env` and add your actual Gemini API key.
3. Run the app:
   `npm run dev`

## Deploy

1. Build the app:
   `npm run build`
2. The built files will be in the `dist/` directory
3. Deploy the contents of `dist/` to your web server
4. Make sure to set the `GEMINI_API_KEY` environment variable on your deployment platform

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required for AI features)

## IP Routing Implementation

**Current Status**: This application runs in simulation mode only. The iframe loads websites directly from your IP address.

**To Enable Real IP Changing**:

1. **Backend Proxy Service**: Implement a backend API that routes requests through residential proxies
2. **Proxy Integration**: Use services like Bright Data, Oxylabs, or Smart Proxy for residential IPs
3. **API Endpoint**: Create `/api/proxy?url={url}&country={country}` endpoint

### Example Backend Implementation (Node.js/Express):

```javascript
const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

app.use('/api/proxy', proxy('https://your-proxy-service.com', {
  proxyReqPathResolver: (req) => {
    const url = req.query.url;
    const country = req.query.country;
    return `/proxy?url=${encodeURIComponent(url)}&country=${country}`;
  }
}));
```

### Frontend Integration:

```javascript
const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}&country=${config.location}`;
```

See `PROXY_SETUP.md` and `proxy-server.js` for a complete backend implementation example.
