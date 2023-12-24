import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { v4 as UUIDV4 } from 'uuid';
import { Score } from './models/score.models';
import { InjectModel } from '@nestjs/sequelize';
import { ScoreType } from './interface/score.interface';

@Injectable()
export class ScoreService {
  constructor(@InjectModel(Score) private scoreModel: typeof Score) {}

  create(createScoreDto: CreateScoreDto) {
    return 'This action adds a new score';
  }

  findAll() {
    return `This action returns all score`;
  }

  async findOne(id: string) {
    return await this.scoreModel.findOne({
      where: {
        round_id: id,
      },
    });
  }

  async update(id: string, updateScoreDto: ScoreType) {
    // const newId = UUIDV4(id);
    const existingScore = await this.scoreModel.findOne({
      where: {
        round_id: updateScoreDto.round_id,
      },
    });

    if (existingScore && updateScoreDto.guess_player_isCorrect) {
      existingScore.guess_player_score += 1;
    } else if (existingScore && updateScoreDto.home_player_isCorrect) {
      existingScore.home_player_score += 1;
    }
    return await existingScore.save();
  }

  remove(id: number) {
    return `This action removes a #${id} score`;
  }
}
