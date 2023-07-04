import { IsBoolean, IsNumber } from "class-validator";

export class BatteryDto {
  @IsBoolean()
  readonly hasBattery: boolean;

  @IsBoolean()
  readonly isCharging: boolean;

  @IsNumber()
  readonly voltage: number;

  @IsNumber()
  readonly percent: number;
}
