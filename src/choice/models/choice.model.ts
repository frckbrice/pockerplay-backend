import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Option } from 'src/options/models/option.model';

import User from 'src/users/models/user.model';

@Table({ timestamps: true, freezeTableName: true, tableName: 'choice' })
export class Choice extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  player_id: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Option)
  @Column({ type: DataType.UUID })
  option_id: string;

  @BelongsTo(() => Option)
  option: Option;

  @Column
  choice_made: string;

  // @Column
  // @CreatedAt
  // selectAt: Date;
}
