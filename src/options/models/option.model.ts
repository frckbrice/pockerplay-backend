import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  CreatedAt,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Choice } from 'src/choice/models/choice.model';
import { GameRound } from 'src/game_round/models/game_round.model';

@Table({ timestamps: true, freezeTableName: true, tableName: 'options' })
export class Option extends Model {
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

  @BelongsTo(() => GameRound)
  GameRound: GameRound;

  @HasMany(() => Choice)
  choices: Choice[];

  @Column
  proposals: string;

  @Column({ type: DataType.UUID, defaultValue: DataType.NOW() })
  @CreatedAt
  creationDate: Date;
}
