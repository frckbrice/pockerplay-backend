import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { GameSession } from 'src/game/models/game.model';

@Table({ tableName: 'user', timestamps: true, freezeTableName: true })
export default class User extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  username: string;

  @Column
  email: string;

  @Column
  image: string;

  @HasMany(() => GameSession)
  games: GameSession[];
}
