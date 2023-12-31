import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  // CreatedAt,
  // UpdatedAt,
  // DeletedAt,
  BelongsTo,
  // HasOne,
} from 'sequelize-typescript';
import { GameSession } from 'src/game/models/game.model';
// import { Score } from 'src/score/models/score.models';

@Table({ timestamps: true, tableName: 'gameround', freezeTableName: true })
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
  gamesession_id: string;

  @BelongsTo(() => GameSession)
  game: GameSession;

  @Column({ type: DataType.STRING(10000) })
  proposals: string;

  @Column({ defaultValue: 1 })
  round_number: number;

  @Column({ defaultValue: 5 })
  number_of_proposals: number;

  @Column
  category: string;
}
