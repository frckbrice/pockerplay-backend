import { Module } from '@nestjs/common';
import { GameRoundService } from './game_round.service';
import { GameRoundController } from './game_round.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameRound } from './models/gameRound.model';

@Module({
  imports: [SequelizeModule.forFeature([GameRound])],
  controllers: [GameRoundController],
  providers: [GameRoundService],
  exports: [GameRoundService],
})
export class GameRoundModule {}
