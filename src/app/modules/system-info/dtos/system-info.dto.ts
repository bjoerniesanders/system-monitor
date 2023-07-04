import { Type } from "class-transformer";
import { IsString, IsNumber, IsBoolean, ValidateNested } from "class-validator";
import { BatteryDto } from "./battery.dto";

export class SystemInfoDto {
  @IsString()
  readonly macA: string;

  @IsNumber()
  readonly cpuLoad: number;

  @IsNumber()
  readonly freeMem: number;

  @IsNumber()
  readonly totalMem: number;

  @IsNumber()
  readonly usedMem: number;

  @IsNumber()
  readonly memUsage: number;

  @IsString()
  readonly osType: string;

  @IsNumber()
  readonly upTime: number;

  @IsString()
  readonly cpuModel: string;

  @IsNumber()
  readonly numCores: number;

  @IsNumber()
  readonly cpuSpeed: number;

  @IsNumber()
  readonly fsTotal: number;

  @IsNumber()
  readonly fsUsed: number;

  @IsNumber()
  readonly fsUsage: number;

  @IsBoolean()
  readonly isActive: boolean;

  @ValidateNested()
  @Type(() => BatteryDto)
  readonly battery: BatteryDto;
}
