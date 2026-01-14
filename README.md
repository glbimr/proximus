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

**Current Status**: The app now uses CORS Proxy (https://www.corsproxy.com/) - a reliable free proxy service designed for iframe embedding that properly renders HTML content.

**How it works**:
- Requests are automatically routed through CORS Proxy when an ISP configuration is selected
- No additional setup or server required
- Properly serves HTML content for iframe rendering (not raw HTML code)

**For Advanced IP Changing**:
- The included `proxy-server.js` provides a customizable backend solution
- Commercial services like Bright Data or Oxylabs offer true residential IP rotation

### Example Direct Proxy Usage:

```javascript
// Frontend automatically uses:
const proxyUrl = `https://www.corsproxy.com/?${encodeURIComponent(targetUrl)}`;
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
