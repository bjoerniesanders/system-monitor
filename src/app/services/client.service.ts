import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Interval, Timeout } from "@nestjs/schedule";
import { Socket, io } from "socket.io-client";
import si from "systeminformation";
import os from "os";
import { SystemInfo } from "../modules/system-info/interfaces";

@Injectable()
export class ClientService implements OnModuleInit, OnModuleDestroy {
  private socket: Socket;

  constructor() {
    const port = process.env.PORT || 8080;
    this.socket = io(`http://127.0.0.1:${port}`);
  }

  onModuleInit(): void {
    this.socket.on("connect", () => {
      this.sendPerformanceData("initPerfData");
      this.startSendingPerfData();
    });
  }

  onModuleDestroy(): void {
    this.socket.disconnect();
  }

  @Timeout(0)
  async sendPerformanceData(socketEvent: string): Promise<void> {
    const macA = await this.getMacAddress();
    const allPerformanceData = await this.getPerformanceData();
    const dataWithMacA = { ...allPerformanceData, macA };
    this.sendData(socketEvent, dataWithMacA);
  }

  @Interval(1000)
  async startSendingPerfData(): Promise<void> {
    const updatedPerformanceData = await this.getPerformanceData();
    console.log(updatedPerformanceData);
    this.sendData("perfData", updatedPerformanceData);
  }

  private async getPerformanceData(): Promise<SystemInfo> {
    const [fsSize, battery, osData, memData, cpuData] = await Promise.all([
      si.fsSize(),
      si.battery(),
      si.osInfo(),
      si.mem(),
      si.cpu(),
    ]);
    const macA = await this.getMacAddress();
    const fsTotal = fsSize.reduce((total, disk) => total + disk.size, 0);
    const fsUsed = fsSize.reduce((total, disk) => total + disk.used, 0);
    const fsUsage = (100 * fsUsed) / fsTotal;

    const memUsage =
      (100 * (memData.total - memData.available)) / memData.total;

    const osType = os.type();
    const upTime = os.uptime();
    const freeMem = os.freemem();
    const totalMem = os.totalmem();

    const usedMem = totalMem - freeMem;
    const cpus = os.cpus();
    const cpuModel = cpus[0].model;
    const numCores = cpus.length;
    const cpuSpeed = cpus[0].speed;

    const cpuLoad = await this.getCpuLoad();
    const isActive = true;
    const batteryData = {
      hasBattery: battery.hasbattery,
      isCharging: battery.ischarging,
      voltage: battery.voltage,
      percent: battery.percent,
    };

    return {
      macA,
      freeMem,
      totalMem,
      usedMem,
      memUsage,
      osType,
      upTime,
      cpuModel,
      numCores,
      cpuSpeed,
      cpuLoad,
      fsTotal,
      fsUsed,
      fsUsage,
      isActive,
      battery: batteryData,
    };
  }

  private cpuAverage(): { idle: number; total: number } {
    const cpus = os.cpus();
    let idleMs = 0;
    let totalMs = 0;
    cpus.forEach((aCore) => {
      Object.values(aCore.times).forEach((time) => {
        totalMs += time;
      });
      idleMs += aCore.times.idle;
    });
    return {
      idle: idleMs / cpus.length,
      total: totalMs / cpus.length,
    };
  }

  private async getCpuLoad(): Promise<number> {
    const start = this.cpuAverage();
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    const end = this.cpuAverage();
    const idleDifference = end.idle - start.idle;
    const totalDifference = end.total - start.total;
    const percentageCpu =
      100 - Math.floor((100 * idleDifference) / totalDifference);
    return percentageCpu;
  }

  private async getMacAddress(): Promise<string> {
    const networkInterfaces = await si.networkInterfaces();
    const nonInternalInterface = Object.values(networkInterfaces).find(
      (iface) => !iface.internal
    );

    if (nonInternalInterface) {
      return nonInternalInterface.mac;
    }

    return "";
  }

  private sendData(socketEvent: string, data: SystemInfo): void {
    this.socket.emit(socketEvent, data);
  }
}
