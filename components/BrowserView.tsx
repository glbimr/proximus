import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Home, Smartphone, Monitor } from 'lucide-react';
import { IPConfig } from '../types';

interface BrowserViewProps {
  url: string;
  setUrl: (url: string) => void;
  config: IPConfig | null;
  onRefresh: () => void;
  isLoading: boolean;
}

const BrowserView: React.FC<BrowserViewProps> = ({ url, setUrl, config, onRefresh, isLoading }) => {
  const [inputUrl, setInputUrl] = useState(url);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [proxyUrl, setProxyUrl] = useState<string | null>(null);
  const [proxyError, setProxyError] = useState(false);
  
  useEffect(() => {
    setInputUrl(url);
  }, [url]);

  // Use direct proxy service - no backend server required
  useEffect(() => {
    if (config && url) {
      // Use CORS Proxy service - designed for iframe embedding
      const proxyService = 'https://www.corsproxy.com/?';
      setProxyUrl(`${proxyService}${encodeURIComponent(url)}`);
      setProxyError(false);
    } else {
      setProxyUrl(null);
      setProxyError(false);
    }
  }, [config, url]);

  // Simulate different loading times based on config
  const getSimulatedLoadTime = () => {
    if (!config) return 800;
    return config.latency + Math.random() * 200; // Add some variance
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      let finalUrl = inputUrl;
      if (!finalUrl.startsWith('http')) {
        finalUrl = `https://${finalUrl}`;
      }
      setUrl(finalUrl);
      onRefresh();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* Browser Chrome (Top Bar) */}
      <div className="h-14 bg-slate-200 border-b border-slate-300 flex items-center px-4 gap-3 shadow-sm">
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-slate-300 rounded-full text-slate-600">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-slate-300 rounded-full text-slate-600">
            <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={onRefresh} className={`p-1.5 hover:bg-slate-300 rounded-full text-slate-600 ${isLoading ? 'animate-spin' : ''}`}>
            <RotateCw className="h-4 w-4" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center bg-white rounded-full border border-slate-300 px-3 py-1.5 shadow-inner">
          <Lock className="h-3 w-3 text-green-600 mr-2" />
          <input
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none font-sans"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter website URL..."
          />
        </div>

        {/* Device Toggles */}
        <div className="flex bg-slate-300 rounded-lg p-0.5">
          <button 
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded ${deviceMode === 'desktop' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button 
             onClick={() => setDeviceMode('mobile')}
             className={`p-1.5 rounded ${deviceMode === 'mobile' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Viewport Area */}
      <div className="flex-1 bg-slate-800 flex justify-center items-start overflow-auto p-4 relative">
        {/* Connection Overlay */}
        {config && (
            <div className="absolute top-6 right-6 z-10 bg-black/90 text-white text-xs px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 shadow-lg max-w-xs">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="font-medium">Routed via {config.provider}</span>
                </div>
                <div className="text-slate-300 text-xs">
                    IP: {config.ip} • {config.location}
                </div>
                <div className="mt-1 text-xs">
                    {proxyUrl && proxyUrl.includes('corsproxy.com') ? (
                        <span className="text-green-400 flex items-center gap-1">
                            <span>✓</span>
                            <span>Proxy Active (CORS Proxy)</span>
                        </span>
                    ) : proxyError ? (
                        <span className="text-orange-400 flex items-center gap-1">
                            <span>⚠️</span>
                            <span>Proxy Failed - Direct Connection</span>
                        </span>
                    ) : (
                        <span className="text-yellow-400 flex items-center gap-1">
                            <span>⚠️</span>
                            <span>Direct Connection - No Proxy</span>
                        </span>
                    )}
                </div>
            </div>
        )}

        <div 
          className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden relative ${
            deviceMode === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl border-8 border-slate-900' : 'w-full h-full rounded-b-md'
          }`}
        >
          {isLoading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Resolving via {config?.provider || 'Network'}...</p>
                <p className="text-xs text-slate-400 mt-2">Handshaking TLS 1.3 • {config?.ip}</p>
             </div>
          ) : null}

          {/* 
            Extended permissions for WebRTC and screen sharing support within the simulated browser.
          */}
          <iframe 
            src={proxyError ? url : (proxyUrl || url)}
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation allow-top-navigation-by-user-activation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; microphone; camera; geolocation; display-capture"
            title="Simulated Browser"
            onError={() => {
              console.log("Proxy failed, falling back to direct connection");
              setProxyError(true);
            }}
            onLoad={() => {
              // Reset error state on successful load
              setProxyError(false);
            }}
          />
          
          {/* Fallback Overlay for blocked iframes (common with major sites) */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-slate-50/10 backdrop-grayscale-[50%] z-0">
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserView;