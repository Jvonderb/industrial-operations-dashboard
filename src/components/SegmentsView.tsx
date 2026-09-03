import React, { useState } from 'react';
import { 
  OperationSegmentSummary, 
  OperationType, 
  DrillDownIndicator 
} from '../types';
import { 
  Layers, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

interface SegmentsViewProps {
  operations: OperationSegmentSummary[];
  onNavigateDrillDown: (indicator: DrillDownIndicator, machine?: string, operation?: string) => void;
}

export const SegmentsView: React.FC<SegmentsViewProps> = ({
  operations,
  onNavigateDrillDown,
}) => {
  const [selectedOp, setSelectedOp] = useState<OperationType>('Milling');

  const activeSegment = operations.find(o => o.operationType === selectedOp) || operations[0];

  // Data for comparative bar chart (Energy vs Duration)
  const comparisonData = operations.map(o => ({
    operation: o.operationType,
    displayName: o.displayName.split(' ')[0],
    avgEnergy: o.metrics.avgEnergyKWh,
    avgTime: o.metrics.avgProcessingTimeMin,
    onTimeRate: o.metrics.onTimeRate,
    unstartedRate: o.metrics.unstartedRate,
    delayedRate: o.metrics.delayedRate,
    totalJobs: o.metrics.totalJobs,
  }));

  // Data for radar chart of segment profiles
  const radarData = [
    {
      subject: 'Puntualidad (%)',
      Milling: operations.find(o => o.operationType === 'Milling')?.metrics.onTimeRate || 0,
      Lathe: operations.find(o => o.operationType === 'Lathe')?.metrics.onTimeRate || 0,
      Drilling: operations.find(o => o.operationType === 'Drilling')?.metrics.onTimeRate || 0,
      Grinding: operations.find(o => o.operationType === 'Grinding')?.metrics.onTimeRate || 0,
      Additive: operations.find(o => o.operationType === 'Additive')?.metrics.onTimeRate || 0,
    },
    {
      subject: 'Disponibilidad (%)',
      Milling: operations.find(o => o.operationType === 'Milling')?.metrics.avgAvailability || 0,
      Lathe: operations.find(o => o.operationType === 'Lathe')?.metrics.avgAvailability || 0,
      Drilling: operations.find(o => o.operationType === 'Drilling')?.metrics.avgAvailability || 0,
      Grinding: operations.find(o => o.operationType === 'Grinding')?.metrics.avgAvailability || 0,
      Additive: operations.find(o => o.operationType === 'Additive')?.metrics.avgAvailability || 0,
    },
    {
      subject: 'Eficiencia Energética',
      Milling: 75,
      Lathe: 82,
      Drilling: 88,
      Grinding: 80,
      Additive: 70,
    },
    {
      subject: 'Rendimiento OEE',
      Milling: operations.find(o => o.operationType === 'Milling')?.metrics.overallOEE || 0,
      Lathe: operations.find(o => o.operationType === 'Lathe')?.metrics.overallOEE || 0,
      Drilling: operations.find(o => o.operationType === 'Drilling')?.metrics.overallOEE || 0,
      Grinding: operations.find(o => o.operationType === 'Grinding')?.metrics.overallOEE || 0,
      Additive: operations.find(o => o.operationType === 'Additive')?.metrics.overallOEE || 0,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-[11px] font-semibold tracking-wider uppercase mb-2">
              <Layers className="w-3.5 h-3.5" />
              Vista por Segmentos Operativos
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Análisis Comparativo por Tipo de Operación
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Desglose detallado de las 5 tecnologías de manufactura: Fresado, Torneado, Taladrado, Rectificado y Manufactura Aditiva.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 shrink-0 font-mono">
            <span>Distribución de la carga: <strong className="text-slate-800">200 órdenes prom</strong> / segmento</span>
          </div>
        </div>

        {/* Segment selector cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
          {operations.map(op => {
            const isSelected = op.operationType === selectedOp;
            return (
              <div
                key={op.operationType}
                onClick={() => setSelectedOp(op.operationType)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50/60 text-slate-800 border-slate-200/80 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-mono text-[10px] tabular-nums ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    {op.metrics.totalJobs} Órdenes
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tabular-nums border ${
                    isSelected ? 'bg-slate-800 text-emerald-300 border-slate-700' : 'bg-emerald-50 text-emerald-800 border-emerald-200/70'
                  }`}>
                    {op.metrics.onTimeRate}% OTIF
                  </span>
                </div>
                <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {op.displayName.split(' ')[0]}
                </h3>
                <div className={`mt-2 pt-2 border-t text-[11px] flex items-center justify-between tabular-nums ${
                  isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-200/60 text-slate-500'
                }`}>
                  <span>{op.metrics.avgEnergyKWh} kWh/ord</span>
                  <span>{op.metrics.avgProcessingTimeMin} min</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Dive Panel on Active Segment */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono text-xs font-semibold">
                {activeSegment.operationType}
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                {activeSegment.displayName}
              </h3>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              {activeSegment.description}
            </p>
          </div>

          <button
            onClick={() => onNavigateDrillDown('all', undefined, activeSegment.operationType)}
            className="self-start lg:self-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-medium flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <span>Ver las {activeSegment.metrics.totalJobs} órdenes de {activeSegment.operationType}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Detailed KPI row for active segment */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5 tracking-wider">Órdenes Totales</span>
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{activeSegment.metrics.totalJobs}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">100% programadas</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
            <span className="text-[10px] text-emerald-800 uppercase font-semibold block mb-0.5 tracking-wider">A Tiempo (OTIF)</span>
            <span className="text-xl font-bold text-emerald-900 font-mono tabular-nums">{activeSegment.metrics.onTimeRate}%</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">{activeSegment.metrics.onTimeJobs} órdenes</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
            <span className="text-[10px] text-amber-800 uppercase font-semibold block mb-0.5 tracking-wider">Con Retraso</span>
            <span className="text-xl font-bold text-amber-950 font-mono tabular-nums">{activeSegment.metrics.delayedJobs}</span>
            <span className="text-[10px] text-amber-700 block mt-0.5">Promedio +{activeSegment.metrics.avgDelayMinutes}m</span>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/70">
            <span className="text-[10px] text-rose-800 uppercase font-semibold block mb-0.5 tracking-wider">No Iniciadas</span>
            <span className="text-xl font-bold text-rose-900 font-mono tabular-nums">{activeSegment.metrics.unstartedJobs}</span>
            <span className="text-[10px] text-rose-700 block mt-0.5">{activeSegment.metrics.unstartedRate}% descarte</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5 tracking-wider">Consumo Promedio</span>
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{activeSegment.metrics.avgEnergyKWh} <span className="text-xs text-slate-400 font-normal">kWh</span></span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{activeSegment.metrics.totalEnergyKWh} kWh tot</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5 tracking-wider">Tiempo de Ciclo</span>
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{activeSegment.metrics.avgProcessingTimeMin} <span className="text-xs text-slate-400 font-normal">min</span></span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{activeSegment.metrics.totalProcessingHours}h acumuladas</span>
          </div>
        </div>

        {/* Comparative Charts for Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart: Average Energy vs Cycle Time */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold tracking-tight text-slate-900">
                Consumo Energético vs Duración Media por Segmento
              </h4>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200/60">kWh vs Minutos</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Comparativa del consumo eléctrico medio (barras azules) frente al tiempo medio de proceso (barras naranjas).
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="displayName" tick={{ fontSize: 11, fill: '#334155' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="avgEnergy" name="Energía Media (kWh)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avgTime" name="Duración Media (min)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Adherence Rates Bar Chart */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold tracking-tight text-slate-900">
                Comportamiento de Adherencia por Segmento
              </h4>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200/60">% del Total</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Tasa a tiempo (% verde), retrasada (% ámbar) y no iniciada (% roja) según tecnología de mecanizado.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="displayName" tick={{ fontSize: 11, fill: '#334155' }} />
                  <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip 
                    formatter={(val: number) => [`${val}%`]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="onTimeRate" name="A Tiempo %" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="delayedRate" name="Con Retraso %" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="unstartedRate" name="No Iniciado %" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
