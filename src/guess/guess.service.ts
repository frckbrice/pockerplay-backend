import { Injectable } from '@nestjs/common';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Guess } from './models/guess.model';
import { GameGuessType } from 'src/game/interface/game.interface';
import { ChoiceService } from 'src/choice/choice.service';
import { ScoreService } from 'src/score/score.service';
import { GameRoundService } from 'src/gameRound/game_round.service';

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
    if (choice) {
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

      const newChoice = await newGuess.save();
      if(newChoice) return newChoice;
    }
  }

  findAll() {
    return `This action returns all guess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guess`;
  }

  async update(id: string, updateGuessDto: any) {
    const checkGuess = await this.guessModel.findOne({
      where: {
        choice_id: id,
      },
    });

    if (checkGuess) {
      const choice = await this.choiceService.findChoice(checkGuess.choice_id);
      if (choice) {
        checkGuess.choice_id = choice.id;
        checkGuess.home_player_guess = updateGuessDto.home_player_guess;
        checkGuess.home_player_id = updateGuessDto.home_player_id;
        checkGuess.round_id = updateGuessDto.round_id;
        checkGuess.home_guess_isCorrect =
          updateGuessDto.player_guess === choice.guess_player_choice;
      }
      //update the score
      if (checkGuess.home_guess_isCorrect)
        await this.scoreService.update(checkGuess.round_id, {
          home_player_isCorrect: checkGuess.home_guess_isCorrect,
        });

    return  await checkGuess.save();
  }
  }

  checkGameRoundState(roundId: string) {
    return this.roundService.getRoundNumber(roundId);
  }

  async getScore(roundId: string) {
    return await this.scoreService.findOne(roundId);
  }
}
