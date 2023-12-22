import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateGameRoundDto } from './dto/create-game_round.dto';
import { UpdateGameRoundDto } from './dto/update-game_round.dto';
import { GameRound } from './models/game_round.model';
import { InjectModel } from '@nestjs/sequelize';
import { randomWords, images } from 'utils/data';

@Injectable()
export class GameRoundService {
  constructor(
    @InjectModel(GameRound) private gameroundModel: typeof GameRound,
  ) {}
  async createRound(createGameRoundDto: CreateGameRoundDto) {
    const { category, number_of_proposals } = createGameRoundDto;
    const values: string[] = [];
    if (category === 'words') {
      for (let i = 0; i <= number_of_proposals - 1; i++) {
        values.push(this.randomValue(randomWords));
      }
    }
    if (category === 'images') {
      for (let i = 0; i <= number_of_proposals - 1; i++) {
        values.push(this.randomValue(images));
      }
    }

    const rowToStore = new this.gameroundModel({
      proposals: JSON.stringify(values),
      round_number: createGameRoundDto.round_number,
      number_of_proposals,
      category,
    });

    if (createGameRoundDto.id || createGameRoundDto.round_number > 1) {
      const existingGame = await this.update(createGameRoundDto.id, {
        number_of_proposals: createGameRoundDto.number_of_proposals,
        round_number: createGameRoundDto.round_number,
        category: createGameRoundDto.category,
      });
      if (existingGame) return { ...existingGame, proposals: values };
    }

    const newRound = await rowToStore.save();

    return { round_id: newRound.id, values };
  }

  findAll() {
    return `This action returns all gameRound`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameRound`;
  }

  async update(id: string, updateGameRoundDto: UpdateGameRoundDto) {
    const existingGameRound = await this.gameroundModel.findByPk(id);
    if (existingGameRound) {
      existingGameRound.number_of_proposals =
        updateGameRoundDto.number_of_proposals;
      existingGameRound.round_number = existingGameRound.round_number + 1;
      existingGameRound.category = updateGameRoundDto.category;

      return await existingGameRound.save();
    } else return null;
  }

  remove(id: number) {
    return `This action removes a #${id} gameRound`;
  }

  randomValue = (arr: string[]): string => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  };
}
