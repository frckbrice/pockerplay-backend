import { Injectable } from '@nestjs/common';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Guess } from './models/guess.model';

@Injectable()
export class GuessService {
  constructor(@InjectModel(Guess) private guessModel: typeof Guess) {}
  create(createGuessDto: CreateGuessDto) {
    return 'This action adds a new guess';
  }

  findAll() {
    return `This action returns all guess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guess`;
  }

  update(id: number, updateGuessDto: UpdateGuessDto) {
    return `This action updates a #${id} guess`;
  }

  remove(id: number) {
    return `This action removes a #${id} guess`;
  }
}
