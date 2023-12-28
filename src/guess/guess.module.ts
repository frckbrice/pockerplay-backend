import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Guess } from './models/guess.model';
import { ChoiceModule } from 'src/choice/choice.module';
import { ScoreModule } from 'src/score/score.module';

import { GameRoundModule } from 'src/gameRound/game_round.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Guess]),
    ChoiceModule,
    ScoreModule,
    GameRoundModule,
  ],
  controllers: [GuessController],
  providers: [GuessService],
  exports: [GuessService],
})
export class GuessModule {}
