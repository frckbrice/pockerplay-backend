import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { GameRound } from 'src/game_round/models/game_round.model';
import User from 'src/users/models/user.model';

@Table({ tableName: 'message', timestamps: true })
export class Message extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  sender_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  receiver_id: string;

  @ForeignKey(() => GameRound)
  @Column({ type: DataType.UUID })
  round_id: string;

  @Column
  content: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => GameRound)
  gameround: GameRound;
}
