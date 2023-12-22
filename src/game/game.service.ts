import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { GameSession } from './models/game.model';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameSession) private gameSession: typeof GameSession,
  ) {}
  async create(createGameDto: CreateGameDto) {
    const newGame = new this.gameSession({
      player1_id: createGameDto.player1_id,
      player2_id: createGameDto.player2_id,
    });

    return await newGame.save();
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    const existingGame = await this.gameSession.findByPk(id);
    if (existingGame) {
      if (updateGameDto.player2_id)
        existingGame.player2_id = updateGameDto.player2_id;
      else {
        existingGame.home_score = updateGameDto?.home_score;
        existingGame.away_score = updateGameDto?.away_score;
        existingGame.winner = updateGameDto?.winner;
        existingGame.number_of_rounds = updateGameDto?.number_of_rounds;
      }

      return await existingGame.save();
    }

    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
