import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SystemInfoModule } from "./modules/system-info/system-info.module";

@Module({
  imports: [SystemInfoModule, MongooseModule.forRoot("mongodb://localhost/nest")],
})
export class AppModule {}
