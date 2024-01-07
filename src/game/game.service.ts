import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { GameSession } from './models/game.model';
import { GameGuessType, GameType } from './interface/game.interface';
import { UsersService } from 'src/users/users.service';

import { ChoiceService } from 'src/choice/choice.service';
import { GuessService } from 'src/guess/guess.service';
import { GameRoundService } from 'src/gameRound/game_round.service';
// import User from 'src/users/models/user.model';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameSession) private gameModel: typeof GameSession,
    private userService: UsersService,
    private choiceService: ChoiceService,
    private guessService: GuessService,
    private roundService: GameRoundService,
  ) {}
  async create(createGameDto: CreateGameDto) {
    // const newGame = new this.gameModel({
    //   home_player_id: createGameDto.home_player_id,
    // });

    // return (await newGame.save()).id;

    const existGames = await this.gameModel.findAll({
      where: {
        home_player_id: createGameDto.home_player_id,
        guess_player_id: null,
      },
      order: [['createdAt', 'desc']],
    });
    console.log('all the players: ', existGames);
    if (existGames.length <= 2) {
      const newGame = new this.gameModel({
        home_player_id: createGameDto.home_player_id,
      });
      const game = await newGame.save();
      return { game: game.id, state: 'new game' };
    } else
      return {
        games: [existGames[0].id, existGames[1].id],
        state: 'pending game',
      };
  }

  async generateOptions(data: any) {
    return await this.roundService.createRound({
      gamesession_id: data.gamesession_id,
      category: data.category,
      number_of_proposals: data.number_of_proposals,
      round_number: data.round_number,
    });
  }

  async findOneUser(id: string) {
    return await this.userService.findOne(id);
  }

  async update(id: string, updateGameDto?: UpdateGameDto) {
    const existingGame = await this.gameModel.findByPk(id);
    console.log('in the update game', updateGameDto);

    if (existingGame && existingGame.guess_player_id) {
      console.log('end the game in update game');
      existingGame.home_player_score = updateGameDto?.home_player_score;
      existingGame.guess_player_score = updateGameDto?.guess_player_score;
      existingGame.winner = updateGameDto?.winner;
      return await existingGame.save();
    }
  }

  async registerGuessPlayer(id: string, updateGameDto?: UpdateGameDto) {
    // console.log('registerGuessPlayer: ', id, updateGameDto);
    const existingGame = await this.gameModel.findByPk(id);
    // console.log('existing game', existingGame);
    if (existingGame) {
      if (existingGame.home_player_id === updateGameDto.guess_player_id) {
        console.log('yes game exists and is home player connected');
        return { existingGame, guessPlayer: 'notconnected' };
      } else {
        console.log('check if guess player is registered yet');

        if (!existingGame.guess_player_id) {
          existingGame.guess_player_id = updateGameDto?.guess_player_id;
          const existGame = await existingGame.save();

          const homePlayer = await this.userService.findOne(
            existGame.home_player_id,
          );
          const guessPlayer = await this.userService.findOne(
            existGame.guess_player_id,
          );
          return { homePlayer, existGame, guessPlayer };
        }
      }
    }
  }

  async endGame(roundId: string) {
    console.log('in end game method');
    let winner: string = '';
    const round = await this.roundService.findOne(roundId);
    if (round && round.round_number === 5) {
      console.log('in end game method, the round', round);
      const { gamesession_id } = round;
      const existingGame = await this.gameModel.findByPk(gamesession_id);
      const roundScore = await this.guessService.getScore(gamesession_id);

      const home_player = await this.userService.findOne(
        existingGame.home_player_id,
      );

      const guess_player = await this.userService.findOne(
        existingGame.guess_player_id,
      );

      if (existingGame && roundScore) {
        console.log(
          'in end game method, the score, player, game',
          roundScore,
          existingGame.id,
          home_player.username,
          guess_player.username,
        );

        // existingGame.home_player_score = roundScore.home_player_score;
        // existingGame.guess_player_score = roundScore.guess_player_score;

        if (roundScore?.home_player_score > roundScore?.guess_player_score) {
          winner = home_player?.username;
        } else if (
          roundScore?.home_player_score < roundScore?.guess_player_score
        ) {
          winner = guess_player.username;
        } else if (
          roundScore.home_player_score === roundScore.guess_player_score
        )
          winner === null;

        const data = {
          id: round.gamesession_id,
          home_player_score: roundScore?.home_player_score,
          guess_player_score: roundScore?.guess_player_score,
          winner,
        };
        return await this.update(gamesession_id, data);
      }
      // return await existingGame.save();
    }
  }

  async handleGameData(data: any) {
    console.log('data inside handleGameData function', data);

    try {
      return await this.choiceService.create(data);
    } catch (error) {
      console.log('inside handleUpdateAndCreateGuess fct ', error);
    }
  }

  async handleUpdateAndCreateGuess(data: any) {
    console.log('data inside handleUpdateAndCreateGuess function', data);
    try {
      return await this.guessService.create(data);
    } catch (error) {
      console.log('inside handleUpdateAndCreateGuess fct ', error);
    }
  }

  async handlecreateGuess(gamesession_id: string) {
    try {
      // get all the round for this game session
      let result = [];
      const rounds = (await this.roundService.findAll(gamesession_id)).map(
        (round) => round.id,
      );
      if (!rounds.length)
        console.log('No games session found for this id: ', gamesession_id);
      else {
        console.log('round list: ', rounds);

        // for each round we need the choice associated
        const roundsChoice = rounds
          ?.map(async (roundId) => {
            if (roundId) {
              const choice = await this.choiceService.findRoundChoice(roundId);
              if (choice) {
                if (choice.home_player_choice) {
                  return {
                    round_id: roundId,
                    choice_id: choice.id,
                    home_player_choice: choice.home_player_choice,
                  };
                } else if (choice.guess_player_choice) {
                  return {
                    round_id: roundId,
                    choice_id: choice.id,
                    guess_player_choice: choice.guess_player_choice,
                  };
                }
              } else return null;
            }
          })
          .filter((choice) => choice !== null);

        const roundsChoices = await Promise.all(roundsChoice);

        if (roundsChoices.length) {
          console.log(' inside game service Round Choices: ', roundsChoices);
          // for each choice, we need the corresponding guess
          const choiceAndGuesses = await Promise.all(
            roundsChoices
              ?.filter((data) => data !== null)
              ?.map(async (choice) => {
                const guess = await this.guessService.findOneChoiceGuess(
                  choice.round_id,
                  choice.choice_id,
                );

                if (guess) {
                  if (guess.home_player_guess) {
                    return {
                      ...choice,
                      home_player_choice: '',
                      guess_player_guess: '',
                      guess_player_score: 0,
                      home_player_guess: guess.home_player_guess,
                    };
                  } else if (guess.guess_player_guess) {
                    return {
                      ...choice,
                      guess_player_choice: '',
                      home_player_guess: '',
                      home_player_score: 0,
                      guess_player_guess: guess.guess_player_guess,
                    };
                  }
                } else return null;
              })
              .filter((guess) => guess != null),
          );

          //we check the round score to add it to the result
          const roundScore = await this.checkroundScore(gamesession_id);

          //we introduice the score of each guess into the array of result
          if (choiceAndGuesses.length && roundScore) {
            console.log('choiceAndGuesses: ', choiceAndGuesses);
            const returnArray = await Promise.all(
              choiceAndGuesses
                ?.filter((data) => data !== null)
                .map(async (guess) => {
                  if (guess) {
                    if (guess.home_player_guess) {
                      return {
                        ...guess,
                        home_player_score: roundScore.home_player_score,
                      };
                    } else if (guess.guess_player_guess) {
                      return {
                        ...guess,
                        guess_player_score: roundScore.guess_player_score,
                      };
                    }
                  } else return null;
                }),
            );

            if (returnArray.length) {
              console.log(' inside game service returnArray: ', returnArray);
              result = [...returnArray];
            }
          }
        }
        //we return the result to the gameGateway
        console.log('result: ', result);
        return result;
      }
    } catch (error) {
      console.log('No games session found for this id: ' + error);
    }
  }

  async getAllMyGames(myId: string) {
    console.log(' in getAllMyGames id is:  ', myId);
    if (myId) {
      const allGameIds = (
        await this.gameModel.findAll({
          where: {
            home_player_id: myId,
          },
        })
      ).map((data) => {
        if (data.guess_player_id) return data.guess_player_id;
      });
      if (allGameIds.length) {
        const allMyGuesses = await Promise.all(
          allGameIds.map(async (id) => {
            const user = await this.userService.findOne(id);
            if (user) return user;
          }),
        );

        if (allMyGuesses.length) return allMyGuesses;
        else return [];
      }
    } else return [];
  }

  async checkGameStatus(round_id: string) {
    return await this.roundService.getRoundNumber(round_id);
  }

  async checkroundScore(gamesession_id: string) {
    return await this.guessService.getScore(gamesession_id);
  }
}
