import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Choice } from './models/choice.model';
import { Guess } from 'src/guess/models/guess.model';

@Injectable()
export class ChoiceService {
  constructor(@InjectModel(Choice) private choiceModel: typeof Choice) {}
  async create(createChoiceDto: any) {
    try {
      const existingChoice = await this.choiceModel.findOne({
        where: {
          home_player_id: createChoiceDto.player_id,
          round_id: createChoiceDto.round.id,
        },
      });

      if (existingChoice) {
        return this.update(existingChoice.id, createChoiceDto);
      } else {
        console.log(' no existing choice');
        if (createChoiceDto.role === 'home_player') {
          const newChoice = new this.choiceModel({
            home_message_hint: createChoiceDto.message_hint,
            home_player_choice: createChoiceDto.player_choice,
            home_player_id: createChoiceDto.player_id,
            round_id: createChoiceDto.round.id,
          });
          console.log('choice created');
          return await newChoice.save();
        } else if (createChoiceDto.role === 'guess_player') {
          const newChoice = new this.choiceModel({
            guess_message_hint: createChoiceDto.message_hint,
            guess_player_choice: createChoiceDto.player_choice,
            guess_player_id: createChoiceDto.player_id,
            round_id: createChoiceDto.round.id,
          });
          console.log('choice created');
          return await newChoice.save();
        }
      }
    } catch (error) {
      console.log('An error occurred while creating choice', error);
    }
  }
  findAll() {
    return `This action returns all choice`;
  }

  async findOneChoice(id: string) {
    // const newID = UUIDV4(id);
    if (id)
      return await this.choiceModel.findOne({
        where: {
          round_id: id,
        },
      });
    else return null;
  }

  async findChoice(id: string) {
    // const newID = UUIDV4(id);
    if (id) return await this.choiceModel.findByPk(id);
    else return null;
  }

  async findRoundChoice(id: string) {
    try {
      return await this.choiceModel.findOne({
        where: {
          round_id: id,
        },
      });
    } catch (error) {
      console.log('an error occurred while finding round choice', error);
    }
  }

  async update(id: string, updateChoiceDto: any) {
    try {
      const existingChoice = await this.choiceModel.findOne({
        where: {
          id: id,
          round_id: updateChoiceDto.round.id,
        },
      });
      if (existingChoice) {
        if (updateChoiceDto.role === 'home_player') {
          const newChoice = new this.choiceModel({
            home_message_hint: updateChoiceDto.message_hint,
            home_player_choice: updateChoiceDto.player_choice,
            home_player_id: updateChoiceDto.player_id,
            round_id: updateChoiceDto.round.id,
          });

          return await newChoice.save();
        } else if (updateChoiceDto.role === 'guess_player') {
          const newChoice = new this.choiceModel({
            guess_message_hint: updateChoiceDto.message_hint,
            guess_player_choice: updateChoiceDto.player_choice,
            guess_player_id: updateChoiceDto.player_id,
            round_id: updateChoiceDto.round.id,
          });

          return await newChoice.save();
        }
      } else {
        console.log(' no choice found');
        throw new NotFoundException('No choice found');
      }
    } catch (error) {
      console.log('An error occurred while creating choice', error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} choice`;
  }
}
