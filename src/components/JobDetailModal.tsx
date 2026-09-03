import React from 'react';
import { JobRecord } from '../types';
import { MACHINE_METADATA, OPERATION_METADATA } from '../data/dataset';
import { 
  X, 
  Clock, 
  Zap, 
  Calendar, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Scale, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

interface JobDetailModalProps {
  job: JobRecord | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  if (!job) return null;

  const machineInfo = MACHINE_METADATA[job.machineId];
  const operationInfo = OPERATION_METADATA[job.operationType];

  const statusBadges = {
    NO_INICIADO: {
      bg: 'bg-rose-100 text-rose-800 border-rose-300',
      label: 'No Iniciada / Cancelada',
      icon: AlertOctagon,
    },
    CON_RETRASO: {
      bg: 'bg-amber-100 text-amber-800 border-amber-300',
      label: `Con Retraso (+${job.startDelayMinutes}m)`,
      icon: Clock,
    },
    A_TIEMPO: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      label: 'A Tiempo (Puntual)',
      icon: CheckCircle2,
    },
    ANTICIPADO: {
      bg: 'bg-blue-100 text-blue-800 border-blue-300',
      label: `Anticipado (${job.startDelayMinutes}m)`,
      icon: TrendingUp,
    },
  };

  const statusConfig = statusBadges[job.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-mono text-xs font-semibold">
                {job.jobId}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusConfig.bg}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.label}
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Ficha Técnica de Orden #{job.jobId}
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Registro trazable del sistema de ejecución de manufactura (MES)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/90 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer border border-slate-700/50"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Main Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5 tracking-wider">Máquina / Célula</span>
              <span className="text-sm font-bold text-slate-900 font-mono block">{job.machineId}</span>
              <span className="text-[11px] text-slate-500 truncate block mt-0.5">{machineInfo.name.split('(')[0]}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5 tracking-wider">Operación</span>
              <span className="text-sm font-bold text-slate-900 block">{job.operationType}</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">{operationInfo.displayName.split(' ')[0]}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5 tracking-wider">Duración Ciclo</span>
              <span className="text-sm font-bold text-slate-900 font-mono block tabular-nums">{job.processingTime} min</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">{(job.processingTime / 60).toFixed(1)} horas</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5 tracking-wider">Disponibilidad</span>
              <span className="text-sm font-bold text-slate-900 font-mono block tabular-nums">{job.machineAvailability}%</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Mecánica</span>
            </div>
          </div>

          {/* Chronological Timeline */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Cronograma y Ventanas de Ejecución</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-slate-200/70">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-0.5">Inicio Programado</span>
                <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm tabular-nums">{job.scheduledStart}</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200/70">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-0.5">Fin Programado</span>
                <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm tabular-nums">{job.scheduledEnd}</span>
              </div>

              <div className={`p-3 rounded-lg border ${
                !job.actualStart 
                  ? 'bg-rose-50/80 border-rose-200 text-rose-900' 
                  : job.status === 'CON_RETRASO' 
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950' 
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              }`}>
                <span className="block text-[10px] font-semibold uppercase tracking-wider opacity-75 mb-0.5">Arranque Real</span>
                <span className="font-mono font-bold text-xs sm:text-sm tabular-nums">
                  {job.actualStart ? job.actualStart : 'SIN REGISTRO (No Iniciada)'}
                </span>
                {job.startDelayMinutes !== null && (
                  <span className="block text-[10px] mt-1 font-semibold">
                    Desvío: {job.startDelayMinutes > 0 ? `+${job.startDelayMinutes}` : job.startDelayMinutes} min
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Consumptions & Efficiency Ratios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/70">
              <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider flex items-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5" />
                Energía Consumida
              </span>
              <span className="text-2xl font-bold text-blue-950 font-mono tabular-nums">{job.energyConsumption} <span className="text-xs font-normal">kWh</span></span>
              <span className="text-[11px] text-blue-800/80 block mt-1">
                Intensidad: {job.energyPerHour} kWh/h
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider flex items-center gap-1 mb-1">
                <Scale className="w-3.5 h-3.5" />
                Materia Prima Utilizada
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{job.materialUsed} <span className="text-xs font-normal">kg</span></span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Tasa: {job.throughputKgPerHour} kg/h
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Ratio Específico
              </span>
              <span className="text-2xl font-bold text-emerald-950 font-mono tabular-nums">{job.energyPerKg} <span className="text-xs font-normal">kWh/kg</span></span>
              <span className="text-[11px] text-emerald-800/80 block mt-1">
                Eficiencia unitaria
              </span>
            </div>
          </div>

          {/* Operational Assessment */}
          <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-600">
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Diagnóstico Operativo Automático</span>
            </h4>
            <p className="leading-relaxed text-[11px] text-slate-500">
              {!job.isStarted
                ? `La orden ${job.jobId} en ${job.machineId} cayó en la ventana de cancelación. Causa probable: demora acumulada en orden previa o falta de kit de herramientas validado en el sector de ${job.operationType}. Se sugiere auditoría de inventario intermedio.`
                : job.status === 'CON_RETRASO'
                  ? `La orden arrancó con un desfase de ${job.startDelayMinutes} minutos sobre el programa. La disponibilidad mecánica se situó en ${job.machineAvailability}%. Se recomienda verificar tiempo de cambio de formato (setup) en ${machineInfo.name}.`
                  : `Orden ejecutada dentro de los parámetros de control nominales. Ratio de energía de ${job.energyPerKg} kWh/kg y disponibilidad plena.`}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
