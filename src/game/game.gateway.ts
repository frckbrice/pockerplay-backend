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
import { Client } from 'socket.io/dist/client';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() server: Server;
  handleConnection(client: Socket): any {
    console.log(`user ${client.id} has connected`);
  }

  handleDisconnect(client: Socket): any {
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
    this.server.to(newgame).emit('init', newgame);
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
    const player = await this.gameService.findOneUser(data.guess_player_id)
    this.server
      .to(data.gameSession_id)
      .emit('notify', `🟢 ${player.username} is connected`);
  }

  async handleEndGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data?: { gameSession_id: string },
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

  @SubscribeMessage('generate')
  async update(@MessageBody() data: { [value: string]: string }) {
    const round = await this.gameService.generateOptions(data);
    return this.server.to(data.gamesession_id).emit('generate', round);
  }

  @SubscribeMessage('send_choice')
  async handlesendingChoice(@MessageBody() data: GameType) {
    
   const choicemade = await this.gameService.handleGameData(data);
    this.server.to(data.gamesession_id).emit('receive_choice', {
      proposals: data.proposals,
      message: data.message_hint,
      role: data.role,
      choice: choicemade.id,
    });
  }

  @SubscribeMessage('send_guess')
  async handlesendingGuess(
    @MessageBody() data: GameGuessType,
    @ConnectedSocket() client: Socket,
  ) {
    const gameState = await this.gameService.handleGuessData(data);
    if (gameState === 'end game') {
      const endG = await this.gameService.endGame(data.round_id);
      this.handleEndGame(client, {gameSession_id: data.gamesession_id});
      return this.server.to(data.gamesession_id).emit('endGame', {
        guess: data.player_guess,
        role: data.role,
        gameState,
        game: endG,
      });
      
    }
    return this.server.to(data.gamesession_id).emit('receive_guess', {
      guess: data.player_guess,
      role: data.role,
    });
  }
}
