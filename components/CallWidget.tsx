import React, { useEffect, useRef } from 'react';
import { Phone, X, Mic, Activity, PhoneOff, AlertCircle } from 'lucide-react';
import { IPConfig } from '../types';
import { useGeminiLive } from '../hooks/useGeminiLive';

interface CallWidgetProps {
  config: IPConfig | null;
}

const CallWidget: React.FC<CallWidgetProps> = ({ config }) => {
  const { isActive, isTalking, volume, error, connect, disconnect } = useGeminiLive({ config });
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Close widget if config changes
  useEffect(() => {
    if (isExpanded) {
      disconnect();
      setIsExpanded(false);
    }
  }, [config?.id]);

  const toggleCall = () => {
    if (isExpanded) {
      disconnect();
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
      connect();
    }
  };

  if (!config) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'}`}>
      
      {/* Error Toast */}
      {error && (
        <div className="absolute bottom-full mb-4 right-0 bg-red-500 text-white text-xs px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Main Card */}
      <div className={`bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'rounded-2xl h-96' : 'rounded-full h-14'}`}>
        
        {/* Minimized State (FAB) */}
        {!isExpanded && (
          <button 
            onClick={toggleCall}
            className="flex items-center gap-2 px-4 h-14 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            title="Call ISP Support"
          >
            <Phone className="h-5 w-5" />
            <span className="font-medium pr-1">Test Voice Line</span>
          </button>
        )}

        {/* Expanded State (Phone UI) */}
        {isExpanded && (
          <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
               <div className="flex flex-col">
                 <h3 className="text-white font-semibold text-sm">ISP Support</h3>
                 <span className="text-xs text-slate-400">{config.provider} • {config.location}</span>
               </div>
               <div className={`text-[10px] px-2 py-1 rounded-full border flex items-center gap-1 ${isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                 <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                 {isActive ? 'VoIP Active' : 'Connecting...'}
               </div>
            </div>

            {/* Visualizer Area */}
            <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center relative p-6">
               <div className="relative">
                 {/* Ripple Effect for User Volume */}
                 <div 
                    className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl transition-all duration-75"
                    style={{ transform: `scale(${1 + volume / 20})` }}
                 />
                 
                 {/* Avatar */}
                 <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${isTalking ? 'border-green-400 bg-slate-800' : 'border-slate-700 bg-slate-900'}`}>
                    <Activity className={`w-8 h-8 ${isTalking ? 'text-green-400' : 'text-slate-600'}`} />
                 </div>
               </div>

               <div className="mt-8 text-center space-y-1">
                 <p className="text-slate-300 font-medium">
                    {isTalking ? "Support is speaking..." : (isActive ? "Listening..." : "Dialing...")}
                 </p>
                 <p className="text-xs text-slate-500 font-mono">
                    {isActive ? "00:14" : "Establishing Secure Line..."}
                 </p>
               </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-800 grid grid-cols-3 gap-4">
              <button className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-[10px]">Mute</span>
              </button>
              
              <button 
                onClick={toggleCall}
                className="flex flex-col items-center justify-center gap-1 text-red-400 hover:text-red-300 transition-colors col-span-1 -mt-6"
              >
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg border-4 border-slate-800 hover:scale-105 transition-transform">
                  <PhoneOff className="w-6 h-6 text-white" />
                </div>
              </button>

              <button className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white transition-colors">
                 <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-[10px]">Stats</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallWidget;