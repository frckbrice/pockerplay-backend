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
  player1_id: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => GameRound)
  rounds: GameRound[];

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  player2_id: string;

  @Column
  winner: string;
}
