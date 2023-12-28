import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameSession } from './models/game.model';
import { UsersModule } from 'src/users/users.module';
import { ChoiceModule } from 'src/choice/choice.module';
import { GuessModule } from 'src/guess/guess.module';
import { GameRoundModule } from 'src/gameRound/game_round.module';

@Module({
  imports: [
    SequelizeModule.forFeature([GameSession]),
    UsersModule,
    ChoiceModule,
    GuessModule,
    GameRoundModule,
  ],
  providers: [GameGateway, GameService],
})
export class GameModule {}
