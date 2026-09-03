import React, { useState, useMemo } from 'react';
import { 
  ALL_JOBS, 
  computeMetricSummary, 
  getMachineSummaries, 
  getOperationSummaries, 
  getExecutiveInsights 
} from './data/dataset';
import { ActiveTab, DrillDownIndicator } from './types';
import { Header } from './components/Header';
import { ExecutiveReport } from './components/ExecutiveReport';
import { SegmentsView } from './components/SegmentsView';
import { SectorsView } from './components/SectorsView';
import { DrillDownView } from './components/DrillDownView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('executive');
  
  // Drill-down navigation state
  const [drillDownIndicator, setDrillDownIndicator] = useState<DrillDownIndicator>('all');
  const [drillDownMachine, setDrillDownMachine] = useState<string>('');
  const [drillDownOperation, setDrillDownOperation] = useState<string>('');

  // Primary calculated datasets
  const overallMetrics = useMemo(() => computeMetricSummary(ALL_JOBS), []);
  const machineSummaries = useMemo(() => getMachineSummaries(ALL_JOBS), []);
  const operationSummaries = useMemo(() => getOperationSummaries(ALL_JOBS), []);
  const executiveInsights = useMemo(
    () => getExecutiveInsights(overallMetrics, machineSummaries, operationSummaries),
    [overallMetrics, machineSummaries, operationSummaries]
  );

  // Cross-view drill down handler
  const handleNavigateDrillDown = (
    indicator: DrillDownIndicator = 'all', 
    machine?: string, 
    operation?: string
  ) => {
    setDrillDownIndicator(indicator);
    setDrillDownMachine(machine || '');
    setDrillDownOperation(operation || '');
    setActiveTab('drilldown');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Full CSV Export Handler
  const handleExportFullCsv = () => {
    const headers = [
      'Job ID',
      'Machine ID',
      'Operation Type',
      'Material Used (kg)',
      'Processing Time (min)',
      'Energy Consumption (kWh)',
      'Machine Availability (%)',
      'Scheduled Start',
      'Scheduled End',
      'Actual Start',
      'Status',
      'Start Delay (min)',
      'Energy per Kg (kWh/kg)',
    ];

    const rows = ALL_JOBS.map(j => [
      j.jobId,
      j.machineId,
      j.operationType,
      j.materialUsed,
      j.processingTime,
      j.energyConsumption,
      j.machineAvailability,
      j.scheduledStart,
      j.scheduledEnd,
      j.actualStart || 'NO_INICIADO',
      j.status,
      j.startDelayMinutes ?? '',
      j.energyPerKg,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `manufactura_1000_ordenes_consolidado.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-500/15 selection:text-blue-900">
      {/* Global Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={overallMetrics}
        onExportCsv={handleExportFullCsv}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'executive' && (
          <ExecutiveReport
            metrics={overallMetrics}
            machines={machineSummaries}
            operations={operationSummaries}
            insights={executiveInsights}
            onNavigateDrillDown={handleNavigateDrillDown}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'segments' && (
          <SegmentsView
            operations={operationSummaries}
            onNavigateDrillDown={handleNavigateDrillDown}
          />
        )}

        {activeTab === 'sectors' && (
          <SectorsView
            machines={machineSummaries}
            onNavigateDrillDown={handleNavigateDrillDown}
          />
        )}

        {activeTab === 'drilldown' && (
          <DrillDownView
            jobs={ALL_JOBS}
            initialIndicator={drillDownIndicator}
            initialMachine={drillDownMachine}
            initialOperation={drillDownOperation}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xs border-t border-slate-200/80 mt-auto py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Apex Manufacturing Operations</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Auditoría de Planta & Diagnóstico McKinsey</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/60">1,000 Órdenes</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/60">5 Maquinarias</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/60">5 Segmentos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
