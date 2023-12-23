import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { GameSession } from './models/game.model';
import { GameGuessType, GameType } from './interface/game.interface';
import { UsersService } from 'src/users/users.service';
import { v4 as UUIDV4 } from 'uuid';
import { ChoiceService } from 'src/choice/choice.service';
import { GuessService } from 'src/guess/guess.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameSession) private gameModel: typeof GameSession,
    private userService: UsersService,
    private choiceService: ChoiceService,
    private guessService: GuessService,
  ) {}
  async create(createGameDto: CreateGameDto) {
    const newGame = new this.gameModel({
      home_player_id: createGameDto.home_player_id,
    });

    return (await newGame.save()).id;
  }

  findAll() {
    return `This action returns all game`;
  }

  async findOneUser(id: string) {
    return await this.userService.findOne(id);
  }

  async update(id: string, updateGameDto?: UpdateGameDto) {
    // const newID = UUIDV4(id);
    const existingGame = await this.gameModel.findByPk(id);
    if (existingGame) {
      if (updateGameDto?.guess_player_id && !existingGame.guess_player_id)
        existingGame.guess_player_id = updateGameDto?.guess_player_id;
      else {
        existingGame.home_player_score = updateGameDto?.home_player_score;
        existingGame.guess_player_score = updateGameDto?.guess_player_score;
        existingGame.winner = updateGameDto?.winner;
        existingGame.number_of_rounds = updateGameDto?.number_of_rounds;
      }

      return (await existingGame.save()).toJSON();
    }

    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
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
