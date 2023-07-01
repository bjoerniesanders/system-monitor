import { Body, Get } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { SystemInfoDto } from "./dtos/system.info.dto";
import { SystemInfoService } from "./system.info.service";
import { ApiTags } from "@nestjs/swagger";

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
