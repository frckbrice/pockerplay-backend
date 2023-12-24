import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { GameRound } from 'src/game_round/models/game_round.model';

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

  @ForeignKey(() => GameRound)
  @Column({ type: DataType.UUID })
  round_id: string;

  @Column({ type: DataType.NUMBER, defaultValue: 0 })
  home_player_score: number;

  @Column({ type: DataType.NUMBER, defaultValue: 0 })
  guess_player_score: number;

  @BelongsTo(() => GameRound)
  round: GameRound;
}
