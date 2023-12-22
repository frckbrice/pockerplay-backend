import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import User from 'src/users/models/user.model';
import { Option } from 'src/options/models/option.model';
import { GameRound } from 'src/game_round/models/game_round.model';

@Table({
  freezeTableName: true,
  tableName: 'guesses',
  timestamps: true,
  paranoid: true,
})
export class Guess extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  home_player_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  guess_player_id: string;

  @ForeignKey(() => GameRound)
  @Column({ type: DataType.UUID })
  round_id: string;

  @Column
  home_player_guess: string;

  @Column
  guess_player_guess: string;

  @Column
  isCorrect: boolean;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => GameRound)
  round: GameRound;
}
