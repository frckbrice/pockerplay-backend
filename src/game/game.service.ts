import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { GameSession } from './models/game.model';
import { GameGuessType, GameType } from './interface/game.interface';
import { UsersService } from 'src/users/users.service';

import { ChoiceService } from 'src/choice/choice.service';
import { GuessService } from 'src/guess/guess.service';
import { GameRoundService } from 'src/game_round/game_round.service';

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
    const newGame = new this.gameModel({
      home_player_id: createGameDto.home_player_id,
    });

    return (await newGame.save()).id;
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
    if (
      existingGame &&
      !existingGame.guess_player_id &&
      updateGameDto.guess_player_id
    ) {
      console.log('no guess player in update game');
      existingGame.guess_player_id = updateGameDto?.guess_player_id;
    } else if (existingGame && existingGame.guess_player_id) {
      console.log('end the game in update game');
      existingGame.home_player_score = updateGameDto?.home_player_score;
      existingGame.guess_player_score = updateGameDto?.guess_player_score;
      existingGame.winner = updateGameDto?.winner;
    }

    return (await existingGame.save()).toJSON();
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

  async handleGuessData(data: GameGuessType) {
    if (data.role === 'home_player') {
      const homeGuesses = {
        choice_id: data.choice_id,
        home_player_guess: data.player_guess,
        home_player_id: data.player_id,
        round_id: data.round_id,
      };

      return await this.guessService.update(data.choice_id, homeGuesses);
    } else if (data.role === 'guess_player') {
      const guessGuesses = {
        choice_id: data.choice_id,
        guess_player_guess: data.player_guess,
        guess_player_id: data.player_id,
        round_id: data.round_id,
      };

      return await this.guessService.create(guessGuesses);
    }
  }
}
