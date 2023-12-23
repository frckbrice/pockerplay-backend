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
import { GameType } from './interface/game.interface';

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
  async create(
    @MessageBody() createGameDto: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(createGameDto.home_player_id);
    return await this.gameService.create(createGameDto);
  }

  @SubscribeMessage('newgame')
  async handleJoinGame(
    @MessageBody() data: { [value: string]: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.gameSession);
    await this.gameService.update(data.gameSession, {
      guess_player_id: data.player,
    });
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

    console.log(`The user  ${player.username} has disconnected`);
  }

  // @SubscribeMessage('updateGame')
  async update(@MessageBody() updateGameDto: UpdateGameDto) {
    return await this.gameService.update(updateGameDto.id, updateGameDto);
  }

  @SubscribeMessage('send_play')
  async handlesendingChoice(@MessageBody() data: GameType) {
    this.server.to(data.gamesession_id).emit('receive_play', data);
    await this.gameService.handleGameData(data);
  }

  @SubscribeMessage('send_guess')
  async handlesendingGuess(@MessageBody() data: GameType) {
    this.server.to(data.gamesession_id).emit('receive_play', data);
    await this.gameService.handleGameData(data);
  }
}
