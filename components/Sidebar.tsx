import React, { useState } from 'react';
import { Wifi, Globe, MapPin, Search, Activity } from 'lucide-react';
import { IPConfig, IspProvider } from '../types';
import { MOCK_IPS } from '../constants';

interface SidebarProps {
  selectedConfig: IPConfig | null;
  onSelectConfig: (config: IPConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedConfig, onSelectConfig }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState<string>('All');

  const filteredIps = MOCK_IPS.filter(item => {
    const matchesSearch = item.provider.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterProvider === 'All' || item.provider === filterProvider;
    return matchesSearch && matchesFilter;
  });

  const providers = ['All', ...Array.from(new Set(MOCK_IPS.map(ip => ip.provider)))];

  return (
    <div className="w-80 h-full bg-slate-900 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Globe className="text-blue-500" />
          GeoNet Sim
        </h2>
        <p className="text-xs text-slate-400 mt-1">ISP & Network Simulator</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ISP or City..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {providers.map(p => (
            <button
              key={p}
              onClick={() => setFilterProvider(p)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                filterProvider === p 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-1">
          {filteredIps.map((ip) => (
            <button
              key={ip.id}
              onClick={() => onSelectConfig(ip)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedConfig?.id === ip.id
                  ? 'bg-blue-900/20 border-blue-500/50'
                  : 'bg-transparent border-transparent hover:bg-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium ${selectedConfig?.id === ip.id ? 'text-blue-400' : 'text-slate-200'}`}>
                  {ip.provider}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  ip.type.includes('5G') || ip.type === 'Fiber' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                }`}>
                  {ip.type}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <MapPin className="h-3 w-3" />
                {ip.location}
              </div>

              <div className="flex justify-between items-center mt-2">
                 <code className="text-xs bg-slate-950 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                  {ip.ip}
                </code>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Activity className="h-3 w-3" />
                  {ip.latency}ms
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="text-xs text-slate-500 text-center">
          Mock Environment Active <br/>
          <span className="opacity-50">v2.4.0-stable</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
