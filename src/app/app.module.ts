import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SystemInfoModule } from "./modules/system-info/system-info.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL,
      }),
    }),
    SystemInfoModule,
  ],
})
export class AppModule {}
