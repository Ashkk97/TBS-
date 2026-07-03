import { useState, useMemo, useEffect } from 'react';
import { AppState } from './data';
import PortalView from './components/PortalView';
import DashboardView from './components/DashboardView';

export default function App() {
  const state = useMemo(() => new AppState(), []);
  const [view, setView] = useState<'portal' | 'dashboard'>('portal');
  const [reloadKey, setReloadKey] = useState(0);
  const [isServerSyncing, setIsServerSyncing] = useState(true);

  const triggerReload = () => {
    setReloadKey(prev => prev + 1);
  };

  useEffect(() => {
    state.init(() => {
      setIsServerSyncing(false);
      triggerReload();
    });
  }, [state]);

  return (
    <div key={reloadKey} className="min-h-screen bg-slate-950 relative">
      {isServerSyncing && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/10 border border-teal-500/20 text-[10px] text-teal-400 font-mono rounded-md z-50 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
          Syncing Server DB...
        </div>
      )}
      
      {view === 'portal' ? (
        <PortalView 
          state={state} 
          onStateUpdate={triggerReload} 
          onGoToAdmin={() => setView('dashboard')} 
        />
      ) : (
        <DashboardView 
          state={state} 
          onStateUpdate={triggerReload} 
          onGoToPortal={() => setView('portal')} 
        />
      )}
    </div>
  );
}
