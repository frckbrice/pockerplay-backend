import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { GameRound } from 'src/game_round/models/game_round.model';
import User from 'src/users/models/user.model';

@Table({ timestamps: true, tableName: 'gamesession', freezeTableName: true })
export class GameSession extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  home_player_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  guess_player_id: string;

  @Column
  winner: string;

  // @Column
  // score: Score;

  @Column({ type: DataType.NUMBER, defaultValue: 0 })
  home_player_score: number;

  @Column({ type: DataType.NUMBER, defaultValue: 0 })
  guess_player_score: number;

  // @Column
  // number_of_rounds: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => GameRound)
  rounds: GameRound[];
}
