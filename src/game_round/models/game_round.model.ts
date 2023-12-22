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
} from 'sequelize-typescript';
import { GameSession } from 'src/game/models/game.model';

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
  gamesession_id: string;

  @BelongsTo(() => GameSession)
  game: GameSession;

  @Column
  proposals: string;

  @Column
  round_number: number;

  @Column
  number_of_proposals: number;

  @Column
  category: string;
}
