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
import { GameGuessType, GameType } from './interface/game.interface';

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
    const newgame = await this.gameService.create(createGameDto);
    if (newgame) client.join(newgame);
    this.server.to(createGameDto.home_player_id).emit('initgame', newgame);
  }

  @SubscribeMessage('joingame')
  async handleJoinGame(
    @MessageBody() data: { [value: string]: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.gameSession_id);
    await this.gameService.update(data.gameSession_id, {
      guess_player_id: data.guess_player_id,
    });
    this.server
      .to(data.gameSession_id)
      .emit('notify', `🟢 ${data.player} is connected`);
    return this.gameService.findAll();
  }

  @SubscribeMessage('endgame')
  async handleEndGame(
    @MessageBody() data: { [value: string]: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.gameSession_id);
    this.handleDisconnection(data, client);
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

  @SubscribeMessage('send_choice')
  async handlesendingChoice(@MessageBody() data: GameType) {
    this.server.to(data.gamesession_id).emit('receive_data', {
      proposal: data.proposals,
      message: data.message_hint,
    });
    await this.gameService.handleGameData(data);
  }

  @SubscribeMessage('send_guess')
  async handlesendingGuess(@MessageBody() data: GameGuessType) {
    const gameState = await this.gameService.handleGuessData(data);
    if (gameState === 'end game') {
      const endG = await this.gameService.endGame(
        data.gamesession_id,
        data.round_id,
      );
      return this.server.to(data.gamesession_id).emit('endGame', {
        guess: data.player_guess,
        gameState,
        game: endG,
      });
    }
    return this.server.to(data.gamesession_id).emit('receive_data', {
      guess: data.player_guess,
    });
  }
}
