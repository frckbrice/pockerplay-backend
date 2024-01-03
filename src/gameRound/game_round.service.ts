import { Injectable } from '@nestjs/common';
import { CreateGameRoundDto } from './dto/create-game_round.dto';
import { UpdateGameRoundDto } from './dto/update-game_round.dto';
import { GameRound } from './models/gameRound.model';
import { InjectModel } from '@nestjs/sequelize';
import { randomWords, randomimages } from 'utils/data';
import { Choice } from 'src/choice/models/choice.model';
import { Guess } from 'src/guess/models/guess.model';
import { Op } from 'sequelize';

@Injectable()
export class GameRoundService {
  constructor(
    @InjectModel(GameRound) private gameroundModel: typeof GameRound,
  ) {}
  async createRound(createGameRoundDto: CreateGameRoundDto) {
    console.log('create round data: ', createGameRoundDto);
    try {
      const { category, number_of_proposals } = createGameRoundDto;
      const values: string[] = [];
      if (category === 'words') {
        for (let i = 0; i <= number_of_proposals - 1; i++) {
          values.push(this.randomValue(randomWords));
        }
      }
      if (category === 'Images') {
        for (let i = 0; i <= number_of_proposals - 1; i++) {
          values.push(this.randomValue(randomimages));
        }
      }
      console.log('value to return: ', values);
      const rowToStore = new this.gameroundModel({
        round_number: createGameRoundDto.round_number,
        number_of_proposals,
        category,
        gamesession_id: createGameRoundDto.gamesession_id,
      });

      if (rowToStore.round_number <= 5 && rowToStore.round_number > 0) {
        const newRound = await rowToStore.save();
        console.log('this is round generated: ', newRound);
        // return { ...newRound, proposals: JSON.parse(newRound.proposals) };
        return { ...newRound, proposals: values };
      } else {
        console.log('only 5 rounds are allowed');
        return null;
      }
    } catch (error) {
      console.log('error creating round: ', error);
    }

    // }
  }

  async findAll(id: string) {
    const rounds = await this.gameroundModel.findAll({
      where: {
        gamesession_id: id,
        round_number: {
          // [Op.in]: [1, 2, 3, 4, 5],
          [Op.and]: {
            [Op.gte]: 1,
            [Op.lte]: 5,
          },
        },
      },
      order: [['gamesession_id', 'ASC']],
      limit: 10,
    });
    if (rounds.length) {
      console.log(
        'inside game rounds: ',
        rounds?.map((round: any) => round.dataValues),
      );
      return rounds?.map((round: any) => round.dataValues);
    }
  }

  async findOne(id: string) {
    const round = await this.gameroundModel.findByPk(id);
    return round ? round : null;
  }

  async update(id: string, updateGameRoundDto: UpdateGameRoundDto) {
    const existingGameRound = await this.gameroundModel.findByPk(id);
    if (existingGameRound) {
      existingGameRound.number_of_proposals =
        updateGameRoundDto.number_of_proposals;
      existingGameRound.round_number += 1;
      existingGameRound.category = updateGameRoundDto.category;
      // existingGameRound.proposals = updateGameRoundDto.proposals;
      existingGameRound.gamesession_id = updateGameRoundDto.gamesession_id;

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

  async getRoundNumber(id: string) {
    const round = await this.gameroundModel.findByPk(id);

    return round;
  }
}
