import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
import { GameType } from 'src/game/interface/game.interface';
import { v4 as UUIDV4 } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { Choice } from './models/choice.model';

@Injectable()
export class ChoiceService {
  constructor(@InjectModel(Choice) private choiceModel: typeof Choice) {}
  async create(createChoiceDto: CreateChoiceDto) {
    const existingChoice = await this.choiceModel.findOne({
      where: {
        home_player_id: createChoiceDto.home_player_id,
        round_id: createChoiceDto.round_id,
      },
    });
    if (!existingChoice) {
      const newChoice = new this.choiceModel({
        home_message_hint: createChoiceDto.home_message_hint,
        home_player_choice: createChoiceDto.home_player_choice,
        home_player_id: createChoiceDto.home_player_id,
        round_id: createChoiceDto.round_id,
      });
      return await newChoice.save();
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

  async update(id: string, updateChoiceDto: UpdateChoiceDto) {
    const existingChoice = await this.choiceModel.findOne({
      where: {
        id: id,
        round_id: updateChoiceDto.round_id,
      },
    });
    if (existingChoice) {
      existingChoice.guess_player_id = updateChoiceDto?.guess_player_id;
      existingChoice.guess_message_hint = updateChoiceDto?.guess_message_hint;
      existingChoice.guess_player_choice = updateChoiceDto?.guess_player_choice;
      
      return await existingChoice.save();
    } else {
      console.log(' no choice found');
      throw new NotFoundException(
        'No choice found',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} choice`;
  }
}
