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

  handleDisconnect(client: any) {
    console.log(`user ${client.id} disconnected`);
  }

  @SubscribeMessage('createGame')
  async create(@MessageBody() createGameDto: CreateGameDto) {
    return await this.gameService.create(createGameDto);
  }

  @SubscribeMessage('join_game')
  handleJoinGame(
    @MessageBody() data: { [value: string]: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.gameSession);
    return this.gameService.findAll();
  }

  @SubscribeMessage('findOneGame')
  findOne(@MessageBody() id: number) {
    return this.gameService.findOne(id);
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
