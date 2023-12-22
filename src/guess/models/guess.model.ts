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
  guessing_user: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Option)
  @Column({ type: DataType.UUID })
  option_id: string;

  @BelongsTo(() => Option)
  option: Option;

  @Column
  guessed_image: string;

  @Column
  opponent_choice: string;

  @Column
  isCorrect: boolean;
}
