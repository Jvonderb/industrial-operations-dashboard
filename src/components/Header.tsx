import React from 'react';
import { ActiveTab, MetricSummary } from '../types';
import { 
  Building2, 
  Layers, 
  Cpu, 
  SearchCode, 
  TrendingUp, 
  Calendar,
  Download,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  metrics: MetricSummary;
  onExportCsv: () => void;
  filteredCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  metrics,
  onExportCsv,
}) => {
  const tabs = [
    {
      id: 'executive' as ActiveTab,
      label: 'Informe Ejecutivo (McKinsey)',
      icon: Building2,
      badge: 'C-Suite',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'segments' as ActiveTab,
      label: 'Segmentos de Operación',
      icon: Layers,
      badge: '5 Operaciones',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      id: 'sectors' as ActiveTab,
      label: 'Sectores de Maquinaria',
      icon: Cpu,
      badge: 'M01 - M05',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    {
      id: 'drilldown' as ActiveTab,
      label: 'Explorador Drill-Down',
      icon: SearchCode,
      badge: `${metrics.totalJobs} Órdenes`,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800/80 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with McKinsey styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xs border border-blue-400/20 shrink-0">
            <TrendingUp className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">
                McKinsey Operations Practice
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                20-25 Mar 2023
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white flex items-center gap-2">
              Dashboard de Excelencia Operativa & Diagnóstico Industrial
            </h1>
          </div>
        </div>

        {/* Global Quick KPI Strip */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center space-x-2 shadow-2xs">
            <span className="text-slate-400 text-[11px]">OEE Estimado:</span>
            <span className="font-semibold text-amber-400 tabular-nums">{metrics.overallOEE}%</span>
          </div>

          <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center space-x-2 shadow-2xs">
            <span className="text-slate-400 text-[11px]">Adherencia OTIF:</span>
            <span className="font-semibold text-emerald-400 tabular-nums">{metrics.onTimeRate}%</span>
          </div>

          <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/70 border border-rose-900/40 flex items-center space-x-2 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-slate-400 text-[11px]">No Iniciadas:</span>
            <span className="font-semibold text-rose-400 tabular-nums">{metrics.unstartedJobs}</span>
          </div>

          <button
            onClick={onExportCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-medium transition-all shadow-xs text-xs cursor-pointer"
            title="Exportar base completa a CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
        <nav className="flex space-x-1.5 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-1.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-white shadow-2xs border border-white/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono tabular-nums ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
