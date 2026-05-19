import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server | undefined;

  constructor(private prisma: PrismaService) {}

  async handleConnection(client: Socket) {
    console.log(`Usuário conectado: ${client.id}`);

    const messages = await this.prisma.message.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    client.emit('history', messages);

    this.server?.emit(
      'system',
      `Usuário entrou no chat`,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Usuário desconectado: ${client.id}`);

    this.server?.emit(
      'system',
      `Usuário saiu do chat`,
    );
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any) {
    console.log(payload);

    const message = await this.prisma.message.create({
      data: {
        sender: payload.sender,
        text: payload.text,
      },
    });

    this.server?.emit('message', message);

    return message;
  }
}