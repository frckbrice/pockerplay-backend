import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GuessService } from './guess.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';

@Controller('guess')
export class GuessController {
  constructor(private readonly guessService: GuessService) {}

  @Post()
  create(@Body() createGuessDto: CreateGuessDto) {
    return this.guessService.create(createGuessDto);
  }

  @Get()
  findAll() {
    return this.guessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuessDto: UpdateGuessDto) {
    return this.guessService.update(+id, updateGuessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guessService.remove(+id);
  }
}
