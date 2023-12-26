import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { GameRound } from 'src/gameRound/models/gameRound.model';
import { Guess } from 'src/guess/models/guess.model';

import User from 'src/users/models/user.model';

@Table({ timestamps: true, freezeTableName: true, tableName: 'choice' })
export class Choice extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => GameRound)
  @Column({ type: DataType.UUID })
  round_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  home_player_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  guess_player_id: string;

  @Column
  home_player_choice: string;

  @Column
  guess_player_choice: string;

  // @Column
  // proposals: string;

  @Column
  home_message_hint: string;

  @Column
  guess_message_hint: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => GameRound)
  round: GameRound;

  @HasOne(() => Guess)
  guess: Guess;
}
