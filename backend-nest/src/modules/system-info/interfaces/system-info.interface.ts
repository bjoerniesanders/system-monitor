export interface SystemInfo {
  macA: string;
  cpuLoad: number;
  freeMem: number;
  totalMem: number;
  usedMem: number;
  memUsage: number;
  osType: string;
  upTime: number;
  cpuModel: string;
  numCores: number;
  cpuSpeed: number;
  fsTotal: number;
  fsUsed: number;
  fsUsage: number;
  isActive: boolean;
  battery: {
    hasbattery: boolean;
    ischarging: boolean;
    voltage: number;
    percent: number;
  };
}
