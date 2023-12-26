import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import User from 'src/users/models/user.model';
import { GameRound } from 'src/gameRound/models/gameRound.model';
import { Choice } from 'src/choice/models/choice.model';

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

  @ForeignKey(() => Choice)
  @Column({ type: DataType.UUID })
  choice_id: string;

  @Column
  home_player_guess: string;

  @Column
  guess_player_guess: string;

  @Column
  home_guess_isCorrect: boolean;

  @Column
  guess_guess_isCorrect: boolean;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => GameRound)
  round: GameRound;

  @BelongsTo(() => Choice)
  choice: Choice;
}
