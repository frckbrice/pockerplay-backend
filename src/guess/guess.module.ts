import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Guess } from './models/guess.model';

@Module({
  imports: [SequelizeModule.forFeature([Guess])],
  controllers: [GuessController],
  providers: [GuessService],
})
export class GuessModule {}
