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
    console.log(' created guess: ', createGuessDto);

    try {
      const existGuess = await this.guessModel.findOne({
        where: {
          round_id: createGuessDto.round_id,
          choice_id: createGuessDto.choice_id,
        },
      });

      if (existGuess) {
        console.log('existsGuess: ', existGuess);
        return this.update(existGuess.choice_id, createGuessDto);
      } else {
        console.log(' no existsGuess: ');
        const choice = await this.choiceService.findChoice(
          createGuessDto.choice_id,
        );

        if (choice) {
          console.log('existing choice: ', choice);
          if (createGuessDto.role === 'home_player') {
            const newGuess = new this.guessModel({
              choice_id: createGuessDto.choice_id,
              home_player_guess: createGuessDto.player_guess,
              home_player_id: createGuessDto.player_id,
              round_id: createGuessDto.round_id,
              home_guess_isCorrect:
                createGuessDto.player_guess === choice.guess_player_choice,
              gameSession_id: createGuessDto.gamesession_id,
            });

            console.log(newGuess);

            if (newGuess.home_guess_isCorrect) {
              const score = await this.scoreService.update(newGuess.round_id, {
                home_player_isCorrect: newGuess.home_guess_isCorrect,
              });
              console.log('score: ', score);
            }

            const newChoice = await newGuess.save();
            console.log('new choice created: ', newChoice);
            if (newChoice) return newChoice;
          } else if (createGuessDto.role === 'guess_player') {
            const newGuess = new this.guessModel({
              choice_id: createGuessDto.choice_id,
              guess_player_guess: createGuessDto.player_guess,
              guess_player_id: createGuessDto.player_id,
              round_id: createGuessDto.round_id,
              guess_guess_isCorrect:
                createGuessDto.player_guess === choice.home_player_choice,
              gameSession_id: createGuessDto.gamesession_id,
            });

            if (newGuess.guess_guess_isCorrect) {
              const score = await this.scoreService.update(newGuess.round_id, {
                guess_player_isCorrect: newGuess.guess_guess_isCorrect,
              });
              console.log('score ', score);
            }

            const newGuessCreated = await newGuess.save();
            console.log('new choice created: ', newGuessCreated);
            if (newGuessCreated) return newGuessCreated;
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('error updating guesss', error);
      }
    }
  }

  findAll() {
    return `This action returns all guess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guess`;
  }

  async update(id: string, updateGuessDto: any) {
    console.log('inside update guess, data received:', id, updateGuessDto);
    //check if the choice is already existing

    try {
      const checkGuess = await this.guessModel.findOne({
        where: {
          choice_id: id,
          round_id: updateGuessDto.round_id,
        },
      });
      console.log(' guess: ', checkGuess);
      if (checkGuess) {
        const choice = await this.choiceService.findChoice(
          updateGuessDto.choice_id,
        );
        if (choice) {
          if (updateGuessDto.role === 'home_player') {
            checkGuess.choice_id = choice.id;
            checkGuess.home_player_guess = updateGuessDto.player_guess;
            checkGuess.home_player_id = updateGuessDto.player_id;
            checkGuess.round_id = updateGuessDto.round_id;
            checkGuess.home_guess_isCorrect =
              updateGuessDto.player_guess === choice.guess_player_choice;

            //update the score
            if (checkGuess.home_guess_isCorrect) {
              const score = await this.scoreService.update(
                checkGuess.round_id,
                {
                  home_player_isCorrect: checkGuess.home_guess_isCorrect,
                },
              );
              console.log('score: ', score);
            }
          } else if (updateGuessDto.role === 'guess_player') {
            console.log(' choice: ', choice);
            checkGuess.choice_id = choice.id;
            checkGuess.guess_player_guess = updateGuessDto.player_guess;
            checkGuess.guess_player_id = updateGuessDto.player_id;
            checkGuess.round_id = updateGuessDto.round_id;
            checkGuess.guess_guess_isCorrect =
              updateGuessDto.player_guess === choice.home_player_choice;
          }

          //update the score
          if (checkGuess.guess_guess_isCorrect) {
            const score = await this.scoreService.update(checkGuess.round_id, {
              guess_player_isCorrect: checkGuess.guess_guess_isCorrect,
            });
            console.log('score: ', score);
          }
        }

        const updateGuess = await checkGuess.save();
        if (updateGuess) {
          console.log('new choice created: ', updateGuess);
          return updateGuess;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('error updating guesss', error);
      }
    }
  }

  checkGameRoundState(roundId: string) {
    return this.roundService.getRoundNumber(roundId);
  }

  async getScore(roundId: string) {
    return await this.scoreService.findOne(roundId);
  }
}
