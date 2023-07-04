import { Schema } from "mongoose";

const SystemInfoSchema = new Schema({
  macA: String,
  cpuLoad: Number,
  freeMem: Number,
  totalMem: Number,
  usedMem: Number,
  memUsage: Number,
  osType: String,
  upTime: Number,
  cpuModel: String,
  numCores: Number,
  cpuSpeed: Number,
  fsTotal: Number,
  fsUsed: Number,
  fsUsage: Number,
  isActive: Boolean,
  battery: {
    hasbattery: Boolean,
    ischarging: Boolean,
    voltage: Number,
    percent: Number,
  },
});

export default SystemInfoSchema;
