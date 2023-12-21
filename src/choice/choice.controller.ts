import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';

@Controller('choice')
export class ChoiceController {
  constructor(private readonly choiceService: ChoiceService) {}

  @Post()
  create(@Body() createChoiceDto: CreateChoiceDto) {
    return this.choiceService.create(createChoiceDto);
  }

  @Get()
  findAll() {
    return this.choiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.choiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChoiceDto: UpdateChoiceDto) {
    return this.choiceService.update(+id, updateChoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.choiceService.remove(+id);
  }
}
