import React from 'react';
import { 
  Lightbulb, 
  Edit3, 
  Compass, 
  Bookmark, 
  History, 
  Settings,
  Sparkles,
  LayoutGrid
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onGoToDashboard: () => void;
  currentProofId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onGoToDashboard,
  currentProofId,
}) => {
  const navItems = [
    { id: 'explore', label: 'Explore', icon: Sparkles },
    { id: 'proofs', label: 'Proofs', icon: Lightbulb },
    { id: 'practice', label: 'Practice', icon: Edit3 },
    { id: 'tools', label: 'Tools', icon: Compass },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <aside className="w-24 md:w-28 shrink-0 bg-white border-r border-indigo-50/80 flex flex-col items-center justify-between py-6 select-none shadow-[2px_0_12px_-4px_rgba(99,102,241,0.05)] z-20 min-h-screen">
      {/* Brand / Logo */}
      <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onGoToDashboard}>
        <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-50/80 group-hover:bg-indigo-100 transition-colors shadow-sm">
          {/* Custom Maths Universe Icon */}
          <svg className="w-8 h-8 text-indigo-600 transition-transform group-hover:scale-110" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.75" strokeDasharray="3 2" className="opacity-40" />
            <path d="M20 4L22.5 16L34.5 18.5L24 22L27 34L19 25L10 32L14.5 21L4.5 18.5L16.5 16L20 4Z" fill="currentColor" className="text-indigo-600" opacity="0.9" />
            <circle cx="20" cy="20" r="2.5" fill="white" />
          </svg>
        </div>
        <div className="text-center mt-1">
          <div className="text-[11px] font-extrabold tracking-wider text-slate-800 uppercase leading-none font-sans">MATHS</div>
          <div className="text-[9px] font-bold tracking-widest text-indigo-500 uppercase leading-tight font-sans">UNIVERSE</div>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className="flex flex-col items-center gap-4 my-auto py-4">
        {/* Dashboard Shortcut */}
        <button
          onClick={onGoToDashboard}
          title="Formula Dashboard"
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${
            !currentProofId
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105'
              : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/60'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-semibold tracking-tight">Catalog</span>
        </button>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && Boolean(currentProofId);
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 shadow-sm font-bold scale-105'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-indigo-600 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings at Bottom */}
      <div className="flex flex-col items-center">
        <button 
          onClick={() => onSelectTab('settings')}
          className="flex flex-col items-center justify-center w-16 h-14 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-colors"
        >
          <Settings className="w-5 h-5 mb-1 stroke-[1.8]" />
          <span className="text-[11px] font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};
