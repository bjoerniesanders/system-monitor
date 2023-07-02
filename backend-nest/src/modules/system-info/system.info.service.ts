import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { SystemInfo } from "./interfaces/system-info.interface";

@Injectable()
export class SystemInfoService {
  constructor(private readonly SystemInfoModel: Model<SystemInfo>) {}

  findAllSystemInfos(): Promise<SystemInfo[]> {
    return this.SystemInfoModel.find().exec();
  }

  async checkAndAdd(data: SystemInfo): Promise<string> {
    let systemInfo = await this.SystemInfoModel.findOne({
      macA: data.macA,
    }).exec();
    if (systemInfo) {
      return "found";
    }
    systemInfo = new this.SystemInfoModel(data);
    await systemInfo.save();
    return "added";
  }
}
