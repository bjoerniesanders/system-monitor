import { Body, Get, Post, Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SystemInfoService } from "./system-info.service";
import { SystemInfoDto } from "./dtos";
import { SystemInfo } from "./interfaces";

@ApiTags("system-info")
@Controller("system-info")
export class SystemInfoController {
  constructor(private readonly systemInformationService: SystemInfoService) {}

  @Post()
  async create(@Body() createSystemInformationDto: SystemInfoDto) {
    this.systemInformationService.checkAndAdd(createSystemInformationDto);
  }

  @Get()
  async findAllSystemInfos(): Promise<SystemInfo[]> {
    return this.systemInformationService.findAllSystemInfos();
  }
}
