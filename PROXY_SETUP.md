# GeoNet Simulator - Proxy Setup Guide

## Current Implementation (Recommended)

The app now uses **CodeTabs Proxy** (https://api.codetabs.com/v1/proxy) - a reliable free proxy service that works directly without requiring any backend setup.

### Features:
- ✅ **No backend required** - works out of the box
- ✅ **Automatic proxying** when ISP configs are selected
- ✅ **CORS bypass** for cross-origin requests
- ✅ **Reliable** and free to use

### How it works:
```javascript
// When an ISP config is selected, URLs are automatically proxied:
const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
```

## Alternative: Backend Proxy Server

For more control and customization, you can use the included backend proxy server.

### Quick Start with Backend Proxy

1. Install dependencies:
```bash
npm install express express-http-proxy cors dotenv
```

2. Run the proxy server:
```bash
node proxy-server.js
```

3. Update `BrowserView.tsx` to use the backend proxy instead of the direct service.

### Backend Features:
- Custom header injection for location simulation
- Configurable proxy service (can use different providers)
- More control over request/response handling

## Alternative Proxy Services

### 1. CodeTabs Proxy (Current)
```javascript
const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
```
**Status**: ✅ Currently in use - reliable and functional

### 2. CORS Anywhere
```javascript
const proxyUrl = `https://cors-anywhere.herokuapp.com/${encodeURIComponent(url)}`;
```
**Note**: Requires visiting https://cors-anywhere.herokuapp.com/corsdemo to enable

### 3. ThingProxy
```javascript
const proxyUrl = `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`;
```

### 4. AllOrigins
```javascript
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
```
**Note**: Returns JSON response, not suitable for iframe embedding

## For Real IP Changing

The current proxy services provide CORS bypass but don't change actual IP addresses. For true geographic IP rotation, use commercial services:

- **Bright Data** (formerly Luminati)
- **Oxylabs**
- **Smart Proxy**
- **ProxyMesh**

These services provide residential proxies with IPs from different countries.

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