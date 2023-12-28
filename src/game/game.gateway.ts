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
    if(data && data.playerId) {
      client.join(data?.gameSession_id);
 const gameUpdate =   await this.gameService.registerGuessPlayer(data?.gameSession_id, {
      guess_player_id: data.playerId,
    });
    const player = await this.gameService.findOneUser(data?.playerId)
   if(gameUpdate.existGame) {
 const notification = {
      notify: `🟢 ${player.username} is connected`,
      role: gameUpdate.existGame ? "guess_player" : "home_player",
      homePlayer: gameUpdate.homePlayer,
      guessPlayer: gameUpdate.guessPlayer
    }
    this.server
      .to(data?.gameSession_id)
      .emit('notify', notification);
    }
   }
   
   
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
    if(data.role=== "home_player") {
      const gameState = await this.gameService.handleUpdateGuess(data);
      if (gameState.gameState === 'END') {
        const endG = await this.gameService.endGame(data.round_id);
        this.handleEndGame(client, {gameSession_id: data.gamesession_id});
        return this.server.to(data.gamesession_id).emit('endGame', {
          guess: data.player_guess,
          role: data.role,
          gameState,
          game: endG,
          score: gameState.roundScore,
        });
    } else {
      return this.server.to(data.gamesession_id).emit('receive_guess', {
        guess: data.player_guess,
        role: data.role,
        gameState,
       
        score: gameState.roundScore,
      });
    }
    }else if(data.role === "guess_player") {
      await this.gameService.handlecreateGuess(data);
      return this.server.to(data.gamesession_id).emit('receive_guess', {
        guess: data.player_guess,
        role: data.role,
      });
    }
    
  }
  @SubscribeMessage('currentGame')
  async keepCurrentGameSession(@MessageBody() data: { [id: string]: string }) {
    console.log(data);
    return this.server.to(data.gamesession_id).emit('currentGame', data);
  }
}
