import os from "os";
import si from "systeminformation";
import io from "socket.io-client";

const nodeClient = (port: number) => {
  const socket = io(`http://127.0.0.1:${port}`);

  socket.on("connect", () => {
    let macA: string | undefined; // Identify this machine

    performanceData().then((allPerformanceData) => {
      sendData("initPerfData", macA, allPerformanceData);
    });

    si.networkInterfaces()
      .then((data) => {
        // Extract non-internal network interface
        const nonInternalInterface = Object.values(data).find(
          (iface) => !iface.internal
        );
        if (nonInternalInterface) {
          macA = nonInternalInterface.mac;
        }
      })
      .catch((error) => {
        // Handle the error here or propagate it
        throw error;
      });

    // Start sending over data on interval
    const perfDataInterval = setInterval(() => {
      performanceData()
        .then((allPerformanceData) => {
          console.log(allPerformanceData);
          return sendData("perfData", macA, allPerformanceData);
        })
        .catch((error) => {
          // Handle the error here or propagate it
          throw error;
        });
    }, 1000);

    // Initialize performance data

    socket.on("disconnect", () => {
      clearInterval(perfDataInterval);
    });
  });

  async function performanceData() {
    return new Promise((resolve) => {
      const kbToGb = 1024 * 1024 * 1024; // 1024^3 kilobytes = 1 Gigabyte

      // Returns file system stats
      let fsTotal = 0;
      let fsUsed = 0;
      let fsUsage = 0;

      si.fsSize().then((data) => {
        data.forEach((disk) => {
          fsTotal += disk.size / kbToGb;
          fsUsed += disk.used / kbToGb;
        });

        fsUsage = +((100 * fsUsed) / fsTotal).toFixed(1);
        fsTotal = +fsTotal.toFixed(0);
        fsUsed = +fsUsed.toFixed(0);
      });

      // Returns battery stats
      let battery;

      si.battery().then((data) => {
        battery = {
          hasbattery: data.hasbattery,
          ischarging: data.ischarging,
          voltage: data.voltage,
          percent: data.percent,
        };
      });

      // Returns the name of the operating system
      const osType = os.type();
      // Returns the uptime of the operating system, in seconds
      const upTime = os.uptime();
      // Returns the number of free memory of the system in bytes
      const freeMem = os.freemem();
      // Returns the number of total memory of the system in bytes
      const totalMem = os.totalmem();

      // Calculated memory usage
      const usedMem = totalMem - freeMem;
      const memUsage = ((100 * usedMem) / totalMem).toFixed(1);

      // Note: every core runs on 2 threads
      // Returns an array of objects containing information about the computer's CPUs
      const cpus = os.cpus(); // Returns static data
      const cpuModel = cpus[0].model; // CPU type
      const numCores = cpus.length; // Number of cores
      const cpuSpeed = cpus[0].speed; // Clock speed (in MHz)
      const cpuLoad = getCpuLoad(); // Calculated CPU load
      const isActive = true; // Machine connection status

      resolve({
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
        battery,
      });
    });
  }

  function cpuAverage() {
    const cpus = os.cpus(); // Called on every check to refresh CPU data
    // The amount of time the computer has spent in each mode since last reboot
    let idleMs = 0; // The aggregate total of all cores idle in milliseconds
    let totalMs = 0;
    // loop through each core
    cpus.forEach((aCore) => {
      // Loop through each property of the current core
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

  function getCpuLoad() {
    return new Promise((resolve) => {
      const start = cpuAverage(); // Fetch current CPU load
      // Get updated CPU load every 100ms
      setTimeout(() => {
        const end = cpuAverage();
        const idleDifference = end.idle - start.idle;
        const totalDifference = end.total - start.total;
        // Calculate the % of used CPU
        const percentageCpu =
          100 - Math.floor((100 * idleDifference) / totalDifference);
        resolve(percentageCpu);
      }, 1000);
    });
  }

  function sendData(
    socketEvent: string,
    macA: string | undefined,
    performanceData: any
  ) {
    performanceData.macA = macA;
    socket.emit(socketEvent, performanceData);
  }
};

export default nodeClient;
