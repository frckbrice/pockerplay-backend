import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { ChoiceModule } from './choice/choice.module';
import { GameRoundModule } from './game_round/game_round.module';
// import { OptionModule } from './options/option.module';
import { SequelizeModule } from '@nestjs/sequelize';

import { GameModule } from './game/game.module';
import { GuessModule } from './guess/guess.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { ScoreModule } from './score/score.module';
import { ConfigModule } from '@nestjs/config';
import dbconfig from './common/config';

console.log(dbconfig);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ChoiceModule,
    GameRoundModule,
    // OptionModule,
    SequelizeModule.forRoot({
      host: 'localhost',
      username: 'root',
      password: 'Password123#@!',
      database: 'pockerplay',
      synchronize: true,
      retryDelay: 2000,
      autoLoadModels: true,
      dialect: 'mysql',
      port: 3306,
      // storage: ':memory:',
      models: [__dirname + '/**/models/*.model.ts'],
    }),

    GameModule,

    GuessModule,
    CacheModule.register(),
    ScoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
