import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/entities/userrole.entity';
import { Association, HasManyGetAssociationsMixin } from 'sequelize';

interface RoleCreationAttrs {
    name: string;
    description: string;
}

@Table
export class Role extends Model<Role, RoleCreationAttrs> {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare description: string;

    @BelongsToMany(() => User, () => UserRole)
    declare users: User[];

    public getUsers!: HasManyGetAssociationsMixin<User>;

    public static associations: {
        users: Association<Role, User>;
    }
}