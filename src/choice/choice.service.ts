import { Injectable } from '@nestjs/common';
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
    if (existingChoice) {
      existingChoice.guess_player_id = createChoiceDto?.guess_player_id;
      existingChoice.guess_message_hint = createChoiceDto?.guess_message_hint;
      existingChoice.guess_player_choice = createChoiceDto?.guess_player_choice;

      return await existingChoice.save();
    }

    const newChoice = new this.choiceModel({
      home_message_hint: createChoiceDto.home_message_hint,
      home_player_choice: createChoiceDto.home_player_choice,
      home_player_id: createChoiceDto.home_player_id,
      round_id: createChoiceDto.round_id,
    });
    return await newChoice.save();
  }

  findAll() {
    return `This action returns all choice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} choice`;
  }

  update(id: number, updateChoiceDto: UpdateChoiceDto) {
    return `This action updates a #${id} choice`;
  }

  remove(id: number) {
    return `This action removes a #${id} choice`;
  }
}
