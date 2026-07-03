import { useState, useMemo } from 'react';
import { AppState } from './data';
import PortalView from './components/PortalView';
import DashboardView from './components/DashboardView';

export default function App() {
  const state = useMemo(() => new AppState(), []);
  const [view, setView] = useState<'portal' | 'dashboard'>('portal');
  const [reloadKey, setReloadKey] = useState(0);

  const triggerReload = () => {
    setReloadKey(prev => prev + 1);
  };

  return (
    <div key={reloadKey} className="min-h-screen bg-slate-950">
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
