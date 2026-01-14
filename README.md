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

**Current Status**: The app uses a local proxy server for reliable website loading.

**How it works**:
1. Start the proxy server: `node proxy-server.js`
2. The app automatically detects and uses the local proxy when ISP configurations are selected
3. Websites load properly through the controlled proxy environment

**Setup Required**:
```bash
# Start the proxy server
npm run proxy
```

**For Advanced IP Changing**:
- Commercial services like Bright Data or Oxylabs offer true residential IP rotation
- The local proxy can be extended to use these services

### Example Proxy Usage:

```javascript
// Frontend automatically uses:
const proxyUrl = `http://localhost:3001/api/proxy?url=${encodeURIComponent(targetUrl)}&location=${config.location}`;
```

### Backend Proxy (Optional):

For more control, you can still use the included proxy server:

```bash
node proxy-server.js
```

See `PROXY_SETUP.md` for complete backend implementation details.

### Backend Proxy (Optional):

For more control, you can still use the included proxy server:

```bash
node proxy-server.js
```

See `PROXY_SETUP.md` for complete backend implementation details.
