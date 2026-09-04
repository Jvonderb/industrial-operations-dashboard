import React, { useState } from 'react';
import { 
  MetricSummary, 
  MachineSectorSummary, 
  OperationSegmentSummary, 
  McKinseyInsight,
  ActiveTab,
  DrillDownIndicator
} from '../types';
import { 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ArrowUpRight, 
  ChevronRight, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Sparkles,
  Award,
  BarChart3,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell
} from 'recharts';

interface ExecutiveReportProps {
  metrics: MetricSummary;
  machines: MachineSectorSummary[];
  operations: OperationSegmentSummary[];
  insights: McKinseyInsight[];
  onNavigateDrillDown: (indicator: DrillDownIndicator, machine?: string, operation?: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({
  metrics,
  machines,
  operations,
  insights,
  onNavigateDrillDown,
  setActiveTab,
}) => {
  const [selectedInsightId, setSelectedInsightId] = useState<string>(insights[0]?.id || '');
  const activeInsight = insights.find(i => i.id === selectedInsightId) || insights[0];

  // Data for Waterfall / Loss decomposition
  const totalPlannedHours = metrics.totalProcessingHours;
  const unstartedLossHours = Number(((metrics.unstartedJobs * metrics.avgProcessingTimeMin) / 60).toFixed(1));
  const delayLossHours = Number(((metrics.delayedJobs * metrics.avgDelayMinutes) / 60).toFixed(1));
  const effectiveProductiveHours = Math.max(0, Number((totalPlannedHours - unstartedLossHours).toFixed(1)));

  const lossBreakdownData = [
    { name: 'Horas Totales Programadas', hours: totalPlannedHours, fill: '#3b82f6' },
    { name: 'Pérdida por Órdenes No Iniciadas', hours: unstartedLossHours, fill: '#ef4444' },
    { name: 'Tiempo Perdido en Retrasos', hours: delayLossHours, fill: '#f59e0b' },
    { name: 'Horas Productivas Efectivas', hours: effectiveProductiveHours, fill: '#10b981' },
  ];

  // Machine adherence comparison data
  const machineAdherenceData = machines.map(m => ({
    machineId: m.machineId,
    name: m.machineId,
    onTimeRate: m.metrics.onTimeRate,
    delayedRate: m.metrics.delayedRate,
    unstartedRate: m.metrics.unstartedRate,
    avgDelay: m.metrics.avgDelayMinutes,
  }));

  // Operations energy comparison data
  const opEnergyData = operations.map(o => ({
    name: o.operationType,
    label: o.displayName.split(' ')[0],
    avgEnergy: o.metrics.avgEnergyKWh,
    totalEnergy: o.metrics.totalEnergyKWh,
    avgTime: o.metrics.avgProcessingTimeMin,
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* C-Suite Memo Header Banner */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-semibold text-slate-700 tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Documento Ejecutivo Confidencial • Modelo C-Suite 7S & Kaizen
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Diagnóstico Estratégico de Manufactura & Plan de Recuperación
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Análisis sobre 1,000 ciclos fabriles registrados entre el 20 y 25 de marzo de 2023. Identificación de fricciones operativas, cuellos de botella en arranque, dispersión de consumo y cuantificación del impacto financiero potencial.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Potencial de Captura Total</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono tabular-nums">+$244,500 USD</span>
              <span className="text-[10px] text-slate-400 block">Ahorro anualizado estimado</span>
            </div>
            <button
              onClick={() => onNavigateDrillDown('unstarted')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Ir al Detalle Operativo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Executive Scorecard: 5 Key Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Pillar 1: OEE */}
          <div 
            onClick={() => onNavigateDrillDown('all')}
            className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 hover:border-blue-400/60 hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">Rendimiento OEE</span>
              <Award className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">{metrics.overallOEE}%</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-blue-600 font-medium">Meta: 85.0%</span>
              <span className="text-slate-400">• Brecha 14.5%</span>
            </div>
          </div>

          {/* Pillar 2: Unstarted / Attrition */}
          <div 
            onClick={() => onNavigateDrillDown('unstarted')}
            className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/70 hover:border-rose-400 hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-rose-700 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-rose-700">No Iniciadas</span>
              <AlertOctagon className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-rose-900 font-mono tabular-nums">{metrics.unstartedJobs}</div>
            <div className="text-[11px] text-rose-700 mt-1 flex items-center justify-between font-medium">
              <span>{metrics.unstartedRate}% del total</span>
              <span className="text-[10px] underline flex items-center">Drill-down &rarr;</span>
            </div>
          </div>

          {/* Pillar 3: Delayed Start */}
          <div 
            onClick={() => onNavigateDrillDown('delayed')}
            className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 hover:border-amber-400 hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-amber-800 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-800">Arranque Tardío</span>
              <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-amber-950 font-mono tabular-nums">{metrics.delayedJobs}</div>
            <div className="text-[11px] text-amber-800 mt-1 flex items-center justify-between">
              <span>Retraso medio: <strong>+{metrics.avgDelayMinutes}m</strong></span>
              <span className="text-[10px] underline flex items-center">Explorar &rarr;</span>
            </div>
          </div>

          {/* Pillar 4: On-time Adherence */}
          <div 
            onClick={() => onNavigateDrillDown('all')}
            className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 hover:border-emerald-400 hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-emerald-800 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-emerald-800">Adherencia A Tiempo</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-emerald-950 font-mono tabular-nums">{metrics.onTimeRate}%</div>
            <div className="text-[11px] text-emerald-700 mt-1 flex items-center justify-between">
              <span>{metrics.onTimeJobs} órdenes cumplidas</span>
              <span className="text-[10px] font-medium text-emerald-800">Alta fiabilidad</span>
            </div>
          </div>

          {/* Pillar 5: Energy Volume */}
          <div 
            onClick={() => onNavigateDrillDown('high_energy')}
            className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 hover:border-amber-400 hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">Energía Total</span>
              <Zap className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">{metrics.totalEnergyKWh.toLocaleString()} <span className="text-xs font-normal text-slate-400">kWh</span></div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>{metrics.avgEnergyKWh} kWh/orden</span>
              <span className="text-[10px] underline text-blue-600">Ver picos &rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* C-Suite Strategic Insights & Actionable Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Insight selector pills */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Hallazgos Prioritarios ({insights.length})
            </h3>
            <span className="text-[11px] text-slate-400">Seleccionar para profundizar</span>
          </div>

          <div className="space-y-2">
            {insights.map((insight, idx) => {
              const isSelected = insight.id === selectedInsightId;
              const priorityColors = {
                CRÍTICA: 'bg-rose-50 text-rose-700 border-rose-200/80',
                ALTA: 'bg-amber-50 text-amber-800 border-amber-200/80',
                ESTRATÉGICA: 'bg-blue-50 text-blue-700 border-blue-200/80',
              };

              return (
                <div
                  key={insight.id}
                  onClick={() => setSelectedInsightId(insight.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold tracking-wider opacity-60">
                      #{idx + 1} • {insight.id}
                    </span>
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                      isSelected ? 'bg-slate-800 text-slate-200 border-slate-700' : priorityColors[insight.priority]
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                  <h4 className={`text-xs sm:text-sm font-semibold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {insight.title}
                  </h4>
                  <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {insight.headline}
                  </p>
                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] font-medium ${
                    isSelected ? 'border-slate-800 text-emerald-300' : 'border-slate-100 text-emerald-700'
                  }`}>
                    <span className="tabular-nums">Impacto: {insight.financialGain.split(' ')[0]} {insight.financialGain.split(' ')[1]}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-dive on active Insight (C-Suite Structure) */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Header of Active Insight */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200/80">
                  {activeInsight.id}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Eje Temático: {activeInsight.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Responsable:</span>
                <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
                  {activeInsight.responsible}
                </span>
              </div>
            </div>

            {/* Headline Answer (Pyramid Principle) */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 mb-5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-700 block mb-1">
                Conclusión Principal (The Headline)
              </span>
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {activeInsight.headline}
              </p>
            </div>

            {/* Evidence & Findings vs Root Cause (2-Column C-Suite Breakdown) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Evidencia Cuantificada (Hallazgo)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeInsight.finding}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/70">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Causa Raíz Operacional</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeInsight.rootCause}
                </p>
              </div>
            </div>

            {/* Action Plan Items */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Acciones Recomendadas (Plan Táctico Inmediato)</span>
              </h4>
              <div className="space-y-2">
                {activeInsight.actionPlan.map((action, aIdx) => (
                  <div key={aIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-200/60 text-xs sm:text-sm text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {aIdx + 1}
                    </span>
                    <span className="leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial and Operational ROI Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Beneficio Económico Proyectado
                </span>
                <p className="text-sm font-semibold text-emerald-950">
                  {activeInsight.financialGain}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1 mb-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Impacto Operacional Esperado
                </span>
                <p className="text-sm font-semibold text-emerald-950">
                  {activeInsight.expectedImpact}
                </p>
              </div>
            </div>
          </div>

          {/* Drill Down Direct Navigation Button for this specific insight */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Profundiza en los datos crudos asociados a este insight:
            </span>
            <button
              onClick={() => {
                if (activeInsight.category === 'puntualidad') {
                  onNavigateDrillDown('unstarted');
                } else if (activeInsight.category === 'energia') {
                  onNavigateDrillDown('high_energy');
                } else if (activeInsight.category === 'disponibilidad') {
                  onNavigateDrillDown('low_availability');
                } else {
                  onNavigateDrillDown('all');
                }
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span>Explorar Órdenes Afectadas en Drill-Down</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Analytical Charts (Loss Waterfall & Sector Disparity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waterfall / Loss Decomposition */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-7">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Descomposición de Horas de Producción (Fugas de Capacidad)
            </h3>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60 tabular-nums">
              {metrics.totalProcessingHours} Horas Totales
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Visualización del tiempo fabril comprometido frente a las horas destruidas por órdenes no iniciadas y retrasos en arranque.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lossBreakdownData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" unit="h" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#334155' }} width={140} />
                <Tooltip 
                  formatter={(val: number) => [`${val} Horas`, 'Tiempo']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="hours" radius={[0, 6, 6, 0]}>
                  {lossBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-100 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Efectividad Fabril</span>
              <span className="font-bold text-slate-900 text-sm font-mono tabular-nums">
                {Number(((effectiveProductiveHours / totalPlannedHours) * 100).toFixed(1))}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200/60">
              <span className="text-rose-700 block text-[10px] uppercase font-semibold">Merma No-Inicio</span>
              <span className="font-bold text-rose-800 text-sm font-mono tabular-nums">
                {Number(((unstartedLossHours / totalPlannedHours) * 100).toFixed(1))}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
              <span className="text-amber-800 block text-[10px] uppercase font-semibold">Fricción Retraso</span>
              <span className="font-bold text-amber-900 text-sm font-mono tabular-nums">
                {Number(((delayLossHours / totalPlannedHours) * 100).toFixed(1))}%
              </span>
            </div>
          </div>
        </div>

        {/* Machine Adherence Benchmarking */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-7">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Benchmarking de Puntualidad & No-Inicio por Máquina
            </h3>
            <button 
              onClick={() => setActiveTab('sectors')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Ver Sectores</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Comparativa de tasa a tiempo (% verde) vs retraso (% ámbar) y tasa de no inicio (% rojo) entre células M01 y M05.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={machineAdherenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip 
                  formatter={(val: number, name: string) => [
                    `${val}%`, 
                    name === 'onTimeRate' ? 'A Tiempo' : name === 'delayedRate' ? 'Con Retraso' : 'No Iniciado'
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="onTimeRate" name="A Tiempo" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="delayedRate" name="Con Retraso" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="unstartedRate" name="No Iniciado" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>A Tiempo (Meta &gt;75%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Con Retraso</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>No Iniciado (Alerta)</span>
            </div>
          </div>
        </div>
      </div>

      {/* C-Suite 30-60-90 Days Strategic Transformation Roadmap */}
      <div className="bg-slate-900 text-white rounded-2xl shadow-xs p-6 sm:p-8 border border-slate-800/90">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400">
              Hoja de Ruta de Transformación Operacional
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
              Plan de Implementación 30 - 60 - 90 Días
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            Gobernanza: Comité de Dirección Fabril
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Phase 1: 30 Days */}
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-mono font-semibold">
                Día 1 - 30
              </span>
              <span className="text-xs text-slate-400 font-medium">Quick Wins</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Contención Inmediata de Fugas</h4>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Check-list previo obligatorio de herramental 30 min antes de la orden en M01 y M04.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Modo Eco-Standby en operaciones de Fresado y Torneado en reposos &gt;3 minutos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Reuniones diarias de 10 min al pie de máquina (Daily Standup) para analizar órdenes caídas.</span>
              </li>
            </ul>
            <div className="pt-3 border-t border-slate-700/60 text-[11px] text-emerald-400 font-semibold">
              Objetivo: -35% en no-iniciadas
            </div>
          </div>

          {/* Phase 2: 60 Days */}
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-mono font-semibold">
                Día 31 - 60
              </span>
              <span className="text-xs text-slate-400 font-medium">Estandarización</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Optimización de Setups (SMED)</h4>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>Estandarización de matrices de cambio de utillaje, reduciendo tiempos de setup en 40%.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>Rotación de operadores líderes de M02 a M01 para transferir técnicas de ajuste rápido.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>Integración con ERP para bloqueo automático de órdenes con falta de materia prima.</span>
              </li>
            </ul>
            <div className="pt-3 border-t border-slate-700/60 text-[11px] text-emerald-400 font-semibold">
              Objetivo: Adherencia a tiempo &gt;75%
            </div>
          </div>

          {/* Phase 3: 90 Days */}
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-semibold">
                Día 61 - 90
              </span>
              <span className="text-xs text-slate-400 font-medium">Escalar & Sostener</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Planta Conectada & OEE &gt;82%</h4>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Monitoreo telemétrico en tiempo real de consumo eléctrico por ciclo y alertas predictivas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Reprogramación dinámica algorítmica de la cola de órdenes cuando ocurra una parada no programada.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Auditoría de sostenibilidad con reducción de la huella de carbono fabril en 12%.</span>
              </li>
            </ul>
            <div className="pt-3 border-t border-slate-700/60 text-[11px] text-emerald-400 font-semibold">
              Objetivo: OEE Clase Mundial (+82%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
