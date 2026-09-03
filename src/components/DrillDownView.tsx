import React, { useState, useMemo } from 'react';
import { 
  JobRecord, 
  DrillDownIndicator, 
  MachineId, 
  OperationType, 
  JobStatus 
} from '../types';
import { JobDetailModal } from './JobDetailModal';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Clock, 
  AlertOctagon, 
  Zap, 
  ShieldAlert, 
  Scale, 
  CheckCircle2, 
  ArrowUpDown,
  Calendar,
  Layers,
  Cpu
} from 'lucide-react';

interface DrillDownViewProps {
  jobs: JobRecord[];
  initialIndicator?: DrillDownIndicator;
  initialMachine?: string;
  initialOperation?: string;
}

export const DrillDownView: React.FC<DrillDownViewProps> = ({
  jobs,
  initialIndicator = 'all',
  initialMachine = '',
  initialOperation = '',
}) => {
  // Filter States
  const [selectedIndicator, setSelectedIndicator] = useState<DrillDownIndicator>(initialIndicator);
  const [selectedMachine, setSelectedMachine] = useState<string>(initialMachine);
  const [selectedOperation, setSelectedOperation] = useState<string>(initialOperation);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Sorting
  const [sortField, setSortField] = useState<keyof JobRecord>('jobId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Inspection Modal
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);

  // Quick Indicator presets
  const indicatorPresets: { id: DrillDownIndicator; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'all', label: 'Todas las Órdenes', icon: Layers, color: 'hover:bg-slate-100 text-slate-800' },
    { id: 'unstarted', label: '🚨 No Iniciadas (Atrición)', icon: AlertOctagon, color: 'hover:bg-rose-50 text-rose-800' },
    { id: 'delayed', label: '⏱️ Con Retraso en Arranque', icon: Clock, color: 'hover:bg-amber-50 text-amber-800' },
    { id: 'high_energy', label: '⚡ Alto Consumo (>11 kWh)', icon: Zap, color: 'hover:bg-blue-50 text-blue-800' },
    { id: 'low_availability', label: '⚠️ Baja Disponibilidad (<85%)', icon: ShieldAlert, color: 'hover:bg-purple-50 text-purple-800' },
    { id: 'high_material', label: '📦 Alto Material (>3.8 kg)', icon: Scale, color: 'hover:bg-emerald-50 text-emerald-800' },
  ];

  // Filtering Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Preset indicator filter
      if (selectedIndicator === 'unstarted' && job.isStarted) return false;
      if (selectedIndicator === 'delayed' && job.status !== 'CON_RETRASO') return false;
      if (selectedIndicator === 'high_energy' && job.energyConsumption <= 11) return false;
      if (selectedIndicator === 'low_availability' && job.machineAvailability >= 85) return false;
      if (selectedIndicator === 'high_material' && job.materialUsed <= 3.8) return false;

      // Machine filter
      if (selectedMachine && job.machineId !== selectedMachine) return false;

      // Operation filter
      if (selectedOperation && job.operationType !== selectedOperation) return false;

      // Status filter
      if (selectedStatus && job.status !== selectedStatus) return false;

      // Date filter
      if (selectedDate && job.scheduledDate !== selectedDate) return false;

      // Text search (Job ID)
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const matchJobId = job.jobId.toLowerCase().includes(query);
        const matchMachine = job.machineId.toLowerCase().includes(query);
        const matchOp = job.operationType.toLowerCase().includes(query);
        if (!matchJobId && !matchMachine && !matchOp) return false;
      }

      return true;
    });
  }, [jobs, selectedIndicator, selectedMachine, selectedOperation, selectedStatus, selectedDate, searchQuery]);

  // Sorting Logic
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredJobs, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedJobs.length / pageSize) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedJobs.slice(start, start + pageSize);
  }, [sortedJobs, currentPage, pageSize]);

  const handleSort = (field: keyof JobRecord) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setSelectedIndicator('all');
    setSelectedMachine('');
    setSelectedOperation('');
    setSelectedStatus('');
    setSearchQuery('');
    setSelectedDate('');
    setCurrentPage(1);
  };

  // Subset KPIs
  const subsetMetrics = useMemo(() => {
    const total = filteredJobs.length;
    if (total === 0) return { total: 0, onTimeRate: 0, unstarted: 0, avgDelay: 0, avgEnergy: 0 };

    const unstarted = filteredJobs.filter(j => !j.isStarted).length;
    const onTime = filteredJobs.filter(j => j.status === 'A_TIEMPO').length;
    const delayed = filteredJobs.filter(j => j.status === 'CON_RETRASO');
    const totalDelay = delayed.reduce((acc, j) => acc + (j.startDelayMinutes || 0), 0);
    const totalEnergy = filteredJobs.reduce((acc, j) => acc + j.energyConsumption, 0);

    return {
      total,
      onTimeRate: Number(((onTime / total) * 100).toFixed(1)),
      unstarted,
      avgDelay: delayed.length > 0 ? Number((totalDelay / delayed.length).toFixed(1)) : 0,
      avgEnergy: Number((totalEnergy / total).toFixed(2)),
    };
  }, [filteredJobs]);

  const handleExportFilteredCsv = () => {
    const headers = [
      'Job ID',
      'Machine ID',
      'Operation',
      'Material (kg)',
      'Processing Time (min)',
      'Energy (kWh)',
      'Availability (%)',
      'Scheduled Start',
      'Scheduled End',
      'Actual Start',
      'Status',
      'Start Delay (min)',
    ];

    const rows = filteredJobs.map(j => [
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
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `drilldown_export_${selectedIndicator}_${filteredJobs.length}_jobs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const datesList = ['2023-03-20', '2023-03-21', '2023-03-22', '2023-03-23', '2023-03-24', '2023-03-25'];

  return (
    <div className="space-y-6 pb-12">
      {/* Drill-down Header & Indicator Presets */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-semibold tracking-wider uppercase mb-2">
              <Filter className="w-3.5 h-3.5" />
              Explorador Operativo de Alta Resolución
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Drill-Down por Indicador Clave
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 max-w-2xl leading-relaxed">
              Filtra, busca e inspecciona las 1,000 órdenes fabriles individualmente con trazabilidad completa de desvíos.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200/60"
              title="Restablecer todos los filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar Filtros</span>
            </button>
            <button
              onClick={handleExportFilteredCsv}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Selección ({filteredJobs.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Indicator Presets Strip */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2.5">
            Filtrado Rápido por Indicador Crítico:
          </span>
          <div className="flex flex-wrap gap-2">
            {indicatorPresets.map(preset => {
              const isSelected = selectedIndicator === preset.id;
              const Icon = preset.icon;

              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedIndicator(preset.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : `bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300 ${preset.color}`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-5 pt-5 border-t border-slate-100">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar Job ID (ej: J142)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200/90 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder:text-slate-400 text-slate-800 transition-all"
            />
          </div>

          {/* Machine Filter */}
          <div>
            <select
              value={selectedMachine}
              onChange={e => {
                setSelectedMachine(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200/90 text-xs bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Todas las Máquinas (M01-M05)</option>
              <option value="M01">M01 - Mecanizado Alpha</option>
              <option value="M02">M02 - Tornería Pesada</option>
              <option value="M03">M03 - Fresado 5-Ejes</option>
              <option value="M04">M04 - Célula Robótica</option>
              <option value="M05">M05 - Aditiva & Acabado</option>
            </select>
          </div>

          {/* Operation Filter */}
          <div>
            <select
              value={selectedOperation}
              onChange={e => {
                setSelectedOperation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200/90 text-xs bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Todas las Operaciones</option>
              <option value="Milling">Fresado (Milling)</option>
              <option value="Lathe">Torneado (Lathe)</option>
              <option value="Drilling">Taladrado (Drilling)</option>
              <option value="Grinding">Rectificado (Grinding)</option>
              <option value="Additive">Manufactura Aditiva</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200/90 text-xs bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Todos los Estados</option>
              <option value="A_TIEMPO">A Tiempo (Puntual)</option>
              <option value="CON_RETRASO">Con Retraso en Arranque</option>
              <option value="NO_INICIADO">No Iniciada / Cancelada</option>
              <option value="ANTICIPADO">Arranque Anticipado</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={selectedDate}
              onChange={e => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200/90 text-xs bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Todas las Fechas (20-25 Mar)</option>
              {datesList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Real-time Subset KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-0.5 tracking-wider">Órdenes Filtradas</span>
          <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{subsetMetrics.total}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {Number(((subsetMetrics.total / jobs.length) * 100).toFixed(1))}% de la planta
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-emerald-800 block mb-0.5 tracking-wider">Puntualidad en Filtro</span>
          <span className="text-xl font-bold text-emerald-900 font-mono tabular-nums">{subsetMetrics.onTimeRate}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Arranques a tiempo</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-rose-800 block mb-0.5 tracking-wider">No Iniciadas</span>
          <span className="text-xl font-bold text-rose-900 font-mono tabular-nums">{subsetMetrics.unstarted}</span>
          <span className="text-[10px] text-rose-700 block mt-0.5">Órdenes caídas</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-amber-800 block mb-0.5 tracking-wider">Retraso Promedio</span>
          <span className="text-xl font-bold text-amber-950 font-mono tabular-nums">+{subsetMetrics.avgDelay}m</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">En órdenes demoradas</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-semibold uppercase text-blue-700 block mb-0.5 tracking-wider">Consumo Medio</span>
          <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{subsetMetrics.avgEnergy} kWh</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Por ciclo filtrado</span>
        </div>
      </div>

      {/* Operational Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th 
                  onClick={() => handleSort('jobId')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Job ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('machineId')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Máquina</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('operationType')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Operación</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap">Programación (Ventana)</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Arranque Real</th>
                <th 
                  onClick={() => handleSort('startDelayMinutes')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Desvío</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap">Estado</th>
                <th 
                  onClick={() => handleSort('energyConsumption')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Energía</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('machineAvailability')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Disponibilidad</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('processingTime')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Duración</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5 text-right whitespace-nowrap">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-medium">No se encontraron órdenes que coincidan con los filtros.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer"
                    >
                      Restablecer filtros
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedJobs.map(job => {
                  const statusPill = {
                    NO_INICIADO: 'bg-rose-50 text-rose-700 border-rose-200/80',
                    CON_RETRASO: 'bg-amber-50 text-amber-800 border-amber-200/80',
                    A_TIEMPO: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
                    ANTICIPADO: 'bg-blue-50 text-blue-800 border-blue-200/80',
                  }[job.status];

                  return (
                    <tr 
                      key={job.jobId}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                        {job.jobId}
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-slate-800">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 text-xs">
                          {job.machineId}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium">
                        {job.operationType}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px] tabular-nums">
                        <div>{job.scheduledStart.slice(5)}</div>
                        <div className="text-slate-400 text-[10px]">hasta {job.scheduledEnd.slice(11)}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] tabular-nums">
                        {job.actualStart ? (
                          <span className="text-slate-800">{job.actualStart.slice(5)}</span>
                        ) : (
                          <span className="text-rose-600 font-medium text-[10px] uppercase">
                            No arrancó
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums">
                        {job.startDelayMinutes !== null ? (
                          <span className={`font-semibold ${
                            job.startDelayMinutes > 15 
                              ? 'text-rose-700' 
                              : job.startDelayMinutes > 2 
                                ? 'text-amber-800' 
                                : 'text-emerald-700'
                          }`}>
                            {job.startDelayMinutes > 0 ? `+${job.startDelayMinutes}m` : `${job.startDelayMinutes}m`}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusPill}`}>
                          {job.status === 'NO_INICIADO' ? 'No Iniciado' : job.status === 'CON_RETRASO' ? 'Con Retraso' : job.status === 'A_TIEMPO' ? 'A Tiempo' : 'Anticipado'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-800 tabular-nums">
                        {job.energyConsumption} kWh
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums">
                        <span className={job.machineAvailability < 85 ? 'text-amber-800 font-semibold' : 'text-slate-700'}>
                          {job.machineAvailability}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600 tabular-nums">
                        {job.processingTime} min
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 ml-auto transition-colors cursor-pointer border border-slate-200/60"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Ficha</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-md border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>órdenes por página • <strong className="text-slate-700">{sortedJobs.length}</strong> total</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Página <strong className="text-slate-700">{currentPage}</strong> de <strong className="text-slate-700">{totalPages}</strong></span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for detailed job inspection */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};
