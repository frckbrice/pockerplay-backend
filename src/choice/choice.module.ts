import { Module } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { ChoiceController } from './choice.controller';
import { Choice } from './models/choice.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Choice])],
  controllers: [ChoiceController],
  providers: [ChoiceService],
  exports: [ChoiceService],
})
export class ChoiceModule {}
