import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BrowserView from './components/BrowserView';
import InspectorPanel from './components/InspectorPanel';
import CallWidget from './components/CallWidget';
import { IPConfig } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [selectedConfig, setSelectedConfig] = useState<IPConfig | null>(null);
  const [url, setUrl] = useState<string>('https://whatismyip.com');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleConfigSelect = (config: IPConfig) => {
    setIsLoading(true);
    setSelectedConfig(config);
    // Simulate network switch delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden text-slate-200 font-sans">
      {/* Mobile Toggle (Visible on small screens) */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="bg-slate-800 p-2 rounded text-slate-200 border border-slate-700"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden'} lg:block h-full shrink-0 transition-all duration-300`}>
        <Sidebar 
          selectedConfig={selectedConfig} 
          onSelectConfig={handleConfigSelect} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex overflow-hidden">
          {/* Browser View */}
          <main className="flex-1 h-full relative z-0">
            <BrowserView 
              url={url} 
              setUrl={setUrl} 
              config={selectedConfig}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
            {/* Call Widget Overlay */}
            <CallWidget config={selectedConfig} />
          </main>
          
          {/* Right Panel (Inspector) */}
          <aside className="hidden xl:block h-full shrink-0">
            <InspectorPanel config={selectedConfig} url={url} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;