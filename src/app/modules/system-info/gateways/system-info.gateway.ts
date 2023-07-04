import { Server, Socket } from "socket.io";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { SystemInfoService } from "../system-info.service";
import { SystemInfo } from "../interfaces";

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
      this.server.to("ui").emit("data", systemInfo);
    });
  }

  async handleDisconnect(client: Socket) {
    console.log("A client has disconnected from the WebSocket", client);
    // Implement logic when a client disconnects from the WebSocket
  }

  @SubscribeMessage("initPerfData")
  handleInitPerfData(_client: Socket, data: any) {
    // Handle the received initPerfData message from the client
    console.log("Received initPerfData:", data);

    // Save the received data to the database or perform any other necessary actions
    // using the systemInfoService

    // Broadcast the data to all connected clients in the "ui" room
    this.server.to("ui").emit("data", data);
  }

  @SubscribeMessage("perfData")
  handlePerfData(_client: Socket, data: any) {
    // Handle the received perfData message from the client
    console.log("Received perfData:", data);

    // Save the received data to the database or perform any other necessary actions
    // using the systemInfoService

    // Broadcast the data to all connected clients in the "ui" room
    this.server.to("ui").emit("data", data);
  }
}
