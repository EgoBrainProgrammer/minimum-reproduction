import { Association } from 'sequelize';
import { Column, Model, DataType, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from '../../modules/users/entities/user.entity';

@Table
export class BaseEntity<TModelAttributes extends {} = any, TCreationAttributes extends {} = TModelAttributes> 
    extends Model<TModelAttributes, TModelAttributes> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    createUserId: number;
    
    @BelongsTo(() => User, { foreignKey: {
        name: "createUserId", 
        allowNull: true
    } })
    createUser: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    updateUserId: number;

    @BelongsTo(() => User, { foreignKey: {
        name: "updateUserId",
        allowNull: true
     } })
    updateUser: User;

    public static associations: {
        createUser: Association<BaseEntity, User>;
        updateUser: Association<BaseEntity, User>;
    }
}