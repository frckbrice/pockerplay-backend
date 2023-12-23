import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { GameSession } from './models/game.model';
import { GameType } from './interface/game.interface';
import { UsersService } from 'src/users/users.service';
import { v4 as UUIDV4 } from 'uuid';
import { ChoiceService } from 'src/choice/choice.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameSession) private gameModel: typeof GameSession,
    private userService: UsersService,
    private choiceService: ChoiceService,
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
    const existingGame = await this.gameModel.findByPk(id);
    if (existingGame) {
      if (updateGameDto?.guess_player_id)
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
    if (data.gamesession_id) {
      const game = await this.gameModel.findByPk(data.gamesession_id);
      console.log('existing game: ', game);
      if (game) {
        if (game.home_player_id === data.player_id) {
          const homeValues = {
            home_player_id: data.player_id,
            home_player_choice: data.player_choice,
            round_id: data.round_id,
            home_message_hint: data.message_hint,
            proposals: data.proposals,
          };
          this.choiceService.create(homeValues);
        } else {
          if (data.player_id === game.guess_player_id) {
          }
        }
      }
    }
  }
}
