import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { GameSession } from './models/game.model';
import { GameType } from './interface/game.interface';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameSession) private gameSession: typeof GameSession,
  ) {}
  async create(createGameDto: CreateGameDto) {
    const newGame = new this.gameSession({
      home_player_id: createGameDto.home_player_id,
      guess_player_id: '',
    });

    return (await newGame.save()).id;
  }

  findAll() {
    return `This action returns all game`;
  }

  async findOneUser(id: string) {
    return { name: 'fake name' };
  }

  async update(id: string, updateGameDto?: UpdateGameDto) {
    const existingGame = await this.gameSession.findByPk(id);
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

  async handleGameData(data: GameType) {}
}
