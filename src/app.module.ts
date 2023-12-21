import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { ChoiceModule } from './choice/choice.module';
import { GameRoundModule } from './game_round/game_round.module';
import { OptionModule } from './options/option.module';
import { CategoryModule } from './category/category.module';
import { SequelizeModule } from '@nestjs/sequelize';

import { GameModule } from './game/game.module';

@Module({
  imports: [
    MessagesModule,
    UsersModule,
    ChoiceModule,
    GameRoundModule,
    OptionModule,
    // CategoryModule,
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost', //"db4free.net",
      port: 3306,
      username: 'root',
      password: 'Password123#@!',
      database: 'pockerplay',
      synchronize: true,
      retryDelay: 2000,
      autoLoadModels: true,
      // storage: ':memory:',
      models: [__dirname + '/**/models/*.model.ts'],
    }),

    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
