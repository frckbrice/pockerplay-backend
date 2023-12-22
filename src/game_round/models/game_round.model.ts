import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  // CreatedAt,
  // UpdatedAt,
  // DeletedAt,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { GameSession } from 'src/game/models/game.model';
import { Message } from 'src/messages/models/message.model';
import { Option } from 'src/options/models/option.model';

@Table({ timestamps: true, tableName: 'gamesession', freezeTableName: true })
export class GameRound extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => GameSession)
  @Column({ type: DataType.UUID })
  gamesessionId: string;

  @BelongsTo(() => GameSession)
  game: GameSession;

  @HasMany(() => Message)
  message: Message[];

  @HasMany(() => Option)
  options: Option[];

  @Column
  roundNumber: number;

  // @Column
  // @CreatedAt
  // creationDate: Date;

  // @Column
  // @UpdatedAt
  // updatedOn: Date;

  // @Column
  // @DeletedAt
  // deletionDate: Date;
}
