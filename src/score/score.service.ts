import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
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
        gamesession_id: id,
      },
    });
  }

  async update(gamesession_id: string, updateScoreDto: ScoreType) {
    try {
      console.log('update', gamesession_id, updateScoreDto);
      const existingScore = await this.scoreModel.findOne({
        where: {
          gamesession_id: gamesession_id,
        },
      });

      console.log('existingScore', existingScore);
      if (!existingScore) {
        if (updateScoreDto.home_player_isCorrect) {
          const score = new this.scoreModel({
            home_player_score: 1,
            gamesession_id,
          });
          return await score.save();
        } else if (updateScoreDto.guess_player_isCorrect) {
          const score = new this.scoreModel({
            guess_player_score: 1,
            gamesession_id,
          });
          return await score.save();
        }
      } else {
        if (updateScoreDto.guess_player_isCorrect) {
          existingScore.gamesession_id = gamesession_id;
          existingScore.guess_player_score += 1;
        } else if (updateScoreDto.home_player_isCorrect) {
          existingScore.gamesession_id = gamesession_id;
          existingScore.home_player_score += 1;
        }
        return await existingScore.save();
      }
    } catch (error) {
      console.log('error updating score', error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} score`;
  }
}
