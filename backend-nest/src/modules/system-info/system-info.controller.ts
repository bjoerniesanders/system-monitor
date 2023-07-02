import { Body, Get, Post, Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SystemInfoDto } from "./dtos/system.info.dto";
import { SystemInfoService } from "./system.info.service";

@ApiTags("system-info")
@Controller("system-info")
export class SystemInfoController {
  constructor(private readonly systemInformationService: SystemInfoService) {}

  @Post()
  async create(@Body() createSystemInformationDto: SystemInfoDto) {
    this.systemInformationService.checkAndAdd(createSystemInformationDto);
  }

  @Get()
  async findAllSystemInfos() {
    return this.systemInformationService.findAllSystemInfos();
  }
}
