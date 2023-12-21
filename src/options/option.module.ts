import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Option } from './models/option.model';

@Module({
  imports: [SequelizeModule.forFeature([Option])],
  controllers: [OptionController],
  providers: [OptionService],
})
export class OptionModule {}
