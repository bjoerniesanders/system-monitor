import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import SystemInfoSchema from "./schemas/system-info.schema";
import { SystemInfoController } from "./system-info.controller";
import { SystemInfoService } from "./system.info.service";
import { SystemInfoGateway } from "./gateways/system-info.gateway";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "SystemInfo", schema: SystemInfoSchema },
    ]),
  ],
  providers: [SystemInfoService, SystemInfoGateway],
  controllers: [SystemInfoController],
})
export class SystemInfoModule {}
