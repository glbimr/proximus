import React, { useState } from 'react';
import { Activity, Code, Server, Bot, ChevronRight, BarChart2, ShieldCheck, Wifi, Fingerprint, CheckCircle, XCircle, Globe, RefreshCw } from 'lucide-react';
import { IPConfig, HeaderEntry } from '../types';
import { analyzeNetworkContext } from '../services/geminiService';
import { DEFAULT_HEADERS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InspectorPanelProps {
  config: IPConfig | null;
  url: string;
}

const InspectorPanel: React.FC<InspectorPanelProps> = ({ config, url }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'headers' | 'ai' | 'identity'>('overview');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Identity Check State
  const [checkStatus, setCheckStatus] = useState<'idle' | 'running' | 'done'>('idle');

  // Mock data for the chart
  const data = [
    { time: '0s', latency: config ? config.latency : 0 },
    { time: '1s', latency: config ? config.latency + 5 : 0 },
    { time: '2s', latency: config ? config.latency - 2 : 0 },
    { time: '3s', latency: config ? config.latency + 12 : 0 },
    { time: '4s', latency: config ? config.latency + 4 : 0 },
    { time: '5s', latency: config ? config.latency : 0 },
  ];

  const handleAiAnalyze = async () => {
    if (!config) return;
    setIsAnalyzing(true);
    const result = await analyzeNetworkContext(url, config);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const runIdentityCheck = () => {
    setCheckStatus('running');
    setTimeout(() => {
      setCheckStatus('done');
    }, 2000);
  };

  if (!config) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-700 p-6 flex flex-col items-center justify-center text-center">
        <Server className="h-12 w-12 text-slate-700 mb-4" />
        <h3 className="text-slate-300 font-medium">No ISP Selected</h3>
        <p className="text-sm text-slate-500 mt-2">Select an ISP from the sidebar to begin network simulation.</p>
      </div>
    );
  }

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-slate-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('identity')}
          className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
            activeTab === 'identity' ? 'border-green-500 text-green-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Fingerprint className="h-3 w-3" />
          Identity
        </button>
        <button
          onClick={() => setActiveTab('headers')}
          className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'headers' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Headers
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1 whitespace-nowrap ${
            activeTab === 'ai' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="h-3 w-3" />
          AI Analysis
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Wifi className="h-4 w-4" /> Network Status
              </h3>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Latency</div>
                    <div className="text-xl font-mono text-green-400">{config.latency}ms</div>
                 </div>
                 <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Jitter</div>
                    <div className="text-xl font-mono text-blue-400">~2ms</div>
                 </div>
              </div>
              
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                <div className="flex justify-between text-xs border-b border-slate-700 pb-2">
                   <span className="text-slate-400">Provider</span>
                   <span className="text-slate-200">{config.provider}</span>
                </div>
                <div className="flex justify-between text-xs border-b border-slate-700 pb-2">
                   <span className="text-slate-400">Location</span>
                   <span className="text-slate-200">{config.location}</span>
                </div>
                <div className="flex justify-between text-xs pb-1">
                   <span className="text-slate-400">Protocol</span>
                   <span className="text-slate-200">IPv4 / HTTP/2</span>
                </div>
              </div>
            </div>

            <div className="h-48 w-full">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Latency Monitor
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#4ade80' }}
                  />
                  <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded text-xs text-blue-300 flex gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              This session is sandboxed. Cookies and local storage are isolated to this virtual IP context.
            </div>
          </div>
        )}

        {activeTab === 'identity' && (
           <div className="space-y-6">
             <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
               <Fingerprint className="h-10 w-10 text-slate-500 mx-auto mb-2" />
               <h3 className="text-slate-200 font-medium">Context Verification</h3>
               <p className="text-xs text-slate-400 mb-4">
                 Validate that the simulated IP is correctly broadcast to external services.
               </p>
               <button 
                onClick={runIdentityCheck}
                disabled={checkStatus === 'running'}
                className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-full flex items-center gap-2 mx-auto disabled:opacity-50"
               >
                 {checkStatus === 'running' ? (
                   <RefreshCw className="h-3 w-3 animate-spin" />
                 ) : (
                   <ShieldCheck className="h-3 w-3" />
                 )}
                 {checkStatus === 'running' ? 'Verifying...' : 'Run Identity Check'}
               </button>
             </div>

             {checkStatus === 'done' && (
               <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detection Results</h4>
                 
                 <div className="bg-slate-950 rounded border border-slate-800 divide-y divide-slate-800">
                   <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Public IP</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-green-400">{config.ip}</span>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      </div>
                   </div>
                   <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-slate-400">ISP</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-200">{config.provider}</span>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      </div>
                   </div>
                   <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Geo-Location</span>
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-slate-200">{config.location}</span>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      </div>
                   </div>
                   <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Blacklist Status</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400">Clean</span>
                        <ShieldCheck className="h-3 w-3 text-green-500" />
                      </div>
                   </div>
                   <div className="p-3 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Proxy/VPN Detected</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-200">No</span>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      </div>
                   </div>
                 </div>

                 <div className="bg-green-900/20 border border-green-500/20 p-3 rounded text-xs text-green-300">
                    Validation Successful. The current session is correctly masquerading as a {config.type} user from {config.location}.
                 </div>
               </div>
             )}
           </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-4">
             <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Code className="h-4 w-4" /> Request Headers
              </h3>
              <div className="bg-slate-950 rounded border border-slate-800 p-3 font-mono text-xs overflow-x-auto">
                {DEFAULT_HEADERS.map((header, idx) => (
                  <div key={idx} className="mb-2 last:mb-0">
                    <span className="text-purple-400">{header.key}:</span>{' '}
                    <span className="text-slate-300 break-all">{header.value}</span>
                  </div>
                ))}
                 <div className="mt-2 pt-2 border-t border-slate-800">
                    <span className="text-purple-400">X-Forwarded-For:</span>{' '}
                    <span className="text-green-400">{config.ip}</span>
                  </div>
              </div>
              <p className="text-xs text-slate-500">
                These headers are injected into the request to simulate the browser environment of the selected ISP.
              </p>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-full">
            {!aiAnalysis ? (
              <div className="text-center py-10">
                <Bot className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-slate-300 font-medium mb-2">Gemini Network Diagnostics</h3>
                <p className="text-xs text-slate-500 mb-6 px-4">
                  Analyze routing hops, potential ISP-level blocking, and latency bottlenecks for <span className="text-blue-400">{url}</span> via {config.provider}.
                </p>
                <button
                  onClick={handleAiAnalyze}
                  disabled={isAnalyzing}
                  className={`bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 mx-auto ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>Run Diagnostics</>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-2">
                   <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                      <Bot className="h-4 w-4" /> Analysis Report
                   </h3>
                   <button onClick={() => setAiAnalysis('')} className="text-xs text-slate-500 hover:text-white underline">Clear</button>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap font-mono border border-slate-700/50 shadow-inner">
                  {aiAnalysis}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectorPanel;