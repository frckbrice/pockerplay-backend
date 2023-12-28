import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { GameSession } from './models/game.model';
import { GameGuessType, GameType } from './interface/game.interface';
import { UsersService } from 'src/users/users.service';

import { ChoiceService } from 'src/choice/choice.service';
import { GuessService } from 'src/guess/guess.service';
import { GameRoundService } from 'src/gameRound/game_round.service';
// import User from 'src/users/models/user.model';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameSession) private gameModel: typeof GameSession,
    private userService: UsersService,
    private choiceService: ChoiceService,
    private guessService: GuessService,
    private roundService: GameRoundService,
  ) {}
  async create(createGameDto: CreateGameDto) {
    // const newGame = new this.gameModel({
    //   home_player_id: createGameDto.home_player_id,
    // });

    // return (await newGame.save()).id;

    const existGames = await this.gameModel.findAll({
      where: {
        home_player_id: createGameDto.home_player_id,
        guess_player_id: null,
      },
      order: [['createdAt', 'desc']],
    });
    console.log('all the players: ', existGames);
    if (existGames.length <= 2) {
      const newGame = new this.gameModel({
        home_player_id: createGameDto.home_player_id,
      });
      const game = await newGame.save();
      return { game: game.id, state: 'new game' };
    } else
      return {
        games: [existGames[0].id, existGames[1].id],
        state: 'pending game',
      };
  }

  async generateOptions(data: any) {
    return await this.roundService.createRound({
      gamesession_id: data.gamesession_id,
      category: data.category,
      number_of_proposals: data.number_of_proposals,
      round_number: data.round_number,
    });
  }

  async findOneUser(id: string) {
    return await this.userService.findOne(id);
  }

  async update(id: string, updateGameDto?: UpdateGameDto) {
    // const newID = UUIDV4(id);
    const existingGame = await this.gameModel.findByPk(id);
    console.log('in the update game', updateGameDto);

    if (existingGame && existingGame.guess_player_id) {
      console.log('end the game in update game');
      existingGame.home_player_score = updateGameDto?.home_player_score;
      existingGame.guess_player_score = updateGameDto?.guess_player_score;
      existingGame.winner = updateGameDto?.winner;
      return await existingGame.save();
    }
  }

  async registerGuessPlayer(id: string, updateGameDto?: UpdateGameDto) {
    // console.log('registerGuessPlayer: ', id, updateGameDto);
    const existingGame = await this.gameModel.findByPk(id);
    // console.log('existing game', existingGame);
    if (existingGame) {
      if (existingGame.home_player_id === updateGameDto.guess_player_id) {
        console.log('yes game exists and is home player connected');
        return { existingGame, guessPlayer: 'notconnected' };
      } else {
        console.log('check if guess player is registered yet');

        if (!existingGame.guess_player_id) {
          existingGame.guess_player_id = updateGameDto?.guess_player_id;
          const existGame = await existingGame.save();

          const homePlayer = await this.userService.findOne(
            existGame.home_player_id,
          );
          const guessPlayer = await this.userService.findOne(
            existGame.guess_player_id,
          );
          return { homePlayer, existGame, guessPlayer };
        }
      }
    }
  }

  async endGame(roundId: string) {
    console.log('in end game method');
    let winner: string = '';
    const round = await this.roundService.findOne(roundId);
    if (round && round.round_number === 5) {
      console.log('in end game method, the round', round);
      const { gamesession_id } = round;
      const existingGame = await this.gameModel.findByPk(gamesession_id);
      const roundScore = await this.guessService.getScore(roundId);

      const home_player = await this.userService.findOne(
        existingGame.home_player_id,
      );

      const guess_player = await this.userService.findOne(
        existingGame.guess_player_id,
      );

      if (roundScore && existingGame && home_player && guess_player) {
        console.log(
          'in end game method, the score, player, game',
          roundScore,
          existingGame.id,
          home_player.username,
          guess_player.username,
        );

        // existingGame.home_player_score = roundScore.home_player_score;
        // existingGame.guess_player_score = roundScore.guess_player_score;

        if (roundScore.home_player_score > roundScore.guess_player_score) {
          winner = home_player.username;
        } else if (
          roundScore.home_player_score < roundScore.guess_player_score
        ) {
          winner = guess_player.username;
        }

        const data = {
          id: round.gamesession_id,
          home_player_score: roundScore.home_player_score,
          guess_player_score: roundScore.guess_player_score,
          winner,
        };
        return await this.update(gamesession_id, data);
      }
      return await existingGame.save();
    }
  }

  async handleGameData(data: GameType) {
    if (data.role === 'home_player') {
      const homeValues = {
        home_player_id: data.player_id,
        home_player_choice: data.player_choice,
        round_id: data.round_id,
        home_message_hint: data.message_hint,
        proposals: data.proposals,
      };
      return await this.choiceService.create(homeValues);
    } else if (data.role === 'guess_player') {
      const homeValues = {
        guess_player_id: data.player_id,
        guess_player_choice: data.player_choice,
        round_id: data.round_id,
        guess_message_hint: data.message_hint,
        proposals: data.proposals,
      };
      return await this.choiceService.update(data.id, homeValues);
    }
    // } else {
    //   console.log(' no game session id');
    //   throw new NotFoundException('No game session id');
    // }
  }

  async handleUpdateGuess(data: GameGuessType) {
    if (data.role === 'home_player') {
      const homeGuesses = {
        choice_id: data.choice_id,
        home_player_guess: data.player_guess,
        home_player_id: data.player_id,
        round_id: data.round_id,
      };

      return await this.guessService.update(data.choice_id, homeGuesses);
    }
  }

  async handlecreateGuess(data: GameGuessType) {
    if (data.role === 'guess_player') {
      const guessGuesses = {
        choice_id: data.choice_id,
        guess_player_guess: data.player_guess,
        guess_player_id: data.player_id,
        round_id: data.round_id,
      };

      return await this.guessService.create(guessGuesses);
    }
  }

   async getAllMyGames(myId: string) {
    console.log(' in getAllMyGames id is:  ', myId);
    if (myId) {
      const allGameIds = (
        await this.gameModel.findAll({
          where: {
            home_player_id: myId,
          },
        })
      ).map((data) => data.guess_player_id);
      if (allGameIds.length > 0) {
        const allMyGuesses = await Promise.all(
          allGameIds.map(async (id) => {
            const user = await this.userService.findOne(id);
            if (user) return user;
          }),
        );

        if (allMyGuesses.length) return allMyGuesses;
        else return [];
      }
    } else return [];
  }
}
