import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Map,
  Wind,
  Bookmark,
  Settings
} from 'lucide-react';
import { AppView } from '../types/weather';

interface SidebarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  savedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  savedCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: '7-Day Forecast', icon: CalendarDays },
    { id: 'map', label: 'Weather Map', icon: Map },
    { id: 'airquality', label: 'Air Quality', icon: Wind },
    { id: 'saved', label: 'Saved Locations', icon: Bookmark, badge: savedCount },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white/60 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800/60 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto transition-colors z-30">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id as AppView)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/20 font-semibold'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
