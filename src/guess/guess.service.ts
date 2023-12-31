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
  async create(createGuessDto: any) {
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
          console.log('existing choice: ', choice.dataValues);
          if (createGuessDto.role === 'home_player') {
            console.log('inside home player: ', createGuessDto);
            const newGuess = new this.guessModel({
              choice_id: createGuessDto?.choice_id,
              home_player_guess: createGuessDto?.player_guess,
              home_player_id: createGuessDto?.player_id,

              home_guess_isCorrect:
                createGuessDto.player_guess === choice.guess_player_choice,
              gameSession_id: createGuessDto.gamesession_id,

              round_id: createGuessDto?.round_id,
            });

            console.log('inside home player: ', newGuess.dataValues);

            if (newGuess?.home_guess_isCorrect) {
              console.log('check update score round id: ', newGuess?.round_id);
              const score = await this.scoreService.update(
                createGuessDto.gamesession_id,
                {
                  home_player_isCorrect: newGuess?.home_guess_isCorrect,
                },
              );
              console.log('score: ', score);
            }

            const newGuessCreated = await newGuess.save();
            console.log('new choice created: ', newGuessCreated);
            if (newGuessCreated) return newGuessCreated;
          } else if (createGuessDto?.role === 'guess_player') {
            console.log('inside guess player: ', createGuessDto);
            console.log('round id: ', createGuessDto.round_id);

            const newGuess = new this.guessModel({
              choice_id: createGuessDto?.choice_id,
              guess_player_guess: createGuessDto?.player_guess,
              guess_player_id: createGuessDto?.player_id,

              round_id: createGuessDto?.round_id,

              guess_guess_isCorrect:
                createGuessDto?.player_guess === choice?.home_player_choice,
              gameSession_id: createGuessDto?.gamesession_id,
            });

            console.log('inside guess player: ', newGuess);

            if (newGuess?.guess_guess_isCorrect) {
              console.log(
                'check update scorwe round id: ',
                createGuessDto?.round_id,
              );
              const score = await this.scoreService.update(
                createGuessDto?.gamesession_id,
                {
                  guess_player_isCorrect: newGuess?.guess_guess_isCorrect,
                },
              );
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

  async findOneChoiceGuess(round_id: string, choice_id: string) {
    try {
      const checkGuess = await this.guessModel.findOne({
        where: {
          choice_id: choice_id,
          round_id: round_id,
        },
      });

      if (checkGuess) return checkGuess;
    } catch (error) {
      console.log('error occured while retrieving guess model', error);
    }
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
      console.log(' guess: ', checkGuess.dataValues);
      if (checkGuess) {
        const choice = await this.choiceService.findChoice(
          updateGuessDto.choice_id,
        );
        if (choice) {
          console.log(' choice: ', choice.dataValues);
          if (updateGuessDto.role === 'home_player') {
            checkGuess.choice_id = choice?.id;
            checkGuess.home_player_guess = updateGuessDto?.player_guess;
            checkGuess.home_player_id = updateGuessDto?.player_id;
            checkGuess.round_id = updateGuessDto?.round_id;

            checkGuess.home_guess_isCorrect =
              updateGuessDto?.player_guess === choice?.guess_player_choice;

            //update the score
            if (checkGuess.home_guess_isCorrect) {
              const score = await this.scoreService.update(
                updateGuessDto.gamesession_id,
                {
                  home_player_isCorrect: checkGuess.home_guess_isCorrect,
                },
              );
              console.log('score: ', score);
            }
          } else if (updateGuessDto.role === 'guess_player') {
            console.log(' choice: ', choice.dataValues);
            checkGuess.choice_id = choice?.id;
            checkGuess.guess_player_guess = updateGuessDto?.player_guess;
            checkGuess.guess_player_id = updateGuessDto?.player_id;
            checkGuess.round_id = updateGuessDto?.round_id;

            checkGuess.guess_guess_isCorrect =
              updateGuessDto.player_guess === choice?.home_player_choice;
          }

          //update the score
          if (checkGuess.guess_guess_isCorrect) {
            const score = await this.scoreService.update(
              updateGuessDto.gamesession_id,
              {
                guess_player_isCorrect: checkGuess?.guess_guess_isCorrect,
              },
            );
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

  async getScore(gamesession_id: string) {
    return await this.scoreService.findOne(gamesession_id);
  }
}
