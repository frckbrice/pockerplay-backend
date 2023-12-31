import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { GameSession } from 'src/game/models/game.model';

@Table({
  freezeTableName: true,
  tableName: 'score',
  timestamps: true,
  paranoid: true,
})
export class Score extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => GameSession)
  @Column({ type: DataType.UUID })
  gamesession_id: string;

  @Column({ defaultValue: 0 })
  home_player_score: number;

  @Column({ defaultValue: 0 })
  guess_player_score: number;

  @BelongsTo(() => GameSession)
  gamesession: GameSession;
}
