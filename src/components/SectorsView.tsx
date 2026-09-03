import React, { useState } from 'react';
import { 
  MachineSectorSummary, 
  MachineId, 
  DrillDownIndicator 
} from '../types';
import { MACHINE_METADATA } from '../data/dataset';
import { 
  Cpu, 
  User, 
  Clock, 
  Zap, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight, 
  Award, 
  BarChart2, 
  Sliders,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

interface SectorsViewProps {
  machines: MachineSectorSummary[];
  onNavigateDrillDown: (indicator: DrillDownIndicator, machine?: string, operation?: string) => void;
}

export const SectorsView: React.FC<SectorsViewProps> = ({
  machines,
  onNavigateDrillDown,
}) => {
  const [selectedMachineId, setSelectedMachineId] = useState<MachineId>('M01');

  const activeMachine = machines.find(m => m.machineId === selectedMachineId) || machines[0];
  const activeMeta = MACHINE_METADATA[activeMachine.machineId];

  // Comparative data for chart
  const machineChartData = machines.map(m => ({
    machineId: m.machineId,
    name: m.machineId,
    onTimeRate: m.metrics.onTimeRate,
    unstartedRate: m.metrics.unstartedRate,
    delayedRate: m.metrics.delayedRate,
    avgDelayMinutes: m.metrics.avgDelayMinutes,
    avgEnergy: m.metrics.avgEnergyKWh,
    totalEnergy: m.metrics.totalEnergyKWh,
    availability: m.metrics.avgAvailability,
    oee: m.metrics.overallOEE,
    totalJobs: m.metrics.totalJobs,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-[11px] font-semibold tracking-wider uppercase mb-2">
              <Cpu className="w-3.5 h-3.5" />
              Vista por Sectores de Maquinaria
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Rendimiento Operativo por Máquina (M01 - M05)
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Evaluación de capacidad, disponibilidad mecánica, tasa de atrición y tiempos muertos por puesto de trabajo.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 shrink-0 font-mono">
            <span>Parque activo: <strong className="text-slate-800">5 Células de Manufactura</strong></span>
          </div>
        </div>

        {/* Machine selection cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
          {machines.map(m => {
            const isSelected = m.machineId === selectedMachineId;
            const meta = MACHINE_METADATA[m.machineId];

            return (
              <div
                key={m.machineId}
                onClick={() => setSelectedMachineId(m.machineId)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50/60 text-slate-800 border-slate-200/80 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md border ${
                    isSelected ? 'bg-slate-800 text-blue-300 border-slate-700' : 'bg-white text-slate-800 border-slate-200'
                  }`}>
                    {m.machineId}
                  </span>
                  <span className={`text-[10px] font-semibold tabular-nums ${
                    isSelected ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    OEE {m.metrics.overallOEE}%
                  </span>
                </div>
                <h3 className={`text-sm font-semibold truncate mt-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {meta.name.split('(')[0]}
                </h3>
                <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                  {meta.supervisor}
                </p>
                <div className={`mt-3 pt-2 border-t text-[11px] flex items-center justify-between tabular-nums ${
                  isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-200/60 text-slate-500'
                }`}>
                  <span>{m.metrics.totalJobs} órdenes</span>
                  <span className={m.metrics.unstartedRate > 15 ? (isSelected ? 'text-rose-400 font-medium' : 'text-rose-600 font-medium') : ''}>
                    {m.metrics.unstartedJobs} no-iniciadas
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Machine Deep-Dive details */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-mono text-xs font-semibold">
                {activeMachine.machineId}
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                {activeMeta.name}
              </h3>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {activeMeta.description}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Supervisor a cargo: <strong className="text-slate-700">{activeMeta.supervisor}</strong></span>
            </div>
          </div>

          <button
            onClick={() => onNavigateDrillDown('all', activeMachine.machineId)}
            className="self-start lg:self-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-medium flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <span>Ver las {activeMachine.metrics.totalJobs} órdenes de {activeMachine.machineId}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Machine Detailed Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5 tracking-wider">Órdenes Asignadas</span>
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{activeMachine.metrics.totalJobs}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">En 5 días</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
            <span className="text-[10px] text-emerald-800 uppercase font-semibold block mb-0.5 tracking-wider">Adherencia a Tiempo</span>
            <span className="text-xl font-bold text-emerald-900 font-mono tabular-nums">{activeMachine.metrics.onTimeRate}%</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">{activeMachine.metrics.onTimeJobs} a tiempo</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
            <span className="text-[10px] text-amber-800 uppercase font-semibold block mb-0.5 tracking-wider">Retraso de Arranque</span>
            <span className="text-xl font-bold text-amber-950 font-mono tabular-nums">+{activeMachine.metrics.avgDelayMinutes} <span className="text-xs font-normal">min</span></span>
            <span className="text-[10px] text-amber-700 block mt-0.5">{activeMachine.metrics.delayedJobs} demoradas</span>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/70">
            <span className="text-[10px] text-rose-800 uppercase font-semibold block mb-0.5 tracking-wider">Órdenes Caídas</span>
            <span className="text-xl font-bold text-rose-900 font-mono tabular-nums">{activeMachine.metrics.unstartedJobs}</span>
            <span className="text-[10px] text-rose-700 block mt-0.5">{activeMachine.metrics.unstartedRate}% sin iniciar</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5 tracking-wider">Disponibilidad Media</span>
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{activeMachine.metrics.avgAvailability}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Índice mecánico</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5 tracking-wider">OEE Compuesto</span>
            <span className="text-xl font-bold text-blue-700 font-mono tabular-nums">{activeMachine.metrics.overallOEE}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Meta 85.0%</span>
          </div>
        </div>

        {/* Machine Benchmarking Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: OEE & Availability by Machine */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold tracking-tight text-slate-900">
                OEE y Disponibilidad Comparada (M01 - M05)
              </h4>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200/60">% Rendimiento</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Comparativa entre la disponibilidad teórica de máquina y el OEE resultante ponderado por pérdidas.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={machineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
                  <YAxis unit="%" domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    formatter={(val: number) => [`${val}%`]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="availability" name="Disponibilidad (%)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="oee" name="OEE Estimado (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Delay and Unstarted Volume per Machine */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold tracking-tight text-slate-900">
                Retraso Medio (min) y Fuga de Órdenes No Iniciadas
              </h4>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200/60">Minutos vs Tasa</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Identificación visual de las células con mayor fricción en el cumplimiento del programa de producción.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={machineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="avgDelayMinutes" name="Retraso Medio (min)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="unstartedRate" name="Tasa No Iniciada (%)" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
