import { Injectable } from '@nestjs/common';
import { CreateGameRoundDto } from './dto/create-game_round.dto';
import { UpdateGameRoundDto } from './dto/update-game_round.dto';

@Injectable()
export class GameRoundService {
  create(createGameRoundDto: CreateGameRoundDto) {
    return 'This action adds a new gameRound';
  }

  findAll() {
    return `This action returns all gameRound`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameRound`;
  }

  update(id: number, updateGameRoundDto: UpdateGameRoundDto) {
    return `This action updates a #${id} gameRound`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameRound`;
  }
}
