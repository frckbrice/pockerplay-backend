import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameSession } from './models/game.model';
import { UsersModule } from 'src/users/users.module';
import { ChoiceModule } from 'src/choice/choice.module';

@Module({
  imports: [
    SequelizeModule.forFeature([GameSession]),
    UsersModule,
    ChoiceModule,
  ],
  providers: [GameGateway, GameService],
})
export class GameModule {}
