export enum IspProvider {
  AIRTEL = 'Airtel India',
  JIO = 'Reliance Jio Infocomm',
  TPLINK = 'TP-Link Test Network',
  ACT = 'ACT Fibernet',
  VODAFONE = 'Vodafone Idea',
  AT_T = 'AT&T Services',
  VERIZON = 'Verizon Business',
  BSNL = 'BSNL Broadband',
  HATHWAY = 'Hathway Cable & Datacom',
  EXCITEL = 'Excitel Broadband',
  SPECTRANET = 'Spectra',
  GTPL = 'GTPL Broadband'
}

export interface IPConfig {
  id: string;
  ip: string;
  provider: IspProvider;
  location: string;
  type: 'Broadband' | 'Mobile 5G' | 'Mobile 4G' | 'Fiber';
  latency: number; // ms
  coordinates: { lat: number; lng: number };
}

export interface SimulationLog {
  id: string;
  timestamp: Date;
  url: string;
  status: number;
  ipUsed: string;
  provider: string;
  loadTime: number;
}

export interface HeaderEntry {
  key: string;
  value: string;
}

export interface AnalysisResult {
  latencyScore: number;
  accessibilityScore: number;
  aiAnalysis: string;
  headers: HeaderEntry[];
}