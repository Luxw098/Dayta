import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',  // In production, restrict this to your actual domain
    methods: ['GET', 'POST']
  }
})
class WSSGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WSSGateway.name);
  
  @WebSocketServer() io: Server;
  
  afterInit() {
    this.logger.log("WSS Init")
  }
  
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Example of handling a message event
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.logger.log(`Received message: ${JSON.stringify(payload)}`);
    // Broadcast to all clients
    this.io.emit('message', payload);
  }
}
export default WSSGateway;