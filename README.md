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

**Current Status**: The app now supports functional proxying using CORS Anywhere (open source proxy service).

**To Enable Real IP Changing**:

1. **Start the Proxy Server**:
   ```bash
   # Install proxy dependencies
   npm install express express-http-proxy cors dotenv

   # Run the proxy server
   node proxy-server.js
   ```

2. **The app will automatically detect and use the proxy** when running in development mode.

3. **For Production**: Deploy the proxy server separately and update the proxy URL in `BrowserView.tsx`.

### Example Backend Implementation (Node.js/Express):

```javascript
import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/proxy', proxy('https://cors-anywhere.herokuapp.com', {
  proxyReqPathResolver: (req) => {
    const url = req.query.url;
    return `/${encodeURIComponent(url)}`;
  }
}));
```

### Frontend Integration:

The frontend automatically detects when the proxy server is running and routes requests through it.

See `PROXY_SETUP.md` and `proxy-server.js` for complete implementation details.
