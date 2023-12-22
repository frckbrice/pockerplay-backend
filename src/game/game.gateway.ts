import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() server: Server;
  handleConnection(client: Socket): any {
    console.log(`user ${client.id} has connected`);
  }

  handleDisconnect(client: Socket, ...args: any[]): any {
    client.leave(client.id);
    console.log(`user ${client.id} disconnected`);
  }

  @SubscribeMessage('init')
  async create(@MessageBody() createGameDto: CreateGameDto) {
    return await this.gameService.create(createGameDto);
  }

  @SubscribeMessage('join_game')
  handleJoinGame(
    @MessageBody() data: { [value: string]: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.gameSession);
    this.server
      .to(data.gameSession)
      .emit('notify', `🟢 ${data.player} is connected`);
    return this.gameService.findAll();
  }

  @SubscribeMessage('disconnected')
  async handleDisconnection(
    @MessageBody() data: { [value: string]: string },
    @ConnectedSocket() client: Socket,
  ) {
    const player = await this.gameService.findOneUser(data.player_id);
    this.server
      .to(data.gamesession)
      .emit('disconnected', `🔴 ${data?.player} disconnected`);

    this.handleDisconnect(client);

    console.log(`The user  ${player.name} has disconnected`);
  }

  // @SubscribeMessage('updateGame')
  // update(@MessageBody() updateGameDto: UpdateGameDto) {
  //   return this.gameService.update(updateGameDto., updateGameDto);
  // }

  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: number) {
    return this.gameService.remove(id);
  }
}
