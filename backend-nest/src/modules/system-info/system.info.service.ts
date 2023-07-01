import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { SystemInfo } from "./interfaces/system-info.interface";

@Injectable()
export class SystemInfoService {
  constructor(private readonly systemInfoModel: Model<SystemInfo>) {}

  async findAllSystemInfos(): Promise<SystemInfo[]> {
    return await this.systemInfoModel.find().exec();
  }

  async checkAndAdd(data: SystemInfo): Promise<string> {
    let systemInfo = await this.systemInfoModel
      .findOne({ macA: data.macA })
      .exec();
    if (systemInfo) {
      return "found";
    } else {
      systemInfo = new this.systemInfoModel(data);
      await systemInfo.save();
      return "added";
    }
  }
}
