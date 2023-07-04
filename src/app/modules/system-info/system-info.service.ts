import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { SystemInfo } from "./interfaces";
import { SystemInfoDto } from "./dtos";

@Injectable()
export class SystemInfoService {
  constructor(private readonly SystemInfoModel: Model<SystemInfo>) {}

  findAllSystemInfos(): Promise<SystemInfo[]> {
    return this.SystemInfoModel.find().exec();
  }

  async checkAndAdd(data: SystemInfoDto): Promise<string> {
    let systemInfo = await this.SystemInfoModel.findOne({
      macA: data.macA,
    }).exec();
    if (systemInfo) {
      return "found";
    }
    const mappedData = this.mapSystemInfoDtoToSystemInfo(data); // Map the DTO to the interface
    systemInfo = new this.SystemInfoModel(mappedData);
    await systemInfo.save();
    return "added";
  }

  private mapSystemInfoDtoToSystemInfo(data: SystemInfoDto): SystemInfo {
    return {
      macA: data.macA,
      cpuLoad: data.cpuLoad,
      freeMem: data.freeMem,
      totalMem: data.totalMem,
      usedMem: data.usedMem,
      memUsage: data.memUsage,
      osType: data.osType,
      upTime: data.upTime,
      cpuModel: data.cpuModel,
      numCores: data.numCores,
      cpuSpeed: data.cpuSpeed,
      fsTotal: data.fsTotal,
      fsUsed: data.fsUsed,
      fsUsage: data.fsUsage,
      isActive: data.isActive,
      battery: {
        hasBattery: data.battery.hasBattery,
        isCharging: data.battery.isCharging,
        voltage: data.battery.voltage,
        percent: data.battery.percent,
      },
    };
  }
}
