import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { ChoiceModule } from './choice/choice.module';
import { GameSessionModule } from './game_session/game_session.module';
import { GameRoundModule } from './game_round/game_round.module';
import { InvitationModule } from './invitation/invitation.module';
import { OptionModule } from './option/option.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [MessagesModule, UsersModule, ChoiceModule, GameSessionModule, GameRoundModule, InvitationModule, OptionModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
