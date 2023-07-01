import os from "os";
import si from "systeminformation";
import io from "socket.io-client";

const nodeClient = (port: number) => {
  const socket = io(`http://127.0.0.1:${port}`);

  socket.on("connect", () => {
    let macA: string | undefined; // Identify this machine

    si.networkInterfaces().then((data) => {
      // Loop through all the network interfaces for this machine and find a non-internal one
      for (const key in data) {
        if (!data[key].internal) {
          macA = data[key].mac;
          break;
        }
      }
    });

    // Initialize performance data
    performanceData().then((allPerformanceData) => {
      sendData("initPerfData", macA, allPerformanceData);
    });

    // Start sending over data on interval
    const perfDataInterval = setInterval(() => {
      performanceData().then((allPerformanceData) => {
        console.log(allPerformanceData);
        sendData("perfData", macA, allPerformanceData);
      });
    }, 1000);

    socket.on("disconnect", () => {
      clearInterval(perfDataInterval);
    });
  });

  async function performanceData() {
    // ... Rest of the code ...
  }

  // ... Rest of the code ...

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
