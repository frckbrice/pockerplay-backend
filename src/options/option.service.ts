import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Option } from './models/option.model';
import { faker } from '@faker-js/faker';
import { Sequelize } from 'sequelize-typescript';
import { randomWords, images } from 'utils/data';

@Injectable()
export class OptionService {
  constructor(
    @InjectModel(Option) private optionModel: typeof Option,
    private sequelize: Sequelize,
  ) {}

  async generateNewOptions(createOptionDto: CreateOptionDto) {
    const { category, number_of_proposals } = createOptionDto;
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

    const rowToStore = new this.optionModel({
      proposals: JSON.stringify(values),
      round_number: createOptionDto.round_number,
      number_of_proposals,
      category,
    });

    await rowToStore.save();
    return values;
  }

  findAll() {
    return `This action returns all option`;
  }

  findOne(id: number) {
    return `This action returns a #${id} option`;
  }

  update(id: number, updateOptionDto: UpdateOptionDto) {
    return `This action updates a #${id} option`;
  }

  remove(id: number) {
    return `This action removes a #${id} option`;
  }

  randomValue = (arr: string[]): string => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  };
}
