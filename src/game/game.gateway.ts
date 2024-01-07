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
import { Socket, Server } from 'socket.io';
import { GameGuessType, GameType } from './interface/game.interface';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', '*'],
    reconnect: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService) {}
  private socketList: string[] = [];
  @WebSocketServer() server: Server;

  handleConnection(client: Socket): any {
    console.log(`user ${client.id} has connected`);
    this.server
      .to(client.id)
      .emit('connection', 'client connected successfully');
  }

  handleDisconnect(client: Socket): any {
    client.leave(client.id);
    console.log(`${client.id} disconnected`);
  }

  @SubscribeMessage('init')
  async create(
    @MessageBody() createGameDto: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    const newgame = await this.gameService.create(createGameDto);
    if (newgame.state === 'new game') {
      client.join(newgame.game);
      this.server.to(newgame.game).emit('init', newgame);
    } else {
      client.join(createGameDto.home_player_id);
      this.server.to(createGameDto.home_player_id).emit('init', newgame.games);
    }
  }

  @SubscribeMessage('joingame')
  async handleJoinGame(
    @MessageBody() data: { [value: string]: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(data);
    if (data && data.playerId) {
      client.join(data?.gamesession_id);

      const gameUpdate = await this.gameService.registerGuessPlayer(
        data?.gamesession_id,
        {
          guess_player_id: data.playerId,
        },
      );

      // const player = await this.gameService.findOneUser(data?.playerId);

      console.log(gameUpdate);

      if (gameUpdate?.existGame) {
        const notification = {
          notify: `🟢 `,
          // role: gameUpdate.existGame ? 'guess_player' : 'home_player',
          homePlayer: gameUpdate.homePlayer,
          guessPlayer: gameUpdate.guessPlayer,
        };

        return this.server.to(data.gamesession_id).emit('notify', notification);
      } else if (gameUpdate?.guessPlayer === 'notconnected') {
        const notification = {
          notify: `🔴 `,
          role: 'home_player',
        };
        return this.server.to(data.gamesession_id).emit('notify', notification);
      }
    }
  }

  async handleEndGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data?: { gamesession_id: string },
  ) {
    client.leave(data.gamesession_id);
    this.handleDisconnection(data, client);
  }

  @SubscribeMessage('disconnected')
  async handleDisconnection(
    @MessageBody() data: { [value: string]: string },
    @ConnectedSocket() client: Socket,
  ) {
    const player = await this.gameService.findOneUser(data.player_id);
    this.server
      .to(data.gamesession_id)
      .emit('disconnection', `🔴 ${data?.player} disconnected`);
    this.handleDisconnect(client);
    console.log(`The user  ${player?.username} has disconnected`);
  }

  @SubscribeMessage('generate')
  async update(
    @MessageBody() data: { [value: string]: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.home_player_id);
    const round = await this.gameService.generateOptions(data);
    console.log('round in gate ways: ', round);
    return this.server.to(data.home_player_id).emit('round', {
      round: round.dataValues,
      proposals: round.proposals,
    });
  }

  @SubscribeMessage('send_choice')
  async handlesendingChoice(@MessageBody() data: GameType) {
    console.log('choice data received', data);

    this.server.to(data.gamesession_id).emit('sending', {
      role: data.role,
      text: 'sending ...',
      player_id: data.player_id,
    });

    const choicemade = await this.gameService.handleGameData(data);
    if (choicemade)
      this.server.to(data.gamesession_id).emit('receive_choice', {
        proposals: data.proposals,
        message: data.message_hint,
        role: data.role,
        choiceData: data.player_choice,
        choice: choicemade?.id,
        category: data.category,

        round: data.round,
      });
    else console.log('no choice created');
  }

  @SubscribeMessage('send_guess')
  async handlesendingGuess(
    @MessageBody() data: GameGuessType,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('guess data received', data);

    this.server.to(data.gamesession_id).emit('sending', {
      role: data.role,
      text: 'sending ...',
      player_id: data.player_id,
    });

    const updateGuess = await this.gameService.handleUpdateAndCreateGuess(data);
    const displayGuess = await this.gameService.handlecreateGuess(
      data.gamesession_id,
    );
    console.log('displayGuess', displayGuess);
    if (updateGuess) {
      console.log('updated Guess data', updateGuess);
      const roundScore = await this.gameService.checkroundScore(
        data?.gamesession_id,
      );
      console.log('in gateway, check score', roundScore);
      this.server.to(data.gamesession_id).emit('receive_guess', {
        guess: data.player_guess,
        role: data.role,
        category: data.category,
        score: roundScore,
        stats: displayGuess,
      });

      const gameStatus = await this.gameService.checkGameStatus(data.round_id);
      if (gameStatus.round_number === 5) {
        const endG = await this.gameService.endGame(updateGuess.round_id);
        if (endG)
          this.server.to(data.gamesession_id).emit('endGame', {
            guess: data.player_guess,
            role: data.role,
            gameState: 'END',
            game: endG,
            category: data.category,
          });

        this.handleEndGame(client, {
          gamesession_id: data.gamesession_id,
        });
      }
    } else {
      console.log('no update guess');
    }
  }

  @SubscribeMessage('myDM')
  async getAllmyDM(
    @MessageBody() data: { id: string; gamesession_id: string },
  ) {
    console.log(data);
    if (data.id && data.gamesession_id) {
      const myDMs = await this.gameService.getAllMyGames(data.id);
      return this.server.to(data.gamesession_id).emit('myDM', myDMs);
    }
  }

  @SubscribeMessage('currentGame')
  async keepCurrentGameSession(@MessageBody() data: { [id: string]: string }) {
    console.log(data);
    return this.server.to(data.gamesession_id).emit('currentGame', data);
  }
}
