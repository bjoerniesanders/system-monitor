import { Server, Socket } from "socket.io";
import { SystemInfo } from "../interfaces/system-info.interface";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { SystemInfoService } from "../system.info.service";

@WebSocketGateway()
export class SystemInfoGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private systemInfoService: SystemInfoService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    client.join("ui");
    console.log("A client has connected to the WebSocket");

    const systemInfos = await this.systemInfoService.findAllSystemInfos();
    systemInfos.forEach((systemInfo: SystemInfo) => {
      systemInfo.isActive = false;
      this.server.to("ui").emit("data", "");
    });
  }

  async handleDisconnect(client: Socket) {
    console.log("A client has disconnected from the WebSocket", client);
    // Implement your logic when a client disconnects from the WebSocket
  }

  // Implement your other socket listeners here, such as "initPerfData" and "perfData"
}
