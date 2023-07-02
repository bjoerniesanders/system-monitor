export class SystemInfoDto {
  readonly macA: string;

  readonly cpuLoad: number;

  readonly freeMem: number;

  readonly totalMem: number;

  readonly usedMem: number;

  readonly memUsage: number;

  readonly osType: string;

  readonly upTime: number;

  readonly cpuModel: string;

  readonly numCores: number;

  readonly cpuSpeed: number;

  readonly fsTotal: number;

  readonly fsUsed: number;

  readonly fsUsage: number;

  readonly isActive: boolean;

  readonly battery: {
    readonly hasbattery: boolean;
    readonly ischarging: boolean;
    readonly voltage: number;
    readonly percent: number;
  };
}
