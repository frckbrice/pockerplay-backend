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

  @Column({ allowNull: false })
  username: string;

  // @Column({ type: DataType.NUMBER, defaultValue: 0, autoIncrement: true })
  // badge: number;

  // @Column({ allowNull: false })
  // email: string;

  // @Column({ allowNull: false })
  // image: string;

  @HasMany(() => GameSession)
  games: GameSession[];
}
