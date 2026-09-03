export type OperationType = 'Grinding' | 'Additive' | 'Lathe' | 'Milling' | 'Drilling';
export type MachineId = 'M01' | 'M02' | 'M03' | 'M04' | 'M05';
export type JobStatus = 'NO_INICIADO' | 'CON_RETRASO' | 'A_TIEMPO' | 'ANTICIPADO';

export interface JobRecord {
  jobId: string;
  machineId: MachineId;
  operationType: OperationType;
  materialUsed: number; // kg
  processingTime: number; // minutos
  energyConsumption: number; // kWh
  machineAvailability: number; // % (80 - 100)
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;

  // Calculados
  isStarted: boolean;
  startDelayMinutes: number | null; // minutos de desvío (>0 retraso, <0 anticipado, 0 a tiempo)
  status: JobStatus;
  energyPerKg: number; // kWh/kg
  energyPerHour: number; // kWh/h
  throughputKgPerHour: number; // kg/h
  scheduledDate: string; // YYYY-MM-DD
  scheduledHour: number; // 0-23
}

export interface MetricSummary {
  totalJobs: number;
  startedJobs: number;
  unstartedJobs: number;
  unstartedRate: number; // %
  delayedJobs: number;
  delayedRate: number; // %
  onTimeJobs: number;
  onTimeRate: number; // %
  earlyJobs: number;
  avgDelayMinutes: number; // promedio en los iniciados con retraso
  totalEnergyKWh: number;
  avgEnergyKWh: number;
  totalMaterialKg: number;
  avgMaterialKg: number;
  avgProcessingTimeMin: number;
  totalProcessingHours: number;
  avgAvailability: number;
  avgEnergyPerKg: number;
  overallOEE: number; // Availability * Performance * OnTime
}

export interface MachineSectorSummary {
  machineId: MachineId;
  name: string;
  description: string;
  metrics: MetricSummary;
}

export interface OperationSegmentSummary {
  operationType: OperationType;
  displayName: string;
  description: string;
  metrics: MetricSummary;
}

export interface McKinseyInsight {
  id: string;
  category: 'puntualidad' | 'energia' | 'disponibilidad' | 'material' | 'capacidad';
  priority: 'CRÍTICA' | 'ALTA' | 'ESTRATÉGICA';
  title: string;
  headline: string;
  finding: string;
  rootCause: string;
  recommendation: string;
  actionPlan: string[];
  expectedImpact: string;
  financialGain: string;
  responsible: string;
}

export type ActiveTab = 'executive' | 'segments' | 'sectors' | 'drilldown';

export type DrillDownIndicator = 'all' | 'unstarted' | 'delayed' | 'high_energy' | 'low_availability' | 'high_material';

export interface DrillDownFilter {
  indicator: DrillDownIndicator;
  machine: string;
  operation: string;
  status: string;
  search: string;
  date: string;
}
