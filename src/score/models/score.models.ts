import { Table, Column, Model, DataType } from 'sequelize-typescript';

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

  @Column
  home_player_score: number;

  @Column
  guess_player_score: number;
}
