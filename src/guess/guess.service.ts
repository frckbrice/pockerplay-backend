import { Injectable } from '@nestjs/common';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Guess } from './models/guess.model';
import { GameGuessType } from 'src/game/interface/game.interface';
import { ChoiceService } from 'src/choice/choice.service';
import { ScoreService } from 'src/score/score.service';
import { GameRoundService } from 'src/game_round/game_round.service';

@Injectable()
export class GuessService {
  constructor(
    @InjectModel(Guess) private guessModel: typeof Guess,
    private choiceService: ChoiceService,
    private scoreService: ScoreService,
    private roundService: GameRoundService,
  ) {}
  async create(createGuessDto: GameGuessType) {
    const choice = await this.choiceService.findChoice(
      createGuessDto.choice_id,
    );

    const newGuess = new this.guessModel({
      choice_id: createGuessDto.choice_id,
      guess_player_guess: createGuessDto.player_guess,
      guess_player_id: createGuessDto.player_id,
      round_id: createGuessDto.round_id,
      guess_guess_isCorrect:
        createGuessDto.player_guess === choice.home_player_choice,
      gameSession_id: createGuessDto.gamesession_id,
    });

    if (newGuess.guess_guess_isCorrect)
      await this.scoreService.update(newGuess.round_id, {
        guess_player_isCorrect: newGuess.guess_guess_isCorrect,
      });

    return await newGuess.save();
  }

  findAll() {
    return `This action returns all guess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guess`;
  }

  async update(id: string, updateGuessDto: GameGuessType) {
    const checkGuess = await this.guessModel.findOne({
      where: {
        choice_id: updateGuessDto.choice_id,
      },
    });

    const choice = await this.choiceService.findChoice(id);

    if (choice && checkGuess) {
      checkGuess.choice_id = updateGuessDto.choice_id;
      checkGuess.home_player_guess = updateGuessDto.player_guess;
      checkGuess.home_player_id = updateGuessDto.player_id;
      checkGuess.round_id = updateGuessDto.round_id;
      checkGuess.home_guess_isCorrect =
        updateGuessDto.player_guess === choice.guess_player_choice;
    }

    //update the score
    if (checkGuess.home_guess_isCorrect)
      await this.scoreService.update(checkGuess.round_id, {
        home_player_isCorrect: checkGuess.home_guess_isCorrect,
      });

    const updatedGuess = await checkGuess.save();

    //update the round number
    if (
      updatedGuess &&
      updatedGuess.home_guess_isCorrect &&
      updatedGuess.home_guess_isCorrect
    ) {
      const gameState = await this.roundService.canUpdateRoundNumber(
        updatedGuess.round_id,
        true,
      );
      return gameState;
    }
    return updatedGuess.toJSON();
  }

  remove(id: number) {
    return `This action removes a #${id} guess`;
  }
}
