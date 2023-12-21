import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameSession } from './models/game.model';

@Module({
  imports: [SequelizeModule.forFeature([GameSession])],
  providers: [GameGateway, GameService],
})
export class GameModule {}
